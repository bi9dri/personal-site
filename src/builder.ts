import { readdir, rm, mkdir } from "node:fs/promises";
import { join, basename } from "node:path";
import type { BuildConfig, PageMetadata } from "./types.ts";
import { parseMarkdown } from "./markdown.ts";
import { loadTemplate, injectContent } from "./template.ts";
import { minifyHTML, minifyCSS } from "./minify.ts";
import { PAGE_TITLES } from "./constants.ts";

export async function buildSite(config: BuildConfig): Promise<void> {
	console.log("🔨 Building site...");

	// Clean output directory
	await cleanOutputDir(config.outputDir);

	// Discover pages
	const pages = await discoverPages(config.pagesDir);
	console.log(`📄 Found ${pages.length} page(s)`);

	// Load template
	const template = await loadTemplate(config.templatePath);

	// Build each page
	for (const page of pages) {
		await buildPage(page, template, config);
	}

	// Copy assets
	await copyAssets(config.assetsDir, join(config.outputDir, "assets"));

	// Copy CSS
	await copyCSSFile(config.cssPath, join(config.outputDir, "styles.css"), config.minify);

	console.log("✅ Build complete!");
}

export async function cleanOutputDir(dir: string): Promise<void> {
	try {
		await rm(dir, { recursive: true, force: true });
	} catch (error) {
		// Directory might not exist, that's okay
	}

	await mkdir(dir, { recursive: true });
}

export async function discoverPages(pagesDir: string): Promise<PageMetadata[]> {
	const files = await readdir(pagesDir);
	const mdFiles = files.filter((file) => file.endsWith(".md"));

	return mdFiles.map((file) => {
		const filename = basename(file, ".md");
		const outputFilename =
			filename === "index" ? "index.html" : `${filename}.html`;

		return {
			filename: file,
			title: PAGE_TITLES[file], // Use defined title from constants, or undefined if not defined
			outputPath: outputFilename,
			hasTableOfContents: false, // Will be determined dynamically based on TOC length
		};
	});
}

export async function buildPage(
	metadata: PageMetadata,
	template: string,
	config: BuildConfig,
): Promise<void> {
	console.log(`  Building ${metadata.filename}...`);

	// Read markdown file
	const mdPath = join(config.pagesDir, metadata.filename);
	const mdFile = Bun.file(mdPath);
	const mdContent = await mdFile.text();

	// Parse markdown
	const { html, title: markdownTitle, toc } = parseMarkdown(mdContent);

	// Use defined title from metadata, or fall back to markdown title
	const finalTitle = metadata.title ?? markdownTitle;

	// Inject content into template
	const currentPage = `/${metadata.outputPath}`;
	let finalHtml = injectContent(template, html, finalTitle, toc, currentPage);

	// Minify if enabled
	if (config.minify) {
		finalHtml = minifyHTML(finalHtml);
	}

	// Write output
	const outputPath = join(config.outputDir, metadata.outputPath);
	await Bun.write(outputPath, finalHtml);

	console.log(`    ✓ ${metadata.outputPath}`);
}

export async function copyAssets(
	sourceDir: string,
	destDir: string,
): Promise<void> {
	console.log("  Copying assets...");

	await mkdir(destDir, { recursive: true });

	const files = await readdir(sourceDir);

	for (const file of files) {
		const sourcePath = join(sourceDir, file);
		const destPath = join(destDir, file);
		await copyFile(sourcePath, destPath);
	}

	console.log(`    ✓ Copied ${files.length} asset(s)`);
}

async function copyFile(source: string, dest: string): Promise<void> {
	const file = Bun.file(source);
	const content = await file.arrayBuffer();
	await Bun.write(dest, content);
}

async function copyCSSFile(source: string, dest: string, shouldMinify?: boolean): Promise<void> {
	const file = Bun.file(source);
	let content = await file.text();

	if (shouldMinify) {
		content = minifyCSS(content);
	}

	await Bun.write(dest, content);
}
