import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// Only the popover (index.html) is built. The dev harness (dev/room.html) is served by `npm run dev` alone.
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
  test: {
    include: ["src/**/*.test.ts"],
    passWithNoTests: true,
    // A DOM environment makes Vitest use client transforms, so .svelte.ts runes compile with working effects.
    environment: "happy-dom",
  },
});
