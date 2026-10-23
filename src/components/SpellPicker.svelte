<script lang="ts">
  // The one remaining full-height panel: browsing 319 SRD spells is a different job from editing one.
  import { app } from "../lib/app.svelte";
  import { ABILITY, ACTIVATIONS, SPELL_LEVELS, damage, newSpell } from "../lib/model/defaults";
  import type { AbilityKey, Activation, Sheet } from "../lib/model/types";
  import Icon from "./Icon.svelte";

  type SrdSpell = [string, number, string, string, number, string, [number, number, string][], string];
  let { sheet }: { sheet: Sheet } = $props();
  const ui = app.ui;
  const picker = ui.picker!;
  let srd = $state<SrdSpell[]>([]);
  let failed = $state(false);
  let search: HTMLInputElement | undefined = $state();
  $effect(() => search?.focus());

  $effect(() => {
    fetch(`${import.meta.env.BASE_URL}srd-spells.json`)
      .then((r) => r.json())
      .then((d: SrdSpell[]) => (srd = d))
      .catch(() => (failed = true));
  });

  const owned = $derived(new Set(sheet.spells.map((s) => s.name.toLowerCase())));
  const list = $derived(
    srd
      .filter((s) => (picker.lvl === "all" || s[1] === picker.lvl) && (!picker.q.trim() || s[0].toLowerCase().includes(picker.q.trim().toLowerCase())))
      .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0])),
  );
  const shown = $derived(list.slice(0, 120));
  const actName = (a: string) => ACTIVATIONS.find((x) => x[0] === a)?.[1] ?? a;
  const ordShort = (l: number) => (l === 0 ? "Cantrip" : SPELL_LEVELS[l]!.replace(" level", "-level"));

  function meta(s: SrdSpell) {
    const [, level, act, range, hit, save, dmgs] = s;
    return [ordShort(level), actName(act), range, hit ? "spell attack" : "", save ? `${ABILITY[save as AbilityKey]?.short ?? save.toUpperCase()} save` : "", dmgs.map((d) => `${d[0]}d${d[1]} ${d[2]}`).join(" + ")]
      .filter(Boolean)
      .join(" · ");
  }

  function toggle(name: string, on: boolean) {
    picker.sel = on ? [...picker.sel, name] : picker.sel.filter((n) => n !== name);
  }

  function add() {
    const n = picker.sel.length;
    for (const name of picker.sel) {
      const s = srd.find((x) => x[0] === name);
      if (!s) continue;
      sheet.spells.push(
        newSpell({
          name: s[0], level: s[1], act: (ACTIVATIONS.some((a) => a[0] === s[2]) ? s[2] : "A") as Activation, range: s[3],
          hit: !!s[4], save: s[5] ? { target: s[5] as AbilityKey } : null, dmg: s[6].map((d) => damage(d[0], d[1], "", 0, d[2])), desc: s[7],
        }),
      );
    }
    ui.picker = null;
    ui.showToast({ msg: `Added ${n} spell${n > 1 ? "s" : ""} from the SRD list` });
  }
</script>

<div class="panel" role="dialog" aria-label="Add spells from the SRD list">
  <div class="panel-h">
    <button class="btn icon ghost" aria-label="Back" onclick={() => (ui.picker = null)}><Icon name="chevronLeft" /></button>
    <h2>Add from SRD list</h2>
  </div>
  <div style="padding:12px 12px 0;display:flex;flex-direction:column;gap:8px">
    <div class="search"><Icon name="search" size="sm" /><input class="in" bind:this={search} bind:value={picker.q} placeholder="Search {srd.length || 319} SRD spells" aria-label="Search spells" autocomplete="off" /></div>
    <div class="lvl-chips" role="group" aria-label="Filter by level">
      {#each ["all", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const as l (l)}
        <button aria-pressed={picker.lvl === l} onclick={() => (picker.lvl = l)}>{l === "all" ? "All" : l === 0 ? "Cantrips" : `Level ${l}`}</button>
      {/each}
    </div>
  </div>
  <div class="panel-b" style="gap:0">
    {#if failed}
      <p class="log-empty">The SRD spell list could not be loaded. Check your connection and open the picker again.</p>
    {:else}
      {#each shown as s (s[0])}
        {@const has = owned.has(s[0].toLowerCase())}
        <label class="pick" class:owned={has}>
          <input type="checkbox" checked={picker.sel.includes(s[0])} disabled={has} onchange={(e) => toggle(s[0], e.currentTarget.checked)} />
          <span class="row-txt">
            <span class="row-nm">{s[0]}{#if has}&nbsp;<span class="mark">Added</span>{/if}</span>
            <span class="row-meta">{meta(s)}</span>
          </span>
        </label>
      {:else}
        {#if srd.length}<p class="log-empty">No SRD spells match “{picker.q}”. Try another name, or make it yourself with New spell.</p>{/if}
      {/each}
      {#if list.length > shown.length}<p class="calc" style="padding:8px">Showing {shown.length} of {list.length}. Search to narrow it down.</p>{/if}
    {/if}
  </div>
  <div class="panel-f">
    <span class="grow">{picker.sel.length ? `${picker.sel.length} selected` : "Pick spells to add"}</span>
    <button class="btn primary" disabled={!picker.sel.length} onclick={add}>
      {picker.sel.length ? `Add ${picker.sel.length} spell${picker.sel.length > 1 ? "s" : ""}` : "Add spells"}
    </button>
  </div>
</div>
