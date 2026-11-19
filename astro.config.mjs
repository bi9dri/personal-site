import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://bidri.dev",
  output: "static",
  vite: {
    build: {
      cssTarget: ["chrome111", "firefox113", "safari16.4"],
    },
  },
});
