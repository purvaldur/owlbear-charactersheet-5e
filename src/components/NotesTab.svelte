<script lang="ts">
  import type { Sheet } from "../lib/model/types";

  let { sheet }: { sheet: Sheet } = $props();
</script>

<div class="notes">
  <textarea class="notes-in" bind:value={sheet.notes} aria-label="Notes" placeholder="Anything worth remembering: names, clues, loot, who owes whom."></textarea>
  <div class="notes-f calc">Only you can see your notes.</div>
</div>
