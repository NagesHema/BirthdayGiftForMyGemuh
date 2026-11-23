import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const root = process.cwd();

export default defineConfig({
  plugins: [react()],
  base: "/BirthdayGiftForMyGemuh/",
  publicDir: resolve(root, "assets"),
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        home: resolve(root, "pages/home.html"),
        journey: resolve(root, "pages/our-story.html"),
        reasons: resolve(root, "pages/things-i-love.html"),
        memories: resolve(root, "pages/memories.html"),
        notes: resolve(root, "pages/little-things.html"),
        letter: resolve(root, "pages/letter.html"),
        forever: resolve(root, "pages/forever.html"),
      },
    },
  },
});
