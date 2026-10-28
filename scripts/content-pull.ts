/**
 * Pull blog articles from Outline (the source of truth) into
 * `content/articles/<routeSlug>/<lang>.md`.
 *
 * Outline layout: <blog collection> / <original article> / <translations>
 * Every document starts with a feature image, a ```yaml metadata block that
 * declares `lang`, and a `---` divider; see README.md and content-format.ts.
 *
 * Usage:
 *   OUTLINE_API_KEY=... node scripts/content-pull.ts          # published only
 *   OUTLINE_API_KEY=... node scripts/content-pull.ts --check  # validate all,
 *                                                     including drafts; no writes
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
import {
  ATTACHMENT_URL,
  ContentError,
  checkUnsupportedSyntax,
  normalizeBody,
  parseHeader,
} from "./content-format.ts";

// ---------------------------------------------------------------------------
// Site configuration
// ---------------------------------------------------------------------------

const SITE = {
  /** Outline collection whose top-level documents are this blog's articles. */
  collectionId: "5bee6c64-68ba-4227-931c-1f56344df64a",
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
const CHECK = process.argv.includes("--check");

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

/** Fields allowed in the yaml block of an original article (besides `lang`). */
const ORIGINAL_FIELDS = [
  "routeSlug",
  "publishedAt",
  "updatedAt",
  "tags",
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
  featureImage: string;
  commentsTerm: string;
  excerpt: string;
};

type OutlineNode = { id: string; title: string; children: OutlineNode[] };
type OutlineDocument = {
  id: string;
  title: string;
  text: string;
  publishedAt: string | null;
  parentDocumentId?: string | null;
};

type ArticleFile = {
  slug: string;
  lang: string;
  title: string;
  meta: Meta;
  body: string;
  source: string;
};

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

/**
 * The collection tree only lists published documents. When checking, attach
 * the collection's drafts to it: drafts without a parent are new articles,
 * the rest belong under their parent (usually draft translations).
 */
async function withDrafts(tree: OutlineNode[]): Promise<OutlineNode[]> {
  const drafts: OutlineDocument[] = [];
  for (let offset = 0; ; offset += 100) {
    const page = await api<OutlineDocument[]>("documents.drafts", {
      collectionId: SITE.collectionId,
      limit: 100,
      offset,
    });
    drafts.push(...page);
    if (page.length < 100) {
      break;
    }
  }
  const nodes = new Map<string, OutlineNode>();
  const index = (list: OutlineNode[]) => {
    for (const node of list) {
      nodes.set(node.id, node);
      index(node.children);
    }
  };
  index(tree);
  for (const draft of drafts) {
    nodes.set(draft.id, { id: draft.id, title: draft.title, children: [] });
  }
  const roots = [...tree];
  for (const draft of drafts) {
    const node = nodes.get(draft.id) as OutlineNode;
    const parent = draft.parentDocumentId
      ? nodes.get(draft.parentDocumentId)
      : undefined;
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
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
// Metadata parsing
// ---------------------------------------------------------------------------

function toStringValue(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  // yaml parses unquoted timestamps as Date
  return value instanceof Date ? value.toISOString() : String(value);
}

function readMeta(
  source: string,
  data: Record<string, unknown>,
  allowed: readonly string[],
): Partial<Meta> {
  const unknown = Object.keys(data).filter((key) => !allowed.includes(key));
  if (unknown.length > 0) {
    throw new ContentError(
      `"${source}": unsupported metadata ${unknown.join(", ")} (allowed: lang, ${allowed.join(", ")})`,
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
        throw new ContentError(`"${source}": tags must be a list`);
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
function takeLang(source: string, data: Record<string, unknown>): string {
  const lang = toStringValue(data.lang);
  delete data.lang;
  if (!lang) {
    throw new ContentError(
      `"${source}": lang is required (${SITE.languages.join(", ")})`,
    );
  }
  if (!SITE.languages.includes(lang)) {
    throw new ContentError(
      `"${source}": unsupported lang "${lang}" (${SITE.languages.join(", ")})`,
    );
  }
  return lang;
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
// Collection
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

function renderFile(file: ArticleFile): string {
  const frontmatter: Record<string, unknown> = {
    title: file.title,
    excerpt: file.meta.excerpt,
    lang: file.lang,
    routeSlug: file.meta.routeSlug,
    translationKey: file.meta.routeSlug,
    publishedAt: file.meta.publishedAt,
    updatedAt: file.meta.updatedAt,
    tags: file.meta.tags,
    featureImage: file.meta.featureImage,
    commentsTerm: file.meta.commentsTerm,
    draft: false,
  };
  const lines = Object.entries(frontmatter)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: ${yamlValue(value)}`);
  return `---\n${lines.join("\n")}\n---\n\n${file.body}`;
}

/** Label used in messages; drafts are marked so check output is unambiguous. */
function sourceOf(doc: OutlineDocument): string {
  return doc.publishedAt ? doc.title : `${doc.title} [draft]`;
}

type Collected = { articles: ArticleFile[][]; errors: string[] };

/**
 * Read every article in the blog collection. Drafts are skipped unless
 * checking. Errors are collected per article so one run reports them all.
 */
async function collectArticles(): Promise<Collected> {
  const published = await api<OutlineNode[]>("collections.documents", {
    id: SITE.collectionId,
  });
  const tree = CHECK ? await withDrafts(published) : published;
  const tags = knownTags();
  const errors: string[] = [];
  const warnings: string[] = [];

  const results = await mapLimit(tree, CONCURRENCY, async (node) => {
    const original = await api<OutlineDocument>("documents.info", {
      id: node.id,
    });
    if (!(CHECK || original.publishedAt)) {
      return undefined;
    }
    try {
      return await readArticle(node, original, tags, warnings);
    } catch (error) {
      if (error instanceof ContentError) {
        errors.push(error.message);
        return undefined;
      }
      throw error;
    }
  });

  const articles = results.filter((files) => files !== undefined);
  const slugs = new Map<string, string>();
  for (const files of articles) {
    const first = files[0] as ArticleFile;
    const previous = slugs.get(first.slug);
    if (previous) {
      errors.push(
        `duplicate routeSlug "${first.slug}" ("${previous}", "${first.source}")`,
      );
    }
    slugs.set(first.slug, first.source);
  }
  for (const warning of warnings) {
    console.warn(`content warning: ${warning}`);
  }
  return { articles, errors };
}

async function readArticle(
  node: OutlineNode,
  original: OutlineDocument,
  tags: Set<string>,
  warnings: string[],
): Promise<ArticleFile[]> {
  const source = sourceOf(original);
  const header = parseHeader(original.text, source);
  const originalLang = takeLang(source, header.data);
  const meta = readMeta(source, header.data, ORIGINAL_FIELDS);
  if (!header.image) {
    throw new ContentError(`"${source}": feature image is required`);
  }
  for (const key of ["routeSlug", "publishedAt", "commentsTerm"] as const) {
    if (!meta[key]) {
      throw new ContentError(`"${source}": ${key} is required`);
    }
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.routeSlug as string)) {
    throw new ContentError(`"${source}": routeSlug must be kebab-case`);
  }
  const unknownTags = (meta.tags ?? []).filter((tag) => !tags.has(tag));
  if (unknownTags.length > 0) {
    throw new ContentError(
      `"${source}": unknown tags ${unknownTags.join(", ")} (add them to ${SITE.tagsDir})`,
    );
  }

  const base = {
    tags: [],
    excerpt: "",
    ...meta,
    featureImage: header.image,
  } as Meta;
  const files: ArticleFile[] = [
    {
      slug: base.routeSlug,
      lang: originalLang,
      title: original.title.trim(),
      meta: base,
      body: normalizeBody(header.body),
      source,
    },
  ];

  for (const child of node.children) {
    const translation = await api<OutlineDocument>("documents.info", {
      id: child.id,
    });
    if (!(CHECK || translation.publishedAt)) {
      continue;
    }
    const childSource = sourceOf(translation);
    if (child.children.length > 0) {
      throw new ContentError(
        `"${childSource}": translations cannot have child documents`,
      );
    }
    const split = parseHeader(translation.text, childSource);
    const lang = takeLang(childSource, split.data);
    if (files.some((file) => file.lang === lang)) {
      throw new ContentError(
        `"${childSource}": "${source}" already has a ${lang} version`,
      );
    }
    const overrides = readMeta(childSource, split.data, TRANSLATION_FIELDS);
    files.push({
      slug: base.routeSlug,
      lang,
      title: translation.title.trim(),
      meta: {
        ...base,
        excerpt: "",
        ...overrides,
        featureImage: split.image ?? base.featureImage,
      },
      body: normalizeBody(split.body),
      source: childSource,
    });
  }

  for (const file of files) {
    checkUnsupportedSyntax(file.source, file.body);
  }
  const missing = SITE.languages.filter(
    (lang) => !files.some((file) => file.lang === lang),
  );
  if (missing.length > 0) {
    warnings.push(`"${source}": missing translations ${missing.join(", ")}`);
  }
  return files;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function writeArticles(articles: ArticleFile[][]) {
  // Download every referenced attachment (cached by immutable attachment id).
  const ids = new Set<string>();
  for (const files of articles) {
    for (const file of files) {
      for (const text of [file.body, file.meta.featureImage]) {
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
          [file.meta.featureImage, file.body].flatMap((text) =>
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
      const output = renderFile({
        ...file,
        meta: { ...file.meta, featureImage: localize(file.meta.featureImage) },
        body: localize(file.body),
      });
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
  return ids.size;
}

async function main() {
  if (!OUTLINE_API_KEY) {
    throw new ContentError(
      "OUTLINE_API_KEY is not set. Create a read-only API key in Outline and export it.",
    );
  }

  const { articles, errors } = await collectArticles();
  if (errors.length > 0) {
    throw new ContentError(
      `${errors.length} problem(s) found:\n  - ${errors.join("\n  - ")}`,
    );
  }

  const fileCount = articles.reduce((sum, files) => sum + files.length, 0);
  if (CHECK) {
    console.log(
      `Checked ${articles.length} articles (${fileCount} files, drafts included): no problems`,
    );
    return;
  }
  const attachmentCount = await writeArticles(articles);
  console.log(
    `Pulled ${articles.length} articles (${fileCount} files, ${attachmentCount} attachments) into ${SITE.outputDir}`,
  );
}

main().catch((error) => {
  console.error(
    error instanceof ContentError ? `content error: ${error.message}` : error,
  );
  process.exitCode = 1;
});
