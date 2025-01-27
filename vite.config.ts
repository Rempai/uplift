import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

import Icons from "unplugin-icons/vite";

import { resolve } from "path";
import { readFileSync } from "fs";

export default defineConfig({
  plugins: [
    svelte(),
    Icons({
      compiler: "svelte",
      autoInstall: true,
      iconCustomizer(collection, icon, props) {
        props.width = "1em";
        props.height = "1em";
      },
    }),
  ],
  base: "/id-2223-s2/uplift/",
  root: "./",
  publicDir: "public",
  server: {
    host: "0.0.0.0",
    https: {
      key: readFileSync("./key.pem"),
      cert: readFileSync("./cert.pem"),
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["highlight.js", "highlight.js/lib/core"],
  },
});
