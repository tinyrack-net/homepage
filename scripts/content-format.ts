/**
 * Pure parsing helpers for Outline article documents (no I/O).
 *
 * Every article document starts with the same header:
 *
 *   ![](/api/attachments.redirect?id=<attachment-id>)   <- feature image
 *
 *   ```yaml
 *   lang: "ko"
 *   ...
 *   ```
 *
 *   ---
 *
 *   body...
 *
 * The image is required in originals and optional in translations.
 */
import { parse as parseYaml } from "yaml";

export class ContentError extends Error {}

export const ATTACHMENT_URL =
  /(?:https?:\/\/[^/\s)]+)?\/api\/attachments\.redirect\?id=([0-9a-f-]{36})/g;
const IS_ATTACHMENT_URL =
  /^(?:https?:\/\/[^/\s)]+)?\/api\/attachments\.redirect\?id=[0-9a-f-]{36}$/;

/** A standalone image line, optionally with an Outline size title (" =WxH"). */
const IMAGE_LINE =
  /^[ \t]*!\[([^\]]*)\]\(\s*([^\s)]+)(?:\s+"[^"]*")?\s*\)[ \t]*$/;
const YAML_OPEN = /^[ \t]*```ya?ml[ \t]*$/;
const FENCE_CLOSE = /^[ \t]*```[ \t]*$/;
/** Outline exports dividers as `---`, `***` or `* * *`. */
const THEMATIC_BREAK = /^ {0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/;

export const HEADER_HINT =
  "documents must start with: feature image, yaml block, --- divider";

export type Header = {
  /** Feature image attachment URL, if the document has one. */
  image?: string;
  /** Parsed yaml metadata. */
  data: Record<string, unknown>;
  /** Everything after the divider. */
  body: string;
};

export function isAttachmentUrl(url: string): boolean {
  return IS_ATTACHMENT_URL.test(url);
}

/** Split an Outline document into feature image, yaml metadata and body. */
export function parseHeader(text: string, source: string): Header {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  let index = 0;
  const skipBlank = () => {
    while (index < lines.length && (lines[index] ?? "").trim() === "") {
      index++;
    }
  };

  skipBlank();
  let image: string | undefined;
  const imageMatch = IMAGE_LINE.exec(lines[index] ?? "");
  if (imageMatch) {
    image = imageMatch[2] as string;
    if (!isAttachmentUrl(image)) {
      throw new ContentError(
        `"${source}": feature image must be an Outline attachment`,
      );
    }
    index++;
    skipBlank();
  }

  if (!YAML_OPEN.test(lines[index] ?? "")) {
    throw new ContentError(`"${source}": missing yaml block (${HEADER_HINT})`);
  }
  const start = ++index;
  while (index < lines.length && !FENCE_CLOSE.test(lines[index] ?? "")) {
    index++;
  }
  if (index >= lines.length) {
    throw new ContentError(`"${source}": yaml block is not closed`);
  }
  const yamlText = lines.slice(start, index).join("\n");
  index++;

  skipBlank();
  if (!THEMATIC_BREAK.test(lines[index] ?? "")) {
    throw new ContentError(
      `"${source}": missing --- divider after the yaml block (${HEADER_HINT})`,
    );
  }
  index++;

  let data: unknown;
  try {
    data = parseYaml(yamlText) ?? {};
  } catch (error) {
    throw new ContentError(`"${source}": invalid yaml (${error})`);
  }
  if (typeof data !== "object" || Array.isArray(data)) {
    throw new ContentError(`"${source}": yaml must be a mapping`);
  }
  if ("featureImage" in (data as object)) {
    throw new ContentError(
      `"${source}": featureImage is not a yaml field; put the image above the yaml block`,
    );
  }

  return {
    image,
    data: data as Record<string, unknown>,
    body: lines.slice(index).join("\n"),
  };
}

/** Normalize Outline's markdown export into plain CommonMark/GFM. */
export function normalizeBody(markdown: string): string {
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

/** Reject Outline-only syntax that the site cannot render. */
export function checkUnsupportedSyntax(source: string, body: string) {
  const prose = body.replace(/^(`{3,}|~{3,})[\s\S]*?^\1/gm, "");
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
      `"${source}": unsupported Outline syntax: ${problems.join(", ")}`,
    );
  }
}
