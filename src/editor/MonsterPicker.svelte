<script lang="ts">
  // The SRD creatures in the dialog popover, for a new creature sheet: search, filter by challenge rating and type, pick
  // one and make a sheet of it.
  import { IDENTITY_COLORS, RULESETS } from "../lib/model/defaults";
  import { sheetFromSrdMonster, srdUrl, type SrdMonster } from "../lib/model/srd";
  import type { Rules, Sheet } from "../lib/model/types";
  import Icon from "../components/Icon.svelte";

  let { rules, focus = 0, size, oncreate, onclose }: {
    rules: Rules;
    focus?: number;
    size: { max: () => number; set: (height: number) => void };
    oncreate: (sheet: Sheet) => void;
    onclose: () => void;
  } = $props();
  const CR_FILTERS = [
    ["all", "All", 0, 30],
    ["low", "CR 0–1", 0, 1],
    ["2-4", "CR 2–4", 2, 4],
    ["5-10", "CR 5–10", 5, 10],
    ["11-16", "CR 11–16", 11, 16],
    ["17+", "CR 17+", 17, 30],
  ] as const;

  let srd = $state.raw<SrdMonster[]>([]);
  let failed = $state(false);
  let q = $state("");
  let band = $state<(typeof CR_FILTERS)[number][0]>("all");
  /** "" is any type. */
  let type = $state("");
  let picked = $state("");
  let search: HTMLInputElement | undefined = $state();
  const edition = $derived(RULESETS.find(([k]) => k === rules)!);

  $effect(() => {
    if (focus && search) search.focus();
  });
  // Always as tall as the popover gets: fitted to the list, it would jump with every letter typed in the search.
  $effect(() => size.set(size.max()));

  const url = $derived(srdUrl("monsters", rules));
  $effect(() => {
    failed = false;
    picked = "";
    fetch(url)
      .then((r) => r.json())
      .then((d: SrdMonster[]) => (srd = d))
      .catch(() => (failed = true));
  });

  const types = $derived([...new Set(srd.map((m) => m.type))].sort());
  const matching = $derived.by(() => {
    const [, , lo, hi] = CR_FILTERS.find(([k]) => k === band)!;
    const text = q.trim().toLowerCase();
    return srd
      .filter((m) => m.cr >= lo && m.cr <= hi && (!type || m.type === type) && (!text || m.name.toLowerCase().includes(text)))
      .sort((a, b) => a.cr - b.cr || a.name.localeCompare(b.name));
  });
  const shown = $derived(matching.slice(0, 120));

  function create() {
    const m = srd.find((x) => x.name === picked);
    if (m) oncreate(sheetFromSrdMonster(m, IDENTITY_COLORS[0]!));
  }
</script>

<div class="ed-page" role="dialog" aria-label="New creature from the SRD">
  <header class="ed-h pk-h">
    <div class="ed-title"><h2>New creature from the SRD</h2><span class="ed-who">{edition[1]} ({edition[2]})</span></div>
    <div class="search"><Icon name="search" size="sm" /><input class="in" bind:this={search} bind:value={q} placeholder="Search {srd.length || ''} SRD creatures" aria-label="Search creatures" autocomplete="off" /></div>
    <div class="lvl-chips" role="group" aria-label="Filter by challenge rating">
      {#each CR_FILTERS as [k, label] (k)}
        <button aria-pressed={band === k} onclick={() => (band = k)}>{label}</button>
      {/each}
    </div>
    <div class="pk-filters">
      <select class="in" value={type} onchange={(e) => (type = e.currentTarget.value)} aria-label="Filter by type">
        <option value="">All types</option>
        {#each types as t (t)}<option value={t}>{t}</option>{/each}
      </select>
    </div>
  </header>
  <div class="ed-b">
    <div class="pk-list" role="radiogroup" aria-label="Creatures">
      {#if failed}
        <p class="log-empty">The SRD creature list could not be loaded. Check your connection and open the list again.</p>
      {:else}
        {#each shown as m (m.name)}
          <label class="pick">
            <input type="radio" name="monster" checked={picked === m.name} onchange={() => (picked = m.name)} />
            <span class="row-txt">
              <span class="row-nm">{m.name}</span>
              <span class="row-meta">{m.subtitle} · AC {m.ac} · {m.hp.max} HP</span>
            </span>
          </label>
        {:else}
          {#if srd.length}<p class="log-empty">No SRD creatures match. Try another name or filter, or make one from scratch.</p>{/if}
        {/each}
        {#if matching.length > shown.length}<p class="calc" style="padding:8px">Showing {shown.length} of {matching.length}. Search to narrow it down.</p>{/if}
      {/if}
    </div>
  </div>
  <footer class="ed-f">
    <button class="btn ghost" onclick={onclose}>Cancel</button>
    <span class="grow calc">{picked || "Pick a creature"}</span>
    <button class="btn primary" disabled={!picked} onclick={create}>Create</button>
  </footer>
</div>
