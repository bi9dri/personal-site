import type { TableOfContentsItem } from "./types.ts";
import { NAV_ITEMS } from "./constants.ts";

export async function loadTemplate(templatePath: string): Promise<string> {
	const file = Bun.file(templatePath);
	return await file.text();
}

export function injectContent(
	template: string,
	content: string,
	title: string,
	toc: TableOfContentsItem[],
	currentPage: string,
): string {
	let result = template;

	// Replace title
	result = result.replace(/\{\{TITLE\}\}/g, title);

	// Replace content
	result = result.replace(/\{\{CONTENT\}\}/g, content);

	// Replace navigation
	const nav = generateNavigation(currentPage);
	result = result.replace(/\{\{NAV\}\}/g, nav);

	// Replace TOC (only show if there are 2 or more items)
	const tocHtml = toc.length >= 2 ? generateTocHtml(toc) : "";
	result = result.replace(/\{\{TOC\}\}/g, tocHtml);

	// Replace body class
	const bodyClass = toc.length >= 2 ? "has-sidebar" : "";
	result = result.replace(/\{\{BODY_CLASS\}\}/g, bodyClass);

	// Replace year
	const year = new Date().getFullYear();
	result = result.replace(/\{\{YEAR\}\}/g, year.toString());

	return result;
}

function generateNavigation(currentPage: string): string {
	return NAV_ITEMS
		.map((item) => {
			const isActive =
				item.internal &&
				(item.href === currentPage ||
					(currentPage === "/index.html" && item.href === "/"));
			const activeClass = isActive ? ' class="active"' : "";
			const target = item.internal
				? ""
				: ' target="_blank" rel="noopener noreferrer"';
			return `<a href="${item.href}"${activeClass}${target}>${item.label}</a>`;
		})
		.join("\n          ");
}

function generateTocHtml(toc: TableOfContentsItem[]): string {
	if (toc.length === 0) {
		return "";
	}

	const tocItems = toc
		.map((item) => `<li><a href="#${item.id}">${item.text}</a></li>`)
		.join("\n          ");

	return `
      <aside class="toc-sidebar">
        <nav class="toc-nav">
          <h3 class="toc-title">目次</h3>
          <ul class="toc-list">
          ${tocItems}
          </ul>
        </nav>
      </aside>`;
}
