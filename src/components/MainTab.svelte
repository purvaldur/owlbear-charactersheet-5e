<script lang="ts">
  // Main: skills (with passives) on the left; saving throws, actions, features and proficiencies on the right.
  import { app } from "../lib/app.svelte";
  import { ABILITIES, ABILITY, SKILLS } from "../lib/model/defaults";
  import { passive, saveMod, signed, skillMod } from "../lib/rules";
  import type { ProfLevel, Sheet } from "../lib/model/types";
  import ItemRow from "./ItemRow.svelte";
  import FeatureList from "./FeatureList.svelte";
  import ProficiencyList from "./ProficiencyList.svelte";
  import Icon from "./Icon.svelte";

  let { sheet }: { sheet: Sheet } = $props();
  const ui = app.ui;
  const editing = $derived(ui.edit);
  const titles = ["Not proficient", "Proficient", "Expertise"];
  const cycle = (k: string) => (sheet.skills[k] = (((sheet.skills[k] ?? 0) + 1) % 3) as ProfLevel);
</script>

<div class="two-col">
  <section class="col-l" aria-label="Skills">
    <div class="section-h">Skills</div>
    <div class="list">
      {#each SKILLS as [k, label, ab] (k)}
        {@const lv = sheet.skills[k] ?? 0}
        <div class="li">
          <div class="row skill-row">
            {#if editing}
              <button class="pm p{lv}" aria-label="{label}: {titles[lv]}. Click to change." title={titles[lv]} onclick={() => cycle(k)}><i></i></button>
            {:else}
              <span class="pm p{lv}" title={titles[lv]}><i></i></span>
            {/if}
            <button class="row-main" disabled={editing} aria-label="{label} check, {signed(skillMod(sheet, k))}" onclick={(e) => app.rollSkill(sheet, k, e)}>
              <span class="ab-tag">{ABILITY[ab].short}</span><span class="row-nm">{label}</span>
              <span class="val" style="margin-left:auto">{signed(skillMod(sheet, k))}</span>
            </button>
          </div>
        </div>
      {/each}
    </div>
    <div class="section-h">Passive</div>
    <dl class="passives">
      {#each [["perception", "Perception"], ["insight", "Insight"], ["investigation", "Investigation"]] as [k, l] (k)}
        <div><dt>{l}</dt><dd class="num">{passive(sheet, k!)}</dd></div>
      {/each}
    </dl>
  </section>

  <section class="col-r" aria-label="Saving throws, actions, features and proficiencies">
    <div class="section-h">Saving throws</div>
    <div class="saves">
      {#each ABILITIES as [k, , long] (k)}
        {@const on = sheet.abilities[k].save}
        <button
          class="save-cell"
          aria-pressed={editing ? on : undefined}
          aria-label={editing ? `${long} saves: ${on ? "proficient. Click to remove." : "not proficient. Click to add."}` : `${long} save, ${signed(saveMod(sheet, k))}${on ? ", proficient" : ""}`}
          onclick={(e) => (editing ? (sheet.abilities[k].save = !on) : app.rollSave(sheet, k, e))}
        >
          <span class="pm p{on ? 1 : 0}"><i></i></span><span class="sv-n">{long}</span><span class="val num">{signed(saveMod(sheet, k))}</span>
        </button>
      {/each}
    </div>

    {#if sheet.actions.length || editing}
      <div class="section-h">Actions</div>
      <div class="list" role="list">
        {#each sheet.actions as a (a.id)}<ItemRow {sheet} item={a} kind="action" list={sheet.actions} />{/each}
      </div>
      {#if editing}<button class="add-btn" onclick={() => app.addItem(sheet, "action")}><Icon name="plus" size="sm" />Add action</button>{/if}
    {/if}

    {#if sheet.features.length || editing}
      <div class="section-h">Features</div>
      <FeatureList {sheet} />
    {/if}

    {#if !sheet.actions.length && !sheet.features.length && !editing}
      <p class="log-empty">No actions or features yet. Use Edit to add them.</p>
    {/if}

    <div class="section-h">Proficiencies</div>
    <ProficiencyList {sheet} />
  </section>
</div>
