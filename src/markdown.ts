import { marked, type Tokens } from "marked";
import type { TableOfContentsItem } from "./types.ts";

// Custom container extension for :::container syntax
const containerExtension = {
	name: "container",
	level: "block" as const,
	start(src: string) {
		return src.match(/^:::/)?.index;
	},
	tokenizer(src: string) {
		const match = src.match(/^:::(\w+)\n([\s\S]*?)\n:::/);
		if (match) {
			const [raw, type, content] = match;
			return {
				type: "container",
				raw,
				containerType: type,
				text: content.trim(),
			};
		}
		return undefined;
	},
	renderer(token: Tokens.Generic) {
		const type = token.containerType as string;
		const content = token.text as string;

		if (type === "profile-header") {
			return renderProfileHeader(content);
		}
		if (type === "scrollable-list") {
			return renderScrollableList(content);
		}

		return `<div class="container-${type}">${content}</div>`;
	},
};

function renderProfileHeader(content: string): string {
	const lines = content.split("\n").filter((line) => line.trim());

	// Extract image, name, and message
	const imageMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/);
	const imageSrc = imageMatch
		? imageMatch[2].replace("./assets/", "/assets/")
		: "";
	const imageAlt = imageMatch ? imageMatch[1] : "";

	// Get lines after image
	const textLines = lines.slice(1); // Skip the image line
	const name = textLines[0] || "";
	const message = textLines.slice(1).join("\n") || "";

	// Return HTML without leading whitespace (to avoid markdown treating it as code)
	return `<div class="profile-header">
<div class="profile-icon-wrapper">
<img src="${imageSrc}" alt="${imageAlt}" class="profile-icon" />
<div class="profile-name">${name}</div>
</div>
<div class="profile-message">${message}</div>
</div>`;
}

function renderScrollableList(content: string): string {
	const parser = new marked.Parser();
	const lexer = new marked.Lexer();
	const tokens = lexer.lex(content);
	const html = parser.parse(tokens);

	return `<div class="scrollable-list">${html}</div>`;
}

// Create custom marked instance
export function createCustomMarked() {
	marked.use({
		extensions: [containerExtension],
	});

	return marked;
}

// Parse markdown content and extract metadata
export function parseMarkdown(content: string): {
	html: string;
	title: string;
	toc: TableOfContentsItem[];
} {
	// Extract title from first H1 or first H2
	const titleMatch = content.match(/^#\s+(.+)$/m);
	let title: string;

	if (titleMatch) {
		title = titleMatch[1];
	} else {
		// If no H1, try to get title from first H2
		const h2Match = content.match(/^##\s+(.+)$/m);
		title = h2Match ? h2Match[1] : "Untitled";
	}

	// Generate TOC from H2 headings
	const toc = generateTableOfContents(content);

	// Process content
	let processedContent = content;
	processedContent = processImagePaths(processedContent);
	processedContent = processLinks(processedContent);
	processedContent = processCustomContainers(processedContent);
	processedContent = addHeadingIds(processedContent);

	// Convert to HTML using marked (without custom extensions)
	const html = marked.parse(processedContent) as string;

	return { html, title, toc };
}

// Process custom containers before marked.js parsing
function processCustomContainers(content: string): string {
	// Normalize line endings to \n only
	let processedContent = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

	// Process profile-header containers
	processedContent = processedContent.replace(
		/:::profile-header\n([\s\S]*?)\n:::/g,
		(match, innerContent) => {
			return renderProfileHeader(innerContent);
		},
	);

	// Process scrollable-list containers
	processedContent = processedContent.replace(
		/:::scrollable-list\n([\s\S]*?)\n:::/g,
		(match, innerContent) => {
			return renderScrollableListMarkdown(innerContent);
		},
	);

	return processedContent;
}

function renderScrollableListMarkdown(content: string): string {
	// Wrap the markdown list in HTML, let marked process it later
	return `<div class="scrollable-list">\n\n${content}\n\n</div>`;
}

// Convert ./assets/ to /assets/
export function processImagePaths(content: string): string {
	return content.replace(/!\[([^\]]*)\]\(\.\/assets\//g, "![$1](/assets/");
}

// Rewrite specific internal links to external URLs
export function processLinks(content: string): string {
	return content.replace(
		/\[([^\]]+)\]\(\.\/side-oripathy\)/g,
		"[$1](https://bi9dri.github.io/emoklore-arknights-side-oripathy/)",
	);
}

// Add IDs to H2 headings for TOC linking
export function addHeadingIds(content: string): string {
	return content.replace(/^##\s+(.+)$/gm, (match, text) => {
		const cleanText = text.trim();
		const id = cleanText
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\-]/g, "");
		// Return HTML directly instead of markdown with {#id} syntax
		return `<h2 id="${id}">${cleanText}</h2>`;
	});
}

// Generate table of contents from H2 headings
export function generateTableOfContents(
	content: string,
): TableOfContentsItem[] {
	const toc: TableOfContentsItem[] = [];
	const headingRegex = /^##\s+(.+)$/gm;

	let match = headingRegex.exec(content);
	while (match !== null) {
		const text = match[1].trim();
		const id = text
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\-]/g, "");

		toc.push({ id, text, level: 2 });
		match = headingRegex.exec(content);
	}

	return toc;
}
