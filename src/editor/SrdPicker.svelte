<script lang="ts">
  // The SRD spell list in the dialog popover: search, filter by level, tick spells and add them in one go.
  import { ABILITY, ACTIVATIONS } from "../lib/model/defaults";
  import { spellFromSrd, srdSaveTarget, type SrdSpell } from "../lib/model/srd";
  import type { Sheet, Spell } from "../lib/model/types";
  import Icon from "../components/Icon.svelte";
  import { levelLabel } from "../lib/ui/text";

  let { sheet, focus = 0, size, onadd, onclose }: {
    sheet: Sheet;
    focus?: number;
    size: { max: () => number; set: (height: number) => void };
    onadd: (spells: Spell[]) => void;
    onclose: () => void;
  } = $props();
  let srd = $state<SrdSpell[]>([]);
  let failed = $state(false);
  let q = $state("");
  let lvl = $state<"all" | number>("all");
  let sel = $state<string[]>([]);
  let search: HTMLInputElement | undefined = $state();

  $effect(() => {
    if (focus && search) search.focus();
  });
  // Always as tall as the popover gets: fitted to the list, it would jump with every letter typed in the search.
  $effect(() => size.set(size.max()));

  $effect(() => {
    fetch(`${import.meta.env.BASE_URL}srd-spells.json`)
      .then((r) => r.json())
      .then((d: SrdSpell[]) => (srd = d))
      .catch(() => (failed = true));
  });

  const owned = $derived(new Set(sheet.spells.map((s) => s.name.toLowerCase())));
  const list = $derived(
    srd
      .filter((s) => (lvl === "all" || s[1] === lvl) && (!q.trim() || s[0].toLowerCase().includes(q.trim().toLowerCase())))
      .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0])),
  );
  const shown = $derived(list.slice(0, 120));
  const actName = (a: string) => ACTIVATIONS.find((x) => x[0] === a)?.[1] ?? a;

  function meta(s: SrdSpell) {
    const [, level, act, range, hit, , dmgs] = s;
    const save = srdSaveTarget(s);
    return [levelLabel(level), actName(act), range, hit ? "spell attack" : "", save ? `${ABILITY[save].short} save` : "", dmgs.map((d) => `${d[0]}d${d[1]} ${d[2]}`).join(" + ")]
      .filter(Boolean)
      .join(" · ");
  }

  function toggle(name: string, on: boolean) {
    sel = on ? [...sel, name] : sel.filter((n) => n !== name);
  }

  function add() {
    onadd(sel.map((name) => srd.find((x) => x[0] === name)).filter((s) => !!s).map(spellFromSrd));
  }
</script>

<div class="ed-page" role="dialog" aria-label="Add spells from the SRD list">
  <header class="ed-h pk-h">
    <div class="ed-title"><h2>Add from SRD list</h2><span class="ed-who">{sheet.name}</span></div>
    <div class="search"><Icon name="search" size="sm" /><input class="in" bind:this={search} bind:value={q} placeholder="Search {srd.length || 319} SRD spells" aria-label="Search spells" autocomplete="off" /></div>
    <div class="lvl-chips" role="group" aria-label="Filter by level">
      {#each ["all", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const as l (l)}
        <button aria-pressed={lvl === l} onclick={() => (lvl = l)}>{l === "all" ? "All" : l === 0 ? "Cantrips" : `Level ${l}`}</button>
      {/each}
    </div>
  </header>
  <div class="ed-b">
    <div class="pk-list">
      {#if failed}
        <p class="log-empty">The SRD spell list could not be loaded. Check your connection and open the list again.</p>
      {:else}
        {#each shown as s (s[0])}
          {@const has = owned.has(s[0].toLowerCase())}
          <label class="pick" class:owned={has}>
            <input type="checkbox" checked={sel.includes(s[0])} disabled={has} onchange={(e) => toggle(s[0], e.currentTarget.checked)} />
            <span class="row-txt">
              <span class="row-nm">{s[0]}{#if has}&nbsp;<span class="mark">Added</span>{/if}</span>
              <span class="row-meta">{meta(s)}</span>
            </span>
          </label>
        {:else}
          {#if srd.length}<p class="log-empty">No SRD spells match “{q}”. Try another name, or make it yourself with New spell.</p>{/if}
        {/each}
        {#if list.length > shown.length}<p class="calc" style="padding:8px">Showing {shown.length} of {list.length}. Search to narrow it down.</p>{/if}
      {/if}
    </div>
  </div>
  <footer class="ed-f">
    <button class="btn ghost" onclick={onclose}>Cancel</button>
    <span class="grow calc">{sel.length ? `${sel.length} selected` : "Pick spells to add"}</span>
    <button class="btn primary" disabled={!sel.length} onclick={add}>
      {sel.length ? `Add ${sel.length} spell${sel.length > 1 ? "s" : ""}` : "Add spells"}
    </button>
  </footer>
</div>
