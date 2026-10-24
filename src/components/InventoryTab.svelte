<script lang="ts">
  // Inventory is play, not building: quantities, coins, attunement and items are editable without Edit. Clicking an item,
  // or adding one, opens it in the editor popover. Items sit in categories that fold away; Edit renames, adds and
  // deletes categories.
  import { app } from "../lib/app.svelte";
  import { ATTUNEMENT_SLOTS, RARITIES } from "../lib/model/defaults";
  import { itemsIn } from "../lib/rules";
  import type { Item, Sheet } from "../lib/model/types";
  import Icon from "./Icon.svelte";
  import NumInput from "./NumInput.svelte";
  import Details from "./Details.svelte";

  let { sheet }: { sheet: Sheet } = $props();
  const ui = app.ui;
  const editing = $derived(ui.edit);
  const inv = $derived(sheet.inventory);
  const weight = (items: Item[]) => +items.reduce((a, i) => a + i.qty * i.wt, 0).toFixed(1);
  const value = $derived(inv.items.reduce((a, i) => a + i.qty * i.cost, 0));
  const attuned = $derived(inv.items.filter((i) => i.attuned).length);
  const coins = ["cp", "sp", "ep", "gp", "pp"] as const;
  const fmt = (n: number) => String(+n.toFixed(2));
  const rarityLabel = (it: Item) => RARITIES.find(([k]) => k === it.rarity)?.[1] ?? "";
  const count = (n: number) => `${n} item${n === 1 ? "" : "s"}`;

  /**
   * "Uncommon, requires attunement · 2 lb, 50 gp each · 4 lb, 100 gp": a magic item's rarity, then what one weighs and
   * is worth, then all of them when there are several. The row breaks the line only between these parts.
   */
  function details(it: Item) {
    const magic = it.rarity ? `${rarityLabel(it)}${it.attune ? ", requires attunement" : ""}` : "";
    const each = [it.wt ? `${fmt(it.wt)} lb` : "", it.cost ? `${fmt(it.cost)} gp` : ""].filter(Boolean);
    const all = [it.wt ? `${fmt(it.qty * it.wt)} lb` : "", it.cost ? `${fmt(it.qty * it.cost)} gp` : ""].filter(Boolean);
    if (!each.length) return magic ? [magic] : ["weightless"];
    return [magic, `${each.join(", ")} each`, it.qty > 1 ? all.join(", ") : ""].filter(Boolean);
  }
  const detail = (it: Item) => details(it).join(" · ");
</script>

{#snippet row(it: Item)}
  {@const open = ui.editing?.id === it.id}
  {@const shown = !!ui.open[it.id]}
  <div class="li" class:open>
    <div class="row inv-row" class:gone={it.qty === 0}>
      <button class="row-main" aria-pressed={open} aria-label="Edit {it.name}" title="Edit" onclick={() => ui.toggleEditor("item", it.id)}>
        <span class="row-txt">
          <span class="row-nm"><span class="ell rarity-{it.rarity.replace(' ', '-') || 'none'}">{it.name}</span></span>
          <span class="row-fx">
            {#each details(it) as part, i (i)}{#if i > 0}<span class="fx-sep" aria-hidden="true">{" · "}</span>{/if}<span class="fx-i">{part}</span>{/each}
          </span>
        </span>
      </button>
      {#if it.attune}
        <button class="attune-box" aria-pressed={it.attuned} aria-label="Attuned to {it.name}" title={it.attuned ? "Attuned. Click to end it." : "Not attuned. Click to attune."} onclick={() => app.toggleAttuned(sheet, it)}>
          <span class="box">{#if it.attuned}<Icon name="check" size="sm" />{/if}</span>Attuned
        </button>
      {/if}
      <span class="qty2">
        <button disabled={it.qty === 0} aria-label="One fewer {it.name}" onclick={() => (it.qty = Math.max(0, it.qty - 1))}><Icon name="minus" size="sm" /></button>
        <span class="num" aria-label="{it.qty} carried">{it.qty}</span>
        <button aria-label="One more {it.name}" onclick={() => it.qty++}><Icon name="plus" size="sm" /></button>
      </span>
      <button class="btn icon ghost rm" aria-label="Remove {it.name}" onclick={() => app.deleteItem(sheet, "item", it.id)}><Icon name="x" size="sm" /></button>
      <button class="btn icon ghost chev-btn" aria-expanded={shown} aria-label="{shown ? 'Hide' : 'Show'} the description of {it.name}" onclick={() => ui.toggle(it.id)}><Icon name={shown ? "chevronUp" : "chevronDown"} size="sm" /></button>
    </div>
    {#if shown}<Details {sheet} title={it.name} sub={detail(it)} desc={it.desc} />{/if}
  </div>
{/snippet}

<div class="coin-strip">
  {#each coins as k (k)}
    <label class="coin2"><span>{k}</span><NumInput class="num" min={0} bind:value={inv.coins[k]} aria-label="{k} coins" /></label>
  {/each}
</div>
<div class="cast-line inv-sum">
  <span class="attuned-pips" role="img" aria-label="Attuned to {attuned} of {ATTUNEMENT_SLOTS} items" title="Attuned to {attuned} of {ATTUNEMENT_SLOTS} items">
    Attunement
    <span class="uses">{#each Array.from({ length: ATTUNEMENT_SLOTS }, (_, i) => i) as i (i)}<span class="pip" class:on={i < attuned}></span>{/each}</span>
  </span>
  <span class="num"><b>{inv.items.length}</b> {inv.items.length === 1 ? "item" : "items"} · <b>{weight(inv.items)}</b> lb{#if value}{" · "}<b>{fmt(value)}</b> gp{/if}</span>
</div>

{#each inv.categories as c (c.id)}
  {@const items = itemsIn(inv, c.id)}
  <div class="section-h cat-h">
    <button class="cat-toggle" aria-expanded={!c.collapsed} aria-label={editing ? `${c.collapsed ? "Show" : "Hide"} ${c.name}` : undefined} onclick={() => (c.collapsed = !c.collapsed)}>
      <Icon name={c.collapsed ? "chevronRight" : "chevronDown"} size="sm" />{#if !editing}<span>{c.name}</span>{/if}
    </button>
    {#if editing}<input class="in cat-name" bind:value={c.name} aria-label="Category name" />{/if}
    <span class="grow"></span>
    <span class="slot-lbl num">{count(items.length)} · {weight(items)} lb</span>
    {#if editing && inv.categories.length > 1}
      <button class="btn icon ghost" aria-label="Delete the {c.name} category" onclick={() => app.removeCategory(sheet, c.id)}><Icon name="trash" size="sm" /></button>
    {/if}
  </div>
  {#if !c.collapsed}
    <div class="list">
      {#each items as it (it.id)}{@render row(it)}{/each}
      <button class="add-line" onclick={() => app.addItem(sheet, "item", c.id)}><Icon name="plus" size="sm" />Add an item to {c.name}</button>
    </div>
  {/if}
{/each}
{#if editing}<button class="add-btn" onclick={() => app.addCategory(sheet)}><Icon name="plus" size="sm" />Add category</button>{/if}
