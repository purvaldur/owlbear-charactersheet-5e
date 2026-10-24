<script lang="ts">
  // The fields of an action, spell, feature or inventory item, shown in the editor popover. Edits change `item` directly.
  import { ABILITIES, ACTIVATIONS, DAMAGE_TYPES, RARITIES, RECHARGES, SPELL_LEVELS, damage } from "../lib/model/defaults";
  import { abMod, partText, prof, rollInfo, signed, spellAttack, spellDC } from "../lib/rules";
  import type { Action, Feature, Item, Sheet, Spell } from "../lib/model/types";
  import type { EditKind, Editable } from "../lib/editor/protocol";
  import Icon from "./Icon.svelte";
  import NumInput from "./NumInput.svelte";

  /** `focus` counts requests to focus the name field: each new entry to edit asks once. */
  let { sheet, kind, item = $bindable(), focus = 0 }: { sheet: Sheet; kind: EditKind; item: Editable; focus?: number } = $props();
  const action = $derived(kind === "action" ? (item as Action) : null);
  const spell = $derived(kind === "spell" ? (item as Spell) : null);
  const thing = $derived(kind === "item" ? (item as Item) : null);
  const info = $derived(kind === "item" ? null : rollInfo(sheet, item as Action | Spell | Feature, kind));
  const parts = $derived(action?.dmg ?? spell?.dmg ?? []);
  let nameInput: HTMLInputElement | undefined = $state();

  $effect(() => {
    if (focus && nameInput) nameInput.focus();
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
  /** An item that stops being magic, or stops needing attunement, can't stay attuned. */
  function setMagic(it: Item, change: Partial<Pick<Item, "rarity" | "attune">>) {
    Object.assign(it, change);
    if (!it.rarity) it.attune = false;
    if (!it.attune) it.attuned = false;
  }
  /** The category the item shows in: its own, or the first if its own is gone. */
  const category = (it: Item) => (sheet.inventory.categories.some((c) => c.id === it.cat) ? it.cat : sheet.inventory.categories[0]?.id);
  const DICE = [4, 6, 8, 10, 12, 20];
  const addPart = () => parts.push(damage(1, 6, "", 0, parts[0]?.type ?? "slashing"));
</script>

{#snippet abilityOptions(includeNone: boolean, includeSpell: boolean)}
  {#if includeNone}<option value="">None</option>{/if}
  {#if includeSpell}<option value="sc">Spellcasting</option>{/if}
  {#each ABILITIES as [k, , l] (k)}<option value={k}>{l}</option>{/each}
{/snippet}

<div class="item-ed" role="group" aria-label="Edit {item.name || kind}">
  <fieldset class="fs">
    <label class="fld"><span>Name</span><input class="in" bind:this={nameInput} bind:value={item.name} /></label>
    {#if thing}
      <div class="grid3">
        <label class="fld"><span>Quantity</span><NumInput class="in num" min={0} integer bind:value={thing.qty} fallback={1} /></label>
        <label class="fld"><span>Weight, lb each</span><NumInput class="in num" min={0} step="any" bind:value={thing.wt} /></label>
        <label class="fld"><span>Value, gp each</span><NumInput class="in num" min={0} step="any" bind:value={thing.cost} /></label>
      </div>
      <span class="calc">Values under 1 gp are fractions: 5 sp is 0.5 gp, 1 cp is 0.01 gp.</span>
      <div class="grid3" style="align-items:end">
        <label class="fld"><span>Category</span>
          <select class="in" bind:value={() => category(thing!), (cat) => (thing!.cat = cat ?? "")}>
            {#each sheet.inventory.categories as c (c.id)}<option value={c.id}>{c.name}</option>{/each}
          </select>
        </label>
        <label class="fld"><span>Rarity</span>
          <select class="in" bind:value={() => thing.rarity, (rarity) => setMagic(thing!, { rarity })}>{#each RARITIES as [k, l] (k)}<option value={k}>{l}</option>{/each}</select>
        </label>
        {#if thing.rarity}
          <label class="check" style="height:32px"><input type="checkbox" bind:checked={() => thing.attune, (attune) => setMagic(thing!, { attune })} />Requires attunement</label>
        {/if}
      </div>
    {/if}
    {#if action || spell}
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

  {#if info && (action || spell)}
    <fieldset class="fs">
      <div class="fs-h">
        <h3>{spell ? "Spell attack" : "Attack roll"} {#if info.hit != null}<small class="num">{signed(info.hit)} to hit</small>{/if}</h3>
        <label class="switch" title="Attack roll"><input type="checkbox" checked={!!action?.hit || !!spell?.hit} onchange={(e) => toggleHit(e.currentTarget.checked)} aria-label="Attack roll" /><span></span></label>
      </div>
      {#if action?.hit}
        <div class="grid3" style="align-items:end">
          <label class="fld"><span>Ability</span><select class="in" bind:value={action.hit.ab}>{@render abilityOptions(true, false)}</select></label>
          <label class="fld"><span>Flat bonus</span><NumInput class="in num" bind:value={action.hit.flat} /></label>
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
          <NumInput class="in num" min={0} max={100} integer bind:value={p.n} fallback={1} aria-label="Number of dice" />
          <select class="in" bind:value={p.d} aria-label="Die">
            {#each DICE.includes(p.d) ? DICE : [...DICE, p.d] as d (d)}<option value={d}>d{d}</option>{/each}
          </select>
          <select class="in" bind:value={p.ab} aria-label="Add ability modifier">{@render abilityOptions(true, kind === "spell")}</select>
          <NumInput class="in num" bind:value={p.flat} aria-label="Flat bonus" />
          <!-- An imported or SRD part can carry a type off the list ("temp. hp"); it stays selectable as it is. -->
          <select class="in" bind:value={p.type} aria-label="Damage type">
            {#each (DAMAGE_TYPES as readonly string[]).includes(p.type) ? DAMAGE_TYPES : [...DAMAGE_TYPES, p.type] as t (t)}<option value={t}>{t || "untyped"}</option>{/each}
          </select>
          <button class="btn icon ghost" aria-label="Remove this part" onclick={() => parts.splice(j, 1)}><Icon name="x" size="sm" /></button>
        </div>
      {/each}
      {#if parts.length}<span class="calc">Dice · die · ability · flat bonus · type. On a critical hit only the dice are doubled.</span>{/if}
      <button class="btn outline" style="align-self:flex-start" onclick={addPart}><Icon name="plus" size="sm" />Add a damage part</button>
    </fieldset>
  {/if}

  {#if kind === "action" || kind === "feature"}
    {@const it = item as Action | Feature}
    <fieldset class="fs">
      <div class="fs-h">
        <h3>Limited uses</h3>
        <label class="switch" title="Limited uses"><input type="checkbox" checked={!!it.uses} onchange={(e) => toggleUses(e.currentTarget.checked)} aria-label="Limited uses" /><span></span></label>
      </div>
      {#if it.uses}
        <div class="grid2">
          <label class="fld"><span>Uses</span><NumInput class="in num" min={1} max={100} integer bind:value={it.uses.max} fallback={1} /></label>
          <label class="fld"><span>Recharges on</span><select class="in" bind:value={it.uses.recharge}>{#each RECHARGES as [k, l] (k)}<option value={k}>{l}</option>{/each}</select></label>
        </div>
      {/if}
    </fieldset>
  {/if}

  <fieldset class="fs">
    <div class="fs-h"><h3>Description</h3>{#if !thing}<small>Shown on the roll card and when shared</small>{/if}</div>
    <textarea class="in" rows="4" bind:value={item.desc} aria-label="Description"></textarea>
  </fieldset>
</div>
