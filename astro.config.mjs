import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://bidri.dev",
  output: "static",
  vite: {
    build: {
      // Safari 17 以前は -webkit-backdrop-filter が必要 (Lightning CSS の接頭辞生成に効く)
      cssTarget: ["chrome111", "firefox113", "safari16.4"],
    },
  },
});
