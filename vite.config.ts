import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { fileURLToPath } from "node:url";

const page = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// Pages: the extension popover (index.html), the dev harness with a mocked room (dev/room.html)
// and the spike page used to probe a real Owlbear room during development (spike.html).
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
      input: {
        main: page("./index.html"),
        room: page("./dev/room.html"),
        spike: page("./spike.html"),
      },
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
    passWithNoTests: true,
    // A DOM environment makes Vitest use client transforms, so .svelte.ts runes compile with working effects.
    environment: "happy-dom",
  },
});
