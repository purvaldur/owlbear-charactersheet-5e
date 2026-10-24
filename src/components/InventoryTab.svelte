<script lang="ts">
  // Inventory is play, not building: quantities, coins and items are editable without Edit.
  import { app } from "../lib/app.svelte";
  import { newItem } from "../lib/model/defaults";
  import type { Sheet } from "../lib/model/types";
  import Icon from "./Icon.svelte";
  import NumInput from "./NumInput.svelte";

  let { sheet }: { sheet: Sheet } = $props();
  const inv = $derived(sheet.inventory);
  const total = $derived(inv.items.reduce((a, i) => a + i.qty * i.wt, 0));
  const coins = ["cp", "sp", "ep", "gp", "pp"] as const;
  let name = $state("");
  let weight = $state<number | null>(null);
  let nameInput: HTMLInputElement | undefined = $state();
  const fmt = (n: number) => String(+n.toFixed(2));

  function add(e: SubmitEvent) {
    e.preventDefault();
    if (!name.trim()) return nameInput?.focus();
    inv.items.push(newItem(name.trim(), weight || 0));
    name = "";
    weight = null;
    nameInput?.focus();
  }
  function remove(id: string) {
    const i = inv.items.findIndex((x) => x.id === id);
    const [gone] = inv.items.splice(i, 1);
    app.ui.showToast({ msg: `Removed ${gone!.name}`, undo: () => inv.items.splice(i, 0, gone!) });
  }
</script>

<div class="coin-strip">
  {#each coins as k (k)}
    <label class="coin2"><span>{k}</span><NumInput class="num" min={0} bind:value={inv.coins[k]} aria-label="{k} coins" /></label>
  {/each}
</div>
<div class="section-h"><span>Items</span><span class="grow"></span><span class="slot-lbl num">{inv.items.length} items · {+total.toFixed(1)} lb</span></div>
<div class="list">
  {#each inv.items as it (it.id)}
    <div class="li">
      <div class="row inv-row" class:gone={it.qty === 0}>
        <span class="row-txt" style="flex:1">
          <span class="row-nm"><span class="ell">{it.name}</span></span>
          <span class="row-fx">{it.wt ? `${fmt(it.wt)} lb each${it.qty > 1 ? ` · ${fmt(it.qty * it.wt)} lb` : ""}` : "weightless"}</span>
        </span>
        <span class="qty2">
          <button disabled={it.qty === 0} aria-label="One fewer {it.name}" onclick={() => (it.qty = Math.max(0, it.qty - 1))}><Icon name="minus" size="sm" /></button>
          <span class="num" aria-label="{it.qty} carried">{it.qty}</span>
          <button aria-label="One more {it.name}" onclick={() => it.qty++}><Icon name="plus" size="sm" /></button>
        </span>
        <button class="btn icon ghost rm" aria-label="Remove {it.name}" onclick={() => remove(it.id)}><Icon name="x" size="sm" /></button>
      </div>
    </div>
  {/each}
</div>
{#if !inv.items.length}<p class="log-empty" style="padding:12px 8px">Nothing carried yet.</p>{/if}
<form class="add-row" onsubmit={add}>
  <Icon name="plus" size="sm" />
  <input class="in" bind:this={nameInput} bind:value={name} placeholder="Add an item" aria-label="New item name" />
  <input class="in num" type="number" min="0" step="0.1" bind:value={weight} placeholder="lb" aria-label="Weight in pounds" />
  <button class="btn" type="submit">Add</button>
</form>
