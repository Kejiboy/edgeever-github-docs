import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/**
 * 两处 manifest.json 必须逐字节一致：
 *   themes/github-docs/manifest.json  唯一可编辑源文件
 *   manifest.json                     仓库根副本，EdgeEver 安装仓库地址时读取的就是它
 *
 * 不执行 `npm run sync` 就直接改源文件时，这里会失败并给出修复命令。
 */
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "themes/github-docs/manifest.json");
const rootCopy = join(root, "manifest.json");
const read = (path) => readFileSync(path, "utf8");
const a = read(source);
const b = read(rootCopy);

if (a !== b) {
  console.error("FAIL manifest.json does not match themes/github-docs/manifest.json");
  console.error("     Run `npm run sync` to regenerate the repository-root copy.");
  process.exit(1);
}

const manifest = JSON.parse(a);
if (manifest.type !== "theme" || !manifest.version) {
  console.error("FAIL manifest.json is not a theme manifest with a version");
  process.exit(1);
}
console.log(`pass root manifest.json matches the source theme (version ${manifest.version})`);
