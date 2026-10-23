<script lang="ts">
  import { app } from "./lib/app.svelte";
  import Codex from "./components/Codex.svelte";

  let { embedded = true }: { embedded?: boolean } = $props();
</script>

{#if app.ready}<Codex {embedded} />{/if}
