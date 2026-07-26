import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { finalizeStaticSiteBuild } from "@tinyrack/docs/react-router";

function copyMedia(root: string, clientDir: string): void {
  const contentDir = join(root, "content");
  for (const collection of ["articles", "pages"] as const) {
    const collectionDir = join(contentDir, collection);
    if (!existsSync(collectionDir)) {
      continue;
    }
    for (const group of readdirSync(collectionDir, { withFileTypes: true })) {
      if (!group.isDirectory()) {
        continue;
      }
      const attachments = join(collectionDir, group.name, "attachments");
      if (!existsSync(attachments)) {
        continue;
      }
      const dest = join(clientDir, "media", collection, group.name);
      mkdirSync(dest, { recursive: true });
      for (const file of readdirSync(attachments, { withFileTypes: true })) {
        if (file.isFile()) {
          copyFileSync(join(attachments, file.name), join(dest, file.name));
        }
      }
    }
  }
}

export async function finalizeBuild({
  root,
  clientDir,
}: {
  root: string;
  clientDir: string;
}): Promise<void> {
  copyMedia(root, clientDir);
  finalizeStaticSiteBuild(clientDir, { mode: "spa-fallback" });
}
