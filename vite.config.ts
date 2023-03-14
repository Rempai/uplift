import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

import path from "path";
import fs from "fs";

export default defineConfig({
  plugins: [svelte()],
  base: "/id-2223-s1/moed/uplift/",
  root: "./",
  publicDir: "public",
  server: {
    host: "127.0.0.1",
    https: {
      key: fs.readFileSync("./key.pem"),
      cert: fs.readFileSync("./cert.pem"),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["highlight.js", "highlight.js/lib/core"],
  },
});
