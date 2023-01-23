import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

import mkcert from "vite-plugin-mkcert";
import path from "path";

export default defineConfig({
  plugins: [svelte(), mkcert()],
  base: "/id-2223-s1/moed/uplift/",
  server: {
    host: "127.0.0.1",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      public: path.resolve(__dirname, "./public"),
    },
  },
  optimizeDeps: {
    include: ["highlight.js", "highlight.js/lib/core"],
  },
});
