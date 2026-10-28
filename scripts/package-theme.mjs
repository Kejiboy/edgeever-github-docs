import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/**
 * 发布产物：
 *   dist/manifest.json  主题清单（Release 资产，文件名固定）
 *   dist/index.json     带校验和的清单，供自己核对
 *
 * EdgeEver 按文件名取 Release 资产，所以不要改 manifest.json 这个名字。
 */
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(root, "themes/github-docs/manifest.json"), "utf8");
const manifest = JSON.parse(source);

mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist/manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

const bytes = new TextEncoder().encode(`${JSON.stringify(manifest, null, 2)}\n`);
const digest = await crypto.subtle.digest("SHA-256", bytes);
const sha256 = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");

writeFileSync(
  join(root, "dist/index.json"),
  `${JSON.stringify({
    id: manifest.id,
    name: manifest.name,
    version: manifest.version,
    modes: manifest.modes,
    checksums: { manifestJson: sha256 },
    bytes: bytes.byteLength,
  }, null, 2)}\n`,
);

console.log(`built dist/manifest.json (${bytes.byteLength} bytes)`);
console.log(`sha256 ${sha256}`);
