const server = Bun.serve({
	port: 3000,
	async fetch(req) {
		const url = new URL(req.url);
		let path = url.pathname;

		// Serve index.html for root path
		if (path === "/") {
			path = "/index.html";
		}

		// Construct file path
		const filePath = `./dist${path}`;
		const file = Bun.file(filePath);

		// Check if file exists
		const exists = await file.exists();
		if (!exists) {
			return new Response("404 Not Found", { status: 404 });
		}

		// Determine content type
		const ext = path.split(".").pop()?.toLowerCase();
		const contentTypes: Record<string, string> = {
			html: "text/html; charset=utf-8",
			css: "text/css; charset=utf-8",
			js: "text/javascript; charset=utf-8",
			json: "application/json",
			png: "image/png",
			jpg: "image/jpeg",
			jpeg: "image/jpeg",
			gif: "image/gif",
			svg: "image/svg+xml",
			webp: "image/webp",
			ico: "image/x-icon",
		};

		const contentType = contentTypes[ext || ""] || "application/octet-stream";

		return new Response(file, {
			headers: {
				"Content-Type": contentType,
			},
		});
	},
});

console.log(`🚀 Server running at http://localhost:${server.port}`);
console.log("📁 Serving files from: dist/");
console.log("\n   Open http://localhost:3000 in your browser\n");
