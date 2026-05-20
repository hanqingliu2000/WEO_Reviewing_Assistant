import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const distDir = join(process.cwd(), "dist");
const indexPath = join(distDir, "index.html");
let html = readFileSync(indexPath, "utf8");

html = html.replace(
  /<link rel="stylesheet" crossorigin href="\.\/([^"]+)">/,
  (_, assetPath) => `<style>\n${readFileSync(join(distDir, assetPath), "utf8")}\n</style>`,
);

html = html.replace(
  /<script type="module" crossorigin src="\.\/([^"]+)"><\/script>/,
  (_, assetPath) => `<script type="module">\n${readFileSync(join(distDir, assetPath), "utf8")}\n</script>`,
);

writeFileSync(indexPath, html);
