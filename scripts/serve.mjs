import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** 把 public/ 下的静态页面跑在本地，方便检查生成器与演示页。 */
export const handler = (request, response) => {
  const url = new URL(request.url, "http://localhost");
  const routes = {
    "/": ["forge/index.html", "text/html; charset=utf-8"],
    "/forge/": ["forge/index.html", "text/html; charset=utf-8"],
    "/demo/": ["demo/index.html", "text/html; charset=utf-8"],
    "/manifest.json": ["dist/manifest.json", "application/json; charset=utf-8"],
  };
  const matcher = routes[url.pathname];
  if (!matcher) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }
  try {
    response.writeHead(200, { "content-type": matcher[1], "cache-control": "no-store" });
    response.end(readFileSync(join(root, matcher[0])));
  } catch {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end("Run `npm run package` first so dist/ exists.");
  }
};

export const createServer = async (port = 4321, host = "127.0.0.1") => {
  const { createServer: create } = await import("node:http");
  const server = create(handler);
  await new Promise((resolve) => server.listen(port, host, resolve));
  return server;
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 4321);
  const server = await createServer(port);
  console.log(`Serving http://127.0.0.1:${port}/  (generator)`);
  console.log(`        http://127.0.0.1:${port}/demo/  (theme preview)`);
}
