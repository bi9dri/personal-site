import { buildSite } from "./src/builder.ts";
import type { BuildConfig } from "./src/types.ts";
import { resolve } from "node:path";

const config: BuildConfig = {
	templatePath: resolve(import.meta.dir, "template/template.html"),
	pagesDir: resolve(import.meta.dir, "pages"),
	assetsDir: resolve(import.meta.dir, "assets"),
	outputDir: resolve(import.meta.dir, "dist"),
	cssPath: resolve(import.meta.dir, "template/styles.css"),
};

await buildSite(config);
