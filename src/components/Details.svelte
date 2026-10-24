<script lang="ts">
  // An entry's description folded out under its row in play, with a button that posts it to the table log as a card.
  import { app } from "../lib/app.svelte";
  import type { Sheet } from "../lib/model/types";
  import Icon from "./Icon.svelte";

  /** `sub` travels with the card under its title: a spell's level and range, an item's rarity and weight. */
  let { sheet, title, sub = "", desc }: { sheet: Sheet; title: string; sub?: string; desc: string } = $props();
</script>

<div class="entry-desc">
  {desc || "No description."}
  <div><button class="btn" onclick={() => app.shareEntry(sheet, { title, sub, desc })}><Icon name="send" size="sm" />Share with the table</button></div>
</div>
