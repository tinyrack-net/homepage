/**
 * Replace `content/articles` with the small, stable fixture set used by tests
 * and pull-request builds. Real articles come from `pnpm content:pull`.
 */
import { cpSync, rmSync } from "node:fs";

const OUTPUT_DIR = "content/articles";
const FIXTURES_DIR = "fixtures/articles";

rmSync(OUTPUT_DIR, { recursive: true, force: true });
cpSync(FIXTURES_DIR, OUTPUT_DIR, { recursive: true });
console.log(`Copied ${FIXTURES_DIR} into ${OUTPUT_DIR}`);
