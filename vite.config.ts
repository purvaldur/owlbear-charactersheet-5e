import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { fileURLToPath } from "node:url";

const page = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// Built pages: the Codex popover (index.html), the background page Owlbear keeps running for the whole session
// (background.html), the alert popover over the map (alert.html) and the editor popover in the middle of the room
// (editor.html). The dev harness (dev/) is served by `npm run dev` alone.
export default defineConfig({
  plugins: [svelte()],
  // Tests run Svelte's client runtime so $effect fires (the default in Node would be the server build).
  resolve: process.env.VITEST ? { conditions: ["browser"] } : undefined,
  server: {
    port: 5173,
    host: true,
    // Owlbear Rodeo fetches the manifest and loads the popover cross-origin.
    cors: { origin: [/^https:\/\/(www\.)?owlbear\.rodeo$/, /^https?:\/\/localhost(:\d+)?$/] },
  },
  build: {
    rollupOptions: {
      input: { main: page("./index.html"), background: page("./background.html"), alert: page("./alert.html"), editor: page("./editor.html") },
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
    passWithNoTests: true,
    // A DOM environment makes Vitest use client transforms, so .svelte.ts runes compile with working effects.
    environment: "happy-dom",
  },
});
