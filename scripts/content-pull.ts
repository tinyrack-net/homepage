/**
 * Pull blog articles from Outline (the source of truth) into
 * `content/articles/<routeSlug>/<lang>.md`.
 *
 * Outline layout: Articles / <blog> / <original article> / <translations>
 * Every document declares its language with `lang` in the yaml block.
 * Each article body starts with a ```yaml metadata block; see README.md.
 *
 * Usage: OUTLINE_API_KEY=... node scripts/content-pull.ts
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";

// ---------------------------------------------------------------------------
// Site configuration
// ---------------------------------------------------------------------------

const SITE = {
  /** Outline document whose children are this blog's articles. */
  parentDocumentId: "9c30bf9b-768c-45b2-a7c2-235dec541ef8",
  /** Outline collection that contains the parent document. */
  collectionId: "6bbfb285-728f-482b-9aaf-6b63df7e27d7",
  languages: ["ko", "en", "ja"],
  extension: "md",
  outputDir: "content/articles",
  tagsDir: "content/tags",
};

const OUTLINE_URL = (
  process.env.OUTLINE_URL ?? "https://notes.winetree94.com"
).replace(/\/$/, "");
const OUTLINE_API_KEY = process.env.OUTLINE_API_KEY;
const CACHE_DIR = ".outline-cache/attachments";
const CONCURRENCY = 6;

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

/** Fields allowed in the yaml block of an original article (besides `lang`). */
const ORIGINAL_FIELDS = [
  "routeSlug",
  "publishedAt",
  "updatedAt",
  "tags",
  "featureImage",
  "commentsTerm",
  "excerpt",
] as const;

/** Fields a translation may override (besides `lang`); everything else is inherited. */
const TRANSLATION_FIELDS = ["publishedAt", "updatedAt", "excerpt"] as const;

type Meta = {
  routeSlug: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  featureImage?: string;
  commentsTerm: string;
  excerpt: string;
};

type OutlineNode = { id: string; title: string; children: OutlineNode[] };
type OutlineDocument = { id: string; title: string; text: string };

type ArticleFile = {
  slug: string;
  lang: string;
  title: string;
  meta: Meta;
  body: string;
  source: string;
};

class ContentError extends Error {}

// ---------------------------------------------------------------------------
// Outline API
// ---------------------------------------------------------------------------

async function api<T>(method: string, body: unknown): Promise<T> {
  const response = await fetch(`${OUTLINE_URL}/api/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OUTLINE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(
      `Outline ${method} failed: ${response.status} ${await response.text()}`,
    );
  }
  return ((await response.json()) as { data: T }).data;
}

function findNode(nodes: OutlineNode[], id: string): OutlineNode | undefined {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    const found = findNode(node.children, id);
    if (found) {
      return found;
    }
  }
  return undefined;
}

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, () =>
    (async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await fn(items[index] as T);
      }
    })(),
  );
  await Promise.all(workers);
  return results;
}

// ---------------------------------------------------------------------------
// Conversion
// ---------------------------------------------------------------------------

const YAML_BLOCK = /^\s*```ya?ml\n([\s\S]*?)\n```[ \t]*(?:\n|$)/;
const ATTACHMENT_URL =
  /(?:https?:\/\/[^/\s)]+)?\/api\/attachments\.redirect\?id=([0-9a-f-]{36})/g;
const IS_ATTACHMENT_URL =
  /^(?:https?:\/\/[^/\s)]+)?\/api\/attachments\.redirect\?id=[0-9a-f-]{36}$/;

function splitMetadata(doc: OutlineDocument) {
  const match = YAML_BLOCK.exec(doc.text);
  if (!match) {
    throw new ContentError(
      `"${doc.title}": body must start with a yaml metadata block`,
    );
  }
  let data: unknown;
  try {
    data = parseYaml(match[1] ?? "") ?? {};
  } catch (error) {
    throw new ContentError(`"${doc.title}": invalid yaml (${error})`);
  }
  if (typeof data !== "object" || Array.isArray(data)) {
    throw new ContentError(`"${doc.title}": yaml must be a mapping`);
  }
  return {
    data: data as Record<string, unknown>,
    body: doc.text.slice(match[0].length),
  };
}

function toStringValue(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  // yaml parses unquoted timestamps as Date
  return value instanceof Date ? value.toISOString() : String(value);
}

function readMeta(
  doc: OutlineDocument,
  data: Record<string, unknown>,
  allowed: readonly string[],
): Partial<Meta> {
  const unknown = Object.keys(data).filter((key) => !allowed.includes(key));
  if (unknown.length > 0) {
    throw new ContentError(
      `"${doc.title}": unsupported metadata ${unknown.join(", ")} (allowed: ${allowed.join(", ")})`,
    );
  }
  const meta: Partial<Meta> = {};
  for (const key of allowed) {
    const value = data[key];
    if (key === "tags") {
      if (value === undefined || value === null) {
        continue;
      }
      if (!Array.isArray(value)) {
        throw new ContentError(`"${doc.title}": tags must be a list`);
      }
      meta.tags = value.map(String);
    } else {
      const text = toStringValue(value);
      if (text !== undefined) {
        (meta as Record<string, string>)[key] = text;
      }
    }
  }
  return meta;
}

/** Read and remove the required `lang` field from a yaml block. */
function takeLang(doc: OutlineDocument, data: Record<string, unknown>): string {
  const lang = toStringValue(data.lang);
  delete data.lang;
  if (!lang) {
    throw new ContentError(
      `"${doc.title}": lang is required (${SITE.languages.join(", ")})`,
    );
  }
  if (!SITE.languages.includes(lang)) {
    throw new ContentError(
      `"${doc.title}": unsupported lang "${lang}" (${SITE.languages.join(", ")})`,
    );
  }
  return lang;
}

/** Normalize Outline's markdown export into plain CommonMark/GFM. */
function normalizeBody(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let fence: string | null = null;

  for (const line of lines) {
    const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fence) {
      out.push(line);
      if (fenceMatch?.[1]?.startsWith(fence)) {
        fence = null;
      }
      continue;
    }
    if (fenceMatch) {
      fence = fenceMatch[1] ?? null;
      out.push(line);
      continue;
    }

    // Outline indents standalone images by one space.
    let next = line.replace(/^ (!\[)/, "$1");

    // Outline serializes hard breaks inside blockquotes as a literal "\n".
    const quote = /^((?:> ?)+)/.exec(next)?.[1];
    if (quote) {
      next = next
        .split(/(`[^`]*`)/)
        .map((part, index) =>
          index % 2 === 1 ? part : part.replace(/\\n/g, `\\\n${quote}`),
        )
        .join("");
    }
    out.push(next);
  }

  return `${out
    .join("\n")
    .replace(/^\s+/, "")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd()}\n`;
}

function checkUnsupportedSyntax(file: ArticleFile) {
  const prose = file.body.replace(/^(`{3,}|~{3,})[\s\S]*?^\1/gm, "");
  const problems: string[] = [];
  if (/^:::/m.test(prose)) {
    problems.push("notice blocks (:::)");
  }
  if (/@\[[^\]]*\]\(mention:\/\//.test(prose)) {
    problems.push("mentions");
  }
  if (/\]\(\/doc\//.test(prose)) {
    problems.push("links to other Outline documents");
  }
  if (problems.length > 0) {
    throw new ContentError(
      `"${file.source}": unsupported Outline syntax: ${problems.join(", ")}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Attachments
// ---------------------------------------------------------------------------

function safeFileName(name: string): string {
  const cleaned = name
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}._-]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || "attachment";
}

/** Download an attachment into the cache unless it is already there. */
async function cacheAttachment(id: string): Promise<string> {
  const dir = join(CACHE_DIR, id);
  if (existsSync(dir)) {
    const [file] = readdirSync(dir);
    if (file) {
      return join(dir, file);
    }
  }
  const response = await fetch(
    `${OUTLINE_URL}/api/attachments.redirect?id=${id}`,
    { headers: { Authorization: `Bearer ${OUTLINE_API_KEY}` } },
  );
  if (!response.ok) {
    throw new Error(`attachment ${id}: ${response.status}`);
  }
  const disposition = response.headers.get("content-disposition") ?? "";
  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(disposition)?.[1];
  const plain = /filename="?([^";]+)"?/i.exec(disposition)?.[1];
  const name = safeFileName(
    encoded ? decodeURIComponent(encoded) : (plain ?? id),
  );
  const data = Buffer.from(await response.arrayBuffer());
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const path = join(dir, name);
  writeFileSync(path, data);
  return path;
}

/** Pick a file name per attachment id that is unique within one article. */
function assignFileNames(
  ids: string[],
  cached: Map<string, string>,
): Map<string, string> {
  const names = new Map<string, string>();
  const used = new Set<string>();
  for (const id of ids) {
    const base = (cached.get(id) as string).split(/[\\/]/).pop() as string;
    const name = used.has(base.toLowerCase())
      ? `${id.slice(0, 8)}-${base}`
      : base;
    used.add(name.toLowerCase());
    names.set(id, name);
  }
  return names;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function knownTags(): Set<string> {
  return new Set(
    readdirSync(SITE.tagsDir)
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.replace(/\.json$/, "")),
  );
}

function yamlValue(value: unknown): string {
  return Array.isArray(value)
    ? `[${value.map((item) => JSON.stringify(item)).join(", ")}]`
    : JSON.stringify(value);
}

function renderFile(file: ArticleFile, featureImage?: string): string {
  const frontmatter: Record<string, unknown> = {
    title: file.title,
    excerpt: file.meta.excerpt,
    lang: file.lang,
    routeSlug: file.meta.routeSlug,
    translationKey: file.meta.routeSlug,
    publishedAt: file.meta.publishedAt,
    updatedAt: file.meta.updatedAt,
    tags: file.meta.tags,
    featureImage,
    commentsTerm: file.meta.commentsTerm,
    draft: false,
  };
  const lines = Object.entries(frontmatter)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: ${yamlValue(value)}`);
  return `---\n${lines.join("\n")}\n---\n\n${file.body}`;
}

async function collectArticles(): Promise<ArticleFile[][]> {
  const tree = await api<OutlineNode[]>("collections.documents", {
    id: SITE.collectionId,
  });
  const parent = findNode(tree, SITE.parentDocumentId);
  if (!parent) {
    throw new ContentError(
      `parent document ${SITE.parentDocumentId} not found (is it published?)`,
    );
  }

  const tags = knownTags();
  const slugs = new Set<string>();

  return mapLimit(parent.children, CONCURRENCY, async (node) => {
    const original = await api<OutlineDocument>("documents.info", {
      id: node.id,
    });
    const { data, body } = splitMetadata(original);
    const originalLang = takeLang(original, data);
    const meta = readMeta(original, data, ORIGINAL_FIELDS);
    for (const key of ["routeSlug", "publishedAt", "commentsTerm"] as const) {
      if (!meta[key]) {
        throw new ContentError(`"${original.title}": ${key} is required`);
      }
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.routeSlug as string)) {
      throw new ContentError(
        `"${original.title}": routeSlug must be kebab-case`,
      );
    }
    if (slugs.has(meta.routeSlug as string)) {
      throw new ContentError(`duplicate routeSlug "${meta.routeSlug}"`);
    }
    slugs.add(meta.routeSlug as string);
    const unknownTags = (meta.tags ?? []).filter((tag) => !tags.has(tag));
    if (unknownTags.length > 0) {
      throw new ContentError(
        `"${original.title}": unknown tags ${unknownTags.join(", ")} (add them to ${SITE.tagsDir})`,
      );
    }

    const base: Meta = {
      tags: [],
      excerpt: "",
      ...meta,
    } as Meta;
    const files: ArticleFile[] = [
      {
        slug: base.routeSlug,
        lang: originalLang,
        title: original.title.trim(),
        meta: base,
        body: normalizeBody(body),
        source: original.title,
      },
    ];

    for (const child of node.children) {
      const translation = await api<OutlineDocument>("documents.info", {
        id: child.id,
      });
      if (child.children.length > 0) {
        throw new ContentError(
          `"${translation.title}": translations cannot have child documents`,
        );
      }
      const split = splitMetadata(translation);
      const lang = takeLang(translation, split.data);
      if (files.some((file) => file.lang === lang)) {
        throw new ContentError(
          `"${translation.title}": "${original.title}" already has a ${lang} version`,
        );
      }
      const overrides = readMeta(translation, split.data, TRANSLATION_FIELDS);
      files.push({
        slug: base.routeSlug,
        lang,
        title: translation.title.trim(),
        meta: { ...base, excerpt: "", ...overrides },
        body: normalizeBody(split.body),
        source: translation.title,
      });
    }

    for (const file of files) {
      checkUnsupportedSyntax(file);
    }
    return files;
  });
}

async function main() {
  if (!OUTLINE_API_KEY) {
    throw new ContentError(
      "OUTLINE_API_KEY is not set. Create a read-only API key in Outline and export it.",
    );
  }

  const articles = await collectArticles();

  // Download every referenced attachment (cached by immutable attachment id).
  const ids = new Set<string>();
  for (const files of articles) {
    for (const file of files) {
      for (const text of [file.body, file.meta.featureImage ?? ""]) {
        for (const match of text.matchAll(ATTACHMENT_URL)) {
          ids.add(match[1] as string);
        }
      }
    }
  }
  const cached = new Map<string, string>();
  await mapLimit([...ids], CONCURRENCY, async (id) => {
    cached.set(id, await cacheAttachment(id));
  });

  // Write a fresh output directory so removed articles disappear.
  rmSync(SITE.outputDir, { recursive: true, force: true });
  for (const files of articles) {
    const slug = files[0]?.slug as string;
    const dir = join(SITE.outputDir, slug);
    mkdirSync(dir, { recursive: true });

    const articleIds = [
      ...new Set(
        files.flatMap((file) =>
          [file.meta.featureImage ?? "", file.body].flatMap((text) =>
            [...text.matchAll(ATTACHMENT_URL)].map(
              (match) => match[1] as string,
            ),
          ),
        ),
      ),
    ];
    const names = assignFileNames(articleIds, cached);
    if (names.size > 0) {
      mkdirSync(join(dir, "attachments"), { recursive: true });
      for (const [id, name] of names) {
        cpSync(cached.get(id) as string, join(dir, "attachments", name));
      }
    }
    const localize = (text: string) =>
      text.replace(
        ATTACHMENT_URL,
        (_, id: string) => `./attachments/${names.get(id)}`,
      );

    for (const file of files) {
      if (
        file.meta.featureImage &&
        !IS_ATTACHMENT_URL.test(file.meta.featureImage)
      ) {
        throw new ContentError(
          `"${file.source}": featureImage must be an Outline attachment`,
        );
      }
      const featureImage = file.meta.featureImage
        ? localize(file.meta.featureImage)
        : undefined;
      const output = renderFile(
        { ...file, body: localize(file.body) },
        featureImage,
      );
      writeFileSync(join(dir, `${file.lang}.${SITE.extension}`), output);
    }
  }

  // Drop cached attachments that are no longer referenced.
  if (existsSync(CACHE_DIR)) {
    for (const id of readdirSync(CACHE_DIR)) {
      if (!ids.has(id)) {
        rmSync(join(CACHE_DIR, id), { recursive: true, force: true });
      }
    }
  }

  const fileCount = articles.reduce((sum, files) => sum + files.length, 0);
  console.log(
    `Pulled ${articles.length} articles (${fileCount} files, ${ids.size} attachments) into ${SITE.outputDir}`,
  );
}

main().catch((error) => {
  console.error(
    error instanceof ContentError ? `content error: ${error.message}` : error,
  );
  process.exitCode = 1;
});
