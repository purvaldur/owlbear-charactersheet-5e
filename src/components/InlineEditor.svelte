<script lang="ts">
  // Edits an action, spell or feature in place under its row (never a full-screen panel). Changes save as you type.
  import { app } from "../lib/app.svelte";
  import { ABILITIES, ACTIVATIONS, DAMAGE_TYPES, RECHARGES, SPELL_LEVELS, damage } from "../lib/model/defaults";
  import { abMod, partText, prof, rollInfo, signed, spellAttack, spellDC } from "../lib/rules";
  import type { Action, Feature, Sheet, Spell } from "../lib/model/types";
  import Icon from "./Icon.svelte";

  let { sheet, kind, item }: { sheet: Sheet; kind: "action" | "spell" | "feature"; item: Action | Spell | Feature } = $props();
  const word = $derived(kind);
  const action = $derived(kind === "action" ? (item as Action) : null);
  const spell = $derived(kind === "spell" ? (item as Spell) : null);
  const info = $derived(rollInfo(sheet, item, kind));
  const parts = $derived(action?.dmg ?? spell?.dmg ?? []);
  let nameInput: HTMLInputElement | undefined = $state();

  $effect(() => {
    if (app.ui.focusEditor && nameInput) {
      app.ui.focusEditor = false;
      nameInput.closest(".li")?.scrollIntoView({ block: "nearest" });
      nameInput.focus({ preventScroll: true });
    }
  });

  function toggleHit(on: boolean) {
    if (action) action.hit = on ? { ab: "str", prof: true, flat: 0 } : null;
    if (spell) spell.hit = on;
  }
  function toggleSave(on: boolean) {
    if (action) action.save = on ? { ab: "con", dc: null, target: "dex" } : null;
    if (spell) spell.save = on ? { target: "dex" } : null;
  }
  function toggleUses(on: boolean) {
    const it = item as Action | Feature;
    it.uses = on ? { max: 1, used: 0, recharge: "LR" } : null;
  }
  const addPart = () => parts.push(damage(1, 6, "", 0, parts[0]?.type ?? "slashing"));
</script>

{#snippet abilityOptions(includeNone: boolean, includeSpell: boolean)}
  {#if includeNone}<option value="">None</option>{/if}
  {#if includeSpell}<option value="sc">Spellcasting</option>{/if}
  {#each ABILITIES as [k, , l] (k)}<option value={k}>{l}</option>{/each}
{/snippet}

<div class="inline-ed" role="group" aria-label="Edit {item.name || word}">
  <fieldset class="fs">
    <label class="fld"><span>Name</span><input class="in" bind:this={nameInput} bind:value={item.name} /></label>
    {#if kind !== "feature"}
      {@const it = item as Action | Spell}
      <div class="grid2">
        <label class="fld"><span>Activation</span>
          <select class="in" bind:value={it.act}>{#each ACTIVATIONS as [k, l] (k)}<option value={k}>{l}</option>{/each}</select>
        </label>
        <label class="fld"><span>Range or note</span><input class="in" bind:value={it.range} placeholder="Melee · 5 ft" /></label>
      </div>
    {/if}
    {#if spell}
      <div class="grid3" style="align-items:end">
        <label class="fld"><span>Level</span>
          <select class="in" bind:value={spell.level}>{#each SPELL_LEVELS as o, l (l)}<option value={l}>{l === 0 ? "Cantrip" : o}</option>{/each}</select>
        </label>
        <label class="check"><input type="checkbox" bind:checked={spell.conc} />Concentration</label>
        <label class="check"><input type="checkbox" bind:checked={spell.ritual} />Ritual</label>
      </div>
    {/if}
  </fieldset>

  {#if kind !== "feature"}
    <fieldset class="fs">
      <div class="fs-h">
        <h3>{spell ? "Spell attack" : "Attack roll"} {#if info.hit != null}<small class="num">{signed(info.hit)} to hit</small>{/if}</h3>
        <label class="switch" title="Attack roll"><input type="checkbox" checked={!!action?.hit || !!spell?.hit} onchange={(e) => toggleHit(e.currentTarget.checked)} aria-label="Attack roll" /><span></span></label>
      </div>
      {#if action?.hit}
        <div class="grid3" style="align-items:end">
          <label class="fld"><span>Ability</span><select class="in" bind:value={action.hit.ab}>{@render abilityOptions(true, false)}</select></label>
          <label class="fld"><span>Flat bonus</span><input class="in num" type="number" bind:value={action.hit.flat} /></label>
          <label class="check" style="height:32px"><input type="checkbox" bind:checked={action.hit.prof} />Add proficiency</label>
        </div>
      {/if}
    </fieldset>

    <fieldset class="fs">
      <div class="fs-h">
        <h3>Saving throw {#if info.dc != null}<small class="num">DC {info.dc}</small>{/if}</h3>
        <label class="switch" title="Saving throw"><input type="checkbox" checked={!!action?.save || !!spell?.save} onchange={(e) => toggleSave(e.currentTarget.checked)} aria-label="Saving throw" /><span></span></label>
      </div>
      {#if action?.save}
        <div class="grid3">
          <label class="fld"><span>Target saves with</span><select class="in" bind:value={action.save.target}>{@render abilityOptions(false, false)}</select></label>
          <label class="fld"><span>DC from</span><select class="in" bind:value={action.save.ab}>{@render abilityOptions(true, false)}</select></label>
          <label class="fld"><span>Or fixed DC</span>
            <input class="in num" type="number" placeholder={String(8 + prof(sheet) + abMod(sheet, action.save.ab))} value={action.save.dc ?? ""}
              oninput={(e) => (action!.save!.dc = e.currentTarget.value === "" ? null : Number(e.currentTarget.value))} />
          </label>
        </div>
        <span class="calc">Calculated DC is 8 + proficiency + the ability modifier. A fixed DC overrides it.</span>
      {/if}
      {#if spell?.save}
        <label class="fld"><span>Target saves with</span><select class="in" bind:value={spell.save.target}>{@render abilityOptions(false, false)}</select></label>
        {#if sheet.spellcasting}<span class="calc">DC {spellDC(sheet)} and spell attack {signed(spellAttack(sheet))} come from spellcasting.</span>{/if}
      {/if}
    </fieldset>

    <fieldset class="fs">
      <div class="fs-h"><h3>Damage or healing</h3><small>{parts.length ? parts.map((p) => partText(sheet, p)).join(" + ") : "None"}</small></div>
      {#each parts as p, j (j)}
        <div class="dmg-part">
          <input class="in num" type="number" min="0" bind:value={p.n} aria-label="Number of dice" />
          <select class="in" bind:value={p.d} aria-label="Die">{#each [4, 6, 8, 10, 12, 20] as d (d)}<option value={d}>d{d}</option>{/each}</select>
          <select class="in" bind:value={p.ab} aria-label="Add ability modifier">{@render abilityOptions(true, kind === "spell")}</select>
          <input class="in num" type="number" bind:value={p.flat} aria-label="Flat bonus" />
          <select class="in" bind:value={p.type} aria-label="Damage type">{#each DAMAGE_TYPES as t (t)}<option value={t}>{t}</option>{/each}</select>
          <button class="btn icon ghost" aria-label="Remove this part" onclick={() => parts.splice(j, 1)}><Icon name="x" size="sm" /></button>
        </div>
      {/each}
      {#if parts.length}<span class="calc">Dice · die · ability · flat bonus · type. On a critical hit only the dice are doubled.</span>{/if}
      <button class="btn outline" style="align-self:flex-start" onclick={addPart}><Icon name="plus" size="sm" />Add a damage part</button>
    </fieldset>
  {/if}

  {#if kind !== "spell"}
    {@const it = item as Action | Feature}
    <fieldset class="fs">
      <div class="fs-h">
        <h3>Limited uses</h3>
        <label class="switch" title="Limited uses"><input type="checkbox" checked={!!it.uses} onchange={(e) => toggleUses(e.currentTarget.checked)} aria-label="Limited uses" /><span></span></label>
      </div>
      {#if it.uses}
        <div class="grid2">
          <label class="fld"><span>Uses</span><input class="in num" type="number" min="1" bind:value={it.uses.max} /></label>
          <label class="fld"><span>Recharges on</span><select class="in" bind:value={it.uses.recharge}>{#each RECHARGES as [k, l] (k)}<option value={k}>{l}</option>{/each}</select></label>
        </div>
      {/if}
    </fieldset>
  {/if}

  <fieldset class="fs">
    <div class="fs-h"><h3>Description</h3><small>Shown on the roll card and when shared</small></div>
    <textarea class="in" rows="4" bind:value={item.desc} aria-label="Description"></textarea>
  </fieldset>

  <div class="ed-f">
    <button class="btn ghost" style="color:var(--text-2)" onclick={() => app.deleteItem(sheet, kind, item.id)}><Icon name="trash" size="sm" />Delete {word}</button>
    <span class="grow calc">Changes save as you type</span>
    <button class="btn" onclick={() => (app.ui.editing = null)}>Done</button>
  </div>
</div>
