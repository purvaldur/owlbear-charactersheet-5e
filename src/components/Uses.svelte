<script lang="ts">
  // Limited uses as circles (spell slots are squares: DESIGN.md, Two Counters Rule). Click a pip to spend or restore.
  import { RECHARGES } from "../lib/model/defaults";
  import type { Uses } from "../lib/model/types";

  let { uses, name = "", label = true, readonly = false }: { uses: Uses; name?: string; label?: boolean; readonly?: boolean } = $props();
  const left = $derived(uses.max - uses.used);

  function toggle(i: number) {
    uses.used = i < left ? uses.used + 1 : uses.used - 1;
  }
</script>

<span class="uses" title="{left} of {uses.max} left · {RECHARGES.find((r) => r[0] === uses.recharge)?.[1] ?? ''}">
  {#each Array.from({ length: uses.max }, (_, i) => i) as i (i)}
    <button class="pip" class:on={i < left} class:spent={i >= left} disabled={readonly} aria-label="{name ? `${name}: ` : ''}{i < left ? 'spend a use' : 'restore a use'} ({left} of {uses.max} left)" onclick={() => toggle(i)}></button>
  {/each}
  {#if label}<span class="uses-lbl">{uses.recharge}</span>{/if}
</span>
