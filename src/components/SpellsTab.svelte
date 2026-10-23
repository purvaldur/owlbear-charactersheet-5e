<script lang="ts">
  import { app } from "../lib/app.svelte";
  import { ABILITIES, ABILITY, SPELL_LEVELS } from "../lib/model/defaults";
  import { signed, spellAttack, spellDC } from "../lib/rules";
  import type { Sheet } from "../lib/model/types";
  import ItemRow from "./ItemRow.svelte";
  import Icon from "./Icon.svelte";

  let { sheet }: { sheet: Sheet } = $props();
  const ui = app.ui;
  const editing = $derived(ui.edit);
  const levels = $derived(
    Array.from({ length: 10 }, (_, l) => l).filter((l) => {
      const sl = sheet.slots[l];
      return sheet.spells.some((s) => s.level === l) || (sl && sl.max) || editing;
    }),
  );

  function toggleSlot(l: number, i: number) {
    const sl = sheet.slots[l]!;
    const left = sl.max - sl.used;
    sl.used = i < left ? sl.used + 1 : sl.used - 1;
  }
  function changeMax(l: number, d: number) {
    const sl = (sheet.slots[l] ??= { max: 0, used: 0 });
    sl.max = Math.max(0, sl.max + d);
    sl.used = Math.min(sl.used, sl.max);
  }
</script>

{#if !sheet.spellcasting}
  <div class="empty" style="padding:24px 8px">
    <h2>No spellcasting</h2>
    <p>Add spellcasting to set a casting ability, track spell slots and add spells, including from the SRD list.</p>
    <div class="acts">
      <button class="btn primary" onclick={() => (sheet.spellcasting = { ab: "int", atk: 0, dc: 0 })}><Icon name="plus" size="sm" />Add spellcasting</button>
    </div>
  </div>
{:else}
  {#if editing}
    <div class="fs" style="margin-bottom:6px">
      <div class="grid3">
        <label class="fld"><span>Casting ability</span>
          <select class="in" bind:value={sheet.spellcasting.ab}>{#each ABILITIES as [k, , l] (k)}<option value={k}>{l}</option>{/each}</select>
        </label>
        <label class="fld"><span>Attack bonus</span><input class="in num" type="number" bind:value={sheet.spellcasting.atk} /></label>
        <label class="fld"><span>DC bonus</span><input class="in num" type="number" bind:value={sheet.spellcasting.dc} /></label>
      </div>
      <span class="calc">Spell attack {signed(spellAttack(sheet))} and save DC {spellDC(sheet)}, from {ABILITY[sheet.spellcasting.ab].long}, proficiency and the bonuses above. Bonuses are for magic items.</span>
      <div><button class="btn ghost" onclick={() => app.removeSpellcasting(sheet)}><Icon name="trash" size="sm" />Remove spellcasting</button></div>
    </div>
  {:else}
    <div class="cast-line">
      <span>Spellcasting <b>{ABILITY[sheet.spellcasting.ab].long}</b></span>
      <span>Spell attack <b class="num">{signed(spellAttack(sheet))}</b></span>
      <span>Save DC <b class="num">{spellDC(sheet)}</b></span>
    </div>
  {/if}

  {#each levels as l (l)}
    {@const sl = sheet.slots[l]}
    <div class="section-h spell-h">
      <span>{SPELL_LEVELS[l]}</span>
      {#if l === 0}<span class="slot-lbl">at will</span>{/if}
      <span class="grow"></span>
      {#if l > 0 && editing}
        <span class="qty" aria-label="{SPELL_LEVELS[l]} slots">
          <button aria-label="Remove a slot" onclick={() => changeMax(l, -1)}><Icon name="minus" size="sm" /></button>
          <span class="num">{sl?.max ?? 0}</span>
          <button aria-label="Add a slot" onclick={() => changeMax(l, 1)}><Icon name="plus" size="sm" /></button>
        </span><span class="slot-lbl">slots</span>
      {:else if l > 0 && sl && sl.max}
        {@const left = sl.max - sl.used}
        <span class="slots" role="group" aria-label="{SPELL_LEVELS[l]} slots, {left} of {sl.max} left">
          {#each Array.from({ length: sl.max }, (_, i) => i) as i (i)}
            <button class="slot" class:on={i < left} aria-label="{i < left ? 'Spend' : 'Restore'} a {SPELL_LEVELS[l]} slot" onclick={() => toggleSlot(l, i)}></button>
          {/each}
        </span><span class="slot-lbl num">{left}/{sl.max}</span>
      {/if}
    </div>
    <div class="list" role="list">
      {#each sheet.spells.filter((s) => s.level === l) as s (s.id)}<ItemRow {sheet} item={s} kind="spell" list={sheet.spells} />{/each}
    </div>
  {/each}

  {#if editing}
    <div style="display:flex;gap:8px;padding:8px">
      <button class="add-btn" style="margin:0" onclick={() => app.addItem(sheet, "spell")}><Icon name="plus" size="sm" />New spell</button>
      <button class="add-btn" style="margin:0" onclick={() => (ui.picker = { q: "", lvl: "all", sel: [] })}><Icon name="search" size="sm" />Add from SRD list</button>
    </div>
  {/if}
{/if}
