export function minifyHTML(html: string): string {
	return html
		// Remove comments
		.replace(/<!--[\s\S]*?-->/g, "")
		// Remove whitespace between tags
		.replace(/>\s+</g, "><")
		// Remove leading/trailing whitespace
		.trim()
		// Collapse multiple spaces into one
		.replace(/\s{2,}/g, " ");
}

export function minifyCSS(css: string): string {
	return css
		// Remove comments
		.replace(/\/\*[\s\S]*?\*\//g, "")
		// Remove whitespace around {, }, :, ;, ,
		.replace(/\s*([{}:;,])\s*/g, "$1")
		// Remove trailing semicolons before }
		.replace(/;}/g, "}")
		// Remove leading/trailing whitespace
		.trim()
		// Collapse multiple spaces into one
		.replace(/\s{2,}/g, " ");
}
