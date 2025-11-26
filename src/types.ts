export interface PageMetadata {
	filename: string;
	title?: string; // Optional: if provided, overrides title from markdown
	outputPath: string;
	hasTableOfContents: boolean;
}

export interface BuildConfig {
	templatePath: string;
	pagesDir: string;
	assetsDir: string;
	outputDir: string;
	cssPath: string;
	minify?: boolean;
}

export interface TableOfContentsItem {
	id: string;
	text: string;
	level: number;
}
