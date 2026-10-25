<script lang="ts">
  // The SRD list in the dialog popover, spells or items from the SRD the sheet's rules follow: search, filter, tick
  // entries and add them in one go. Items go in the inventory category the list was opened from.
  import { ABILITY, ACTIVATIONS, RARITIES, RULESETS } from "../lib/model/defaults";
  import { itemFromSrd, spellFromSrd, srdUrl, type SrdItem, type SrdList, type SrdSpell } from "../lib/model/srd";
  import type { Item, Sheet, Spell } from "../lib/model/types";
  import Icon from "../components/Icon.svelte";
  import { levelLabel } from "../lib/ui/text";

  let { sheet, list, cat = "", focus = 0, size, onadd, onclose }: {
    sheet: Sheet;
    list: SrdList;
    cat?: string;
    focus?: number;
    size: { max: () => number; set: (height: number) => void };
    onadd: (entries: (Spell | Item)[]) => void;
    onclose: () => void;
  } = $props();
  type Entry = SrdSpell | SrdItem;
  const ITEM_FILTERS = [
    ["all", "All"],
    ["weapon", "Weapons"],
    ["armor", "Armor"],
    ["gear", "Gear"],
    ["magic", "Magic items"],
  ] as const;
  type ItemFilter = (typeof ITEM_FILTERS)[number][0];

  let srd = $state.raw<Entry[]>([]);
  let failed = $state(false);
  let q = $state("");
  let lvl = $state<"all" | number>("all");
  let group = $state<ItemFilter>("all");
  /** "" is any class or school. */
  let cls = $state("");
  let school = $state("");
  let sel = $state<string[]>([]);
  let search: HTMLInputElement | undefined = $state();
  const spells = $derived(list === "spells");
  const noun = $derived(spells ? "spell" : "item");
  const edition = $derived(RULESETS.find(([k]) => k === sheet.rules)!);
  const catName = $derived(sheet.inventory.categories.find((c) => c.id === cat)?.name ?? sheet.inventory.categories[0]?.name ?? "");
  const options = (pick: (s: SrdSpell) => string[]) => [...new Set((srd as SrdSpell[]).flatMap(pick))].sort();
  const classes = $derived(spells ? options((s) => s.classes) : []);
  const schools = $derived(spells ? options((s) => [s.school]) : []);

  $effect(() => {
    if (focus && search) search.focus();
  });
  // Always as tall as the popover gets: fitted to the list, it would jump with every letter typed in the search.
  $effect(() => size.set(size.max()));

  // On the URL, not the sheet: the Codex sends the sheet again with every change, and that mustn't reload the list.
  const url = $derived(srdUrl(list, sheet.rules));
  $effect(() => {
    failed = false;
    sel = [];
    fetch(url)
      .then((r) => r.json())
      .then((d: Entry[]) => (srd = d))
      .catch(() => (failed = true));
  });

  const owned = $derived(new Set((spells ? sheet.spells : sheet.inventory.items).map((s) => s.name.toLowerCase())));
  const isWeapon = (it: SrdItem) => it.type === "Weapon" || it.type === "Ammunition";
  const isArmor = (it: SrdItem) => it.type === "Armor" || it.type === "Shield";
  function inGroup(it: SrdItem) {
    if (group === "all") return true;
    if (group === "magic") return !!it.rarity;
    if (it.rarity) return false;
    return group === "weapon" ? isWeapon(it) : group === "armor" ? isArmor(it) : !isWeapon(it) && !isArmor(it);
  }
  function inFilters(s: SrdSpell) {
    return (lvl === "all" || s.level === lvl) && (!cls || s.classes.includes(cls)) && (!school || s.school === school);
  }
  const matches = (e: Entry) =>
    (spells ? inFilters(e as SrdSpell) : inGroup(e as SrdItem)) && (!q.trim() || e.name.toLowerCase().includes(q.trim().toLowerCase()));
  const matching = $derived(
    srd.filter(matches).sort((a, b) => (spells ? (a as SrdSpell).level - (b as SrdSpell).level : 0) || a.name.localeCompare(b.name)),
  );
  const shown = $derived(matching.slice(0, 120));
  const actName = (a: string) => ACTIVATIONS.find((x) => x[0] === a)?.[1] ?? a;
  const fmt = (n: number) => String(+n.toFixed(2));

  function meta(e: Entry) {
    if (!spells) {
      const it = e as SrdItem;
      const rarity = RARITIES.find(([k]) => k === it.rarity)?.[1];
      return [it.type, rarity ? `${rarity}${it.attune ? ", requires attunement" : ""}` : "", it.wt ? `${fmt(it.wt)} lb` : "", it.cost ? `${fmt(it.cost)} gp` : ""]
        .filter(Boolean)
        .join(" · ");
    }
    const s = e as SrdSpell;
    return [
      s.level ? `${levelLabel(s.level)} ${s.school.toLowerCase()}` : `${s.school} cantrip`,
      actName(s.act),
      s.range,
      s.conc ? "concentration" : "",
      s.ritual ? "ritual" : "",
      s.hit ? "spell attack" : "",
      s.save ? `${ABILITY[s.save.target].short} save` : "",
      s.dmg.map((d) => `${d.n ? `${d.n}d${d.d}` : ""}${d.n && d.flat ? " + " : ""}${d.flat || ""} ${d.type}`).join(" + "),
    ]
      .filter(Boolean)
      .join(" · ");
  }

  function toggle(name: string, on: boolean) {
    sel = on ? [...sel, name] : sel.filter((n) => n !== name);
  }

  function add() {
    const picked = sel.map((name) => srd.find((x) => x.name === name)).filter((e) => !!e);
    onadd(spells ? picked.map((e) => spellFromSrd(e as SrdSpell)) : picked.map((e) => itemFromSrd(e as SrdItem, cat)));
  }
</script>

<div class="ed-page" role="dialog" aria-label="Add {noun}s from the SRD list">
  <header class="ed-h pk-h">
    <div class="ed-title">
      <h2>{spells ? "Add from SRD list" : `Add to ${catName} from SRD list`}</h2><span class="ed-who">{sheet.name} · {edition[1]} ({edition[2]})</span>
    </div>
    <div class="search"><Icon name="search" size="sm" /><input class="in" bind:this={search} bind:value={q} placeholder="Search {srd.length || ''} SRD {noun}s" aria-label="Search {noun}s" autocomplete="off" /></div>
    {#if spells}
      <div class="lvl-chips" role="group" aria-label="Filter by level">
        {#each ["all", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const as l (l)}
          <button aria-pressed={lvl === l} onclick={() => (lvl = l)}>{l === "all" ? "All" : l === 0 ? "Cantrips" : `Level ${l}`}</button>
        {/each}
      </div>
      <div class="pk-filters">
        <select class="in" value={cls} onchange={(e) => (cls = e.currentTarget.value)} aria-label="Filter by class">
          <option value="">All classes</option>
          {#each classes as c (c)}<option value={c}>{c}</option>{/each}
        </select>
        <select class="in" value={school} onchange={(e) => (school = e.currentTarget.value)} aria-label="Filter by school">
          <option value="">All schools</option>
          {#each schools as s (s)}<option value={s}>{s}</option>{/each}
        </select>
      </div>
    {:else}
      <div class="lvl-chips" role="group" aria-label="Filter by kind">
        {#each ITEM_FILTERS as [k, label] (k)}
          <button aria-pressed={group === k} onclick={() => (group = k)}>{label}</button>
        {/each}
      </div>
    {/if}
  </header>
  <div class="ed-b">
    <div class="pk-list">
      {#if failed}
        <p class="log-empty">The SRD {noun} list could not be loaded. Check your connection and open the list again.</p>
      {:else}
        {#each shown as e (e.name)}
          <!-- A spell is on a sheet once; an item it already has can be added again, and is counted onto it. -->
          {@const has = owned.has(e.name.toLowerCase())}
          <label class="pick" class:owned={has && spells}>
            <input type="checkbox" checked={sel.includes(e.name)} disabled={has && spells} onchange={(ev) => toggle(e.name, ev.currentTarget.checked)} />
            <span class="row-txt">
              <span class="row-nm">{e.name}{#if has}&nbsp;<span class="mark">{spells ? "Added" : "In inventory"}</span>{/if}</span>
              <span class="row-meta">{meta(e)}</span>
            </span>
          </label>
        {:else}
          {#if srd.length}<p class="log-empty">No SRD {noun}s match “{q}”. Try another name or filter, or make it yourself with {spells ? "New spell" : "Add custom item"}.</p>{/if}
        {/each}
        {#if matching.length > shown.length}<p class="calc" style="padding:8px">Showing {shown.length} of {matching.length}. Search to narrow it down.</p>{/if}
      {/if}
    </div>
  </div>
  <footer class="ed-f">
    <button class="btn ghost" onclick={onclose}>Cancel</button>
    <span class="grow calc">{sel.length ? `${sel.length} selected` : `Pick ${noun}s to add`}</span>
    <button class="btn primary" disabled={!sel.length} onclick={add}>
      {sel.length ? `Add ${sel.length} ${noun}${sel.length > 1 ? "s" : ""}` : `Add ${noun}s`}
    </button>
  </footer>
</div>
