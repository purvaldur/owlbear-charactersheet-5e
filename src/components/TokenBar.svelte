<script lang="ts">
  // A small picture of a token's HP bar in one mode, drawn from the same model the map uses.
  import { BAR_COLORS as C, barModel } from "../lib/tokens/hpBar";
  import type { BarMode, TokenLink } from "../lib/tokens/link";

  let { hp, mode }: { hp: TokenLink["hp"]; mode: BarMode } = $props();
  const m = $derived(barModel(hp, mode));
  // The map's own colours, not the sheet's theme: the preview has to look like the bar the table will see.
  const vars = `--tb-ok:${C.ok};--tb-mid:${C.mid};--tb-low:${C.low};--tb-temp:${C.temp}`;
</script>

{#if m}
  <span class="tbar {m.state} {m.mode}" style={vars} aria-hidden="true">
    <i style="width:{m.fill * 100}%"></i>{#if m.temp > 0}<i class="t" style="width:{m.temp * 100}%"></i>{/if}
    {#each m.ticks as t (t)}<b style="left:{t * 100}%"></b>{/each}
    {#if m.label}<span>{m.label}</span>{/if}
  </span>
{:else}
  <span class="tbar-none">No bar</span>
{/if}
