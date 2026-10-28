import { copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/** 把主题源文件复制到仓库根。EdgeEver 安装“仓库地址”时只读取根目录的 manifest.json。 */
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
copyFileSync(join(root, "themes/github-docs/manifest.json"), join(root, "manifest.json"));
console.log("synced themes/github-docs/manifest.json -> manifest.json");
