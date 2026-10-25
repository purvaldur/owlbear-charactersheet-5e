<script lang="ts">
  import { app } from "../lib/app.svelte";
  import { prof, signed } from "../lib/rules";
import { RULESETS } from "../lib/model/defaults";
  import type { Sheet } from "../lib/model/types";
  import Icon from "./Icon.svelte";
  import HpBar from "./HpBar.svelte";
  import NumInput from "./NumInput.svelte";

  let { sheet }: { sheet: Sheet | null } = $props();
  const ui = app.ui;
  const editing = $derived(ui.edit && !!sheet);
  const down = $derived(!!sheet && !editing && sheet.hp.cur === 0 && sheet.kind === "character");
  const unseen = $derived(ui.sidebar ? 0 : app.log.unseen);

  const modes = [
    ["adv", "Adv", "Advantage on the next roll. Shift-click any roll for the same."],
    ["normal", "Normal", "Normal roll"],
    ["dis", "Dis", "Disadvantage on the next roll. Ctrl- or Cmd-click any roll for the same."],
  ] as const;

  function toggleMenu(m: "switcher" | "more" | "hp") {
    ui.menuTrigger = document.activeElement as HTMLElement | null;
    ui.menu = ui.menu === m ? null : m;
    ui.newSheet = null;
  }
</script>

{#snippet logButton()}
  <button
    class="btn icon ghost logbtn"
    class:flash={app.log.flash}
    class:private={ui.vis === "gm"}
    aria-pressed={ui.sidebar}
    aria-controls="side"
    title={ui.sidebar ? "Hide table rolls" : "Show table rolls"}
    aria-label={`Table rolls${unseen ? `, ${unseen} new` : ""}`}
    onclick={() => app.toggleSidebar()}
  >
    <Icon name="dice" />
    {#if unseen}<span class="badge">{unseen}</span>{/if}
    {#if ui.vis === "gm"}
      <span class="priv" title={app.isGM ? "Your rolls are hidden from players" : "Your rolls go to the GM only"}><Icon name="eyeOff" /></span>
    {/if}
  </button>
{/snippet}

<header class="head">
  <div class="head-card">
    {#if !sheet}
      <div class="id-row">
        <div class="switcher" style="cursor:default">
          <span class="nm"><span>Valdur's Heroic Codex</span></span><span class="sub">No sheets yet</span>
        </div>
        {@render logButton()}
        <button class="btn icon ghost" data-menu-trigger aria-label="More options" onclick={() => toggleMenu("more")}><Icon name="more" /></button>
      </div>
    {:else}
      <div class="id-row">
        {#if editing}
          <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:6px">
            <input class="in name-in" bind:value={sheet.name} aria-label="Name" />
            <input class="in" bind:value={sheet.subtitle} placeholder={sheet.kind === "creature" ? "CR and size" : "Species, class and level"} aria-label="Subtitle" />
            <div class="edit-meta">
              <label>Proficiency bonus <NumInput class="in num" style="width:56px" bind:value={sheet.prof} fallback={2} /></label>
              <label>Rules
                <select class="in" bind:value={sheet.rules} title="Which SRD the sheet adds spells and items from">
                  {#each RULESETS as [k, label, srd] (k)}<option value={k}>{label} ({srd})</option>{/each}
                </select>
              </label>
            </div>
          </div>
        {:else}
          {@const linked = app.linkedTokens(sheet).length}
          {@const linkText = linked ? `Linked to ${linked} token${linked > 1 ? "s" : ""}` : ""}
          <button class="switcher" data-menu-trigger aria-haspopup="menu" aria-expanded={ui.menu === "switcher"} aria-label="{sheet.name}{linked ? `, ${linkText.toLowerCase()}` : ''}. Switch sheet" onclick={() => toggleMenu("switcher")}>
            <span class="nm"><span>{sheet.name}</span>{#if linked}<span class="nm-link" title={linkText}><Icon name="link" size="sm" /></span>{/if}<Icon name="chevronDown" size="sm" /></span>
          </button>
        {/if}
        {@render logButton()}
        <button class="btn" class:primary={ui.edit} onclick={() => { ui.edit = !ui.edit; ui.dialog = null; }}>
          <Icon name={ui.edit ? "check" : "pencil"} size="sm" />{ui.edit ? "Done" : "Edit"}
        </button>
        <button class="btn icon ghost" data-menu-trigger aria-haspopup="menu" aria-expanded={ui.menu === "more"} aria-label="More options" onclick={() => toggleMenu("more")}>
          <Icon name="more" />
        </button>
        {#if !editing}
          <!-- The subtitle runs the full card width under the action buttons, which only share the name's line. -->
          <span class="sub sub-line" title={sheet.subtitle || undefined}>
            <span class="sub-text">{sheet.subtitle || (sheet.kind === "creature" ? "Creature" : "Character")}</span><span class="sub-prof">· Prof {signed(prof(sheet))}</span>
          </span>
        {/if}
      </div>

      <div class="vitals" class:down>
        {#if editing}
          <div class="hp" style="cursor:default">
            <span class="hp-line">
              <label class="edit-meta">Max HP <NumInput class="in num" style="width:72px" bind:value={sheet.hp.max} fallback={10} /></label>
            </span>
            <HpBar hp={sheet.hp} />
          </div>
          <label class="edit-meta ac-edit">AC <NumInput class="in num" style="width:56px" bind:value={sheet.ac} fallback={10} aria-label="Armor class" /></label>
        {:else if down}
          <div class="death">
            <span class="death-label"><Icon name="alert" size="sm" />Down: death saves</span>
            <span class="death-row">
              <span class="pips" aria-label="{sheet.death.s} successes">
                {#each [0, 1, 2] as i (i)}<span class="pip ok" class:on={i < sheet.death.s}></span>{/each}
              </span>
              <span class="pips" aria-label="{sheet.death.f} failures">
                {#each [0, 1, 2] as i (i)}<span class="pip bad" class:on={i < sheet.death.f}></span>{/each}
              </span>
              <button class="btn" onclick={() => app.rollDeathSave(sheet)}><Icon name="dice" size="sm" />Roll</button>
              <button class="btn" data-menu-trigger onclick={() => toggleMenu("hp")}>Heal</button>
            </span>
          </div>
        {:else}
          <button
            class="hp"
            data-menu-trigger
            aria-haspopup="dialog"
            aria-label="Hit points {sheet.hp.cur} of {sheet.hp.max}{sheet.hp.temp ? `, ${sheet.hp.temp} temporary` : ''}. Change hit points"
            onclick={() => toggleMenu("hp")}
          >
            <span class="hp-line">
              <span class="hp-cur num">{sheet.hp.cur}</span><span class="hp-max num">/ {sheet.hp.max}</span>
              {#if sheet.hp.temp}<span class="hp-temp num">+{sheet.hp.temp} temp</span>{/if}
            </span>
            <HpBar hp={sheet.hp} />
          </button>
        {/if}
        {#if !editing}
          <div class="ac" title="Armor class">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>
            <div><b class="num">{sheet.ac}</b><small>AC</small></div>
          </div>
        {/if}
        <div class="seg" role="group" aria-label="Roll mode for the next roll">
          {#each modes as [v, label, title] (v)}
            <button aria-pressed={ui.mode === v} {title} onclick={() => (ui.mode = v)}>{label}</button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</header>
