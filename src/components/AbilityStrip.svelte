<script lang="ts">
  import { app } from "../lib/app.svelte";
  import { ABILITIES } from "../lib/model/defaults";
  import { mod, signed } from "../lib/rules";
  import type { Sheet } from "../lib/model/types";
  import NumInput from "./NumInput.svelte";

  let { sheet }: { sheet: Sheet } = $props();
</script>

<div class="abil-wrap">
  <div class="ledger">
    {#each ABILITIES as [k, short, long] (k)}
      {#if app.ui.edit}
        <div class="lg-cell">
          <span class="ab-k">{short}</span>
          <NumInput class="in score num" bind:value={sheet.abilities[k].score} fallback={10} aria-label="{long} score" />
        </div>
      {:else}
        <button class="lg-cell" aria-label="{long} check, {signed(mod(sheet.abilities[k].score))}" onclick={(e) => app.rollCheck(sheet, k, e)}>
          <span class="ab-k">{short}</span>
          <span class="ab-m num">{signed(mod(sheet.abilities[k].score))}</span>
          <span class="ab-s num">{sheet.abilities[k].score}</span>
        </button>
      {/if}
    {/each}
  </div>
</div>
