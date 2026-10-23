<script lang="ts" module>
  export const BG_FIELDS = [
    ["traits", "Personality traits", 2],
    ["ideals", "Ideals", 2],
    ["bonds", "Bonds", 2],
    ["flaws", "Flaws", 2],
    ["allies", "Friends, allies and organizations", 3],
    ["appearance", "Appearance", 2],
    ["backstory", "Backstory", 8],
  ] as const;
  export const hasBackground = (b: import("../lib/model/types").Background) => !!(b.name || b.feature?.name || BG_FIELDS.some(([k]) => b[k]));
</script>

<script lang="ts">
  import { app } from "../lib/app.svelte";
  import type { Sheet } from "../lib/model/types";

  let { sheet }: { sheet: Sheet } = $props();
  const b = $derived(sheet.background);
  const label = (k: string) => BG_FIELDS.find((f) => f[0] === k)![1];
</script>

{#if app.ui.edit}
  <div class="bg-edit">
    <div class="grid2">
      <label class="fld"><span>Background</span><input class="in" bind:value={b.name} placeholder="e.g. Hermit" /></label>
      <label class="fld"><span>Background feature</span><input class="in" bind:value={b.feature.name} placeholder="e.g. Discovery" /></label>
    </div>
    <label class="fld"><span>What the feature does</span><textarea class="in" rows="3" bind:value={b.feature.desc}></textarea></label>
    {#each BG_FIELDS as [k, l, rows] (k)}
      <label class="fld"><span>{l}</span><textarea class="in" {rows} value={b[k] ?? ""} oninput={(e) => (b[k] = e.currentTarget.value)}></textarea></label>
    {/each}
  </div>
{:else if !hasBackground(b)}
  <div class="empty" style="padding:24px 8px">
    <h2>No background yet</h2>
    <p>Use Edit to add a background and its feature, personality, bonds and backstory.</p>
  </div>
{:else}
  <div class="bg-view">
    {#if b.name || b.feature.name}
      <section class="bg-head">
        {#if b.name}<div class="bg-name">{b.name}</div>{/if}
        {#if b.feature.name}<div class="bg-feat"><b>{b.feature.name}.</b> {b.feature.desc}</div>{/if}
      </section>
    {/if}
    <div class="bg-grid">
      {#each ["traits", "ideals", "bonds", "flaws"] as const as k (k)}
        {#if b[k]}<section class="bg-block"><h3 class="section-h">{label(k)}</h3><p>{b[k]}</p></section>{/if}
      {/each}
    </div>
    {#each ["allies", "appearance", "backstory"] as const as k (k)}
      {#if b[k]}<section class="bg-block" class:long={k === "backstory"}><h3 class="section-h">{label(k)}</h3><p>{b[k]}</p></section>{/if}
    {/each}
  </div>
{/if}
