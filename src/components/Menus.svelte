<script lang="ts">
  // The floating layers anchored in the header: sheet switcher, overflow menu and the HP panel.
  import { app } from "../lib/app.svelte";
  import { hpHint, parseHpDelta } from "../lib/rules";
  import { download, exportFileName, exportJson, importJson } from "../lib/store/io";
  import type { Sheet } from "../lib/model/types";
  import Icon from "./Icon.svelte";
  import HpBar from "./HpBar.svelte";
  import HpBarSettings from "./HpBarSettings.svelte";

  let { sheet }: { sheet: Sheet | null } = $props();
  const ui = app.ui;
  let delta = $state("");
  let menuEl: HTMLDivElement | undefined = $state();
  let fileInput: HTMLInputElement | undefined = $state();
  const parsed = $derived(parseHpDelta(delta));
  const linked = $derived(sheet ? app.linkedTokens(sheet).length : 0);

  // Anchor each menu under the control that opened it.
  $effect(() => {
    if (!menuEl || !ui.menu) return;
    const sheetEl = menuEl.closest(".sheet");
    const anchor =
      ui.menu === "switcher"
        ? (sheetEl?.querySelector(".sub-line") ?? sheetEl?.querySelector(".switcher"))
        : sheetEl?.querySelector(ui.menu === "hp" ? ".vitals" : "[aria-label='More options']");
    if (ui.menu === "bars") menuEl.style.right = "16px";
    if (sheetEl && anchor) menuEl.style.top = `${anchor.getBoundingClientRect().bottom - sheetEl.getBoundingClientRect().top + 6}px`;
    if (ui.menu === "hp") (menuEl.querySelector("#f-hpdelta") as HTMLInputElement | null)?.focus();
    else (menuEl.querySelector("button:not(:disabled)") as HTMLButtonElement | null)?.focus();
  });

  function applyHp(op: "dmg" | "heal") {
    if (!sheet || !parsed.n) return;
    app.changeHp(sheet, op, parsed.n);
    delta = "";
    ui.menu = null;
  }

  function newSheet(kind: "character" | "creature") {
    app.store.create(kind);
    ui.menu = null;
    ui.edit = true;
    ui.tab = "main";
  }

  function exportSheets() {
    ui.menu = null;
    const sheets = sheet ? [sheet] : app.store.library.sheets;
    download(exportFileName(sheets), exportJson(sheets));
    ui.showToast({ msg: `Exported ${sheets.length === 1 ? sheets[0]!.name : `${sheets.length} sheets`}` });
  }

  function deleteSheet() {
    ui.menu = null;
    if (sheet) app.deleteSheet(sheet);
  }

  async function importFile(e: Event) {
    const file = (e.currentTarget as HTMLInputElement).files?.[0];
    (e.currentTarget as HTMLInputElement).value = "";
    ui.menu = null;
    if (!file) return;
    const res = importJson(await file.text());
    if (res.ok) {
      app.store.addSheets(res.sheets);
      ui.showToast({ msg: `Imported ${res.sheets.length === 1 ? res.sheets[0]!.name : `${res.sheets.length} sheets`}` });
    } else ui.showToast({ msg: `Couldn't import ${file.name}: ${res.errors[0]}` });
  }
</script>

<input bind:this={fileInput} type="file" accept=".json,application/json" class="sr" tabindex="-1" aria-hidden="true" onchange={importFile} />

{#if ui.menu === "switcher" && sheet}
  <div class="menu" bind:this={menuEl} style="left:16px;width:min(340px, calc(100% - 32px))">
    <div class="menu-h">{app.isGM ? "Your creatures" : "Your sheets"}</div>
    {#each app.store.library.sheets as s (s.id)}
      <button class="mi" class:on={s.id === sheet.id} onclick={() => { app.store.select(s.id); ui.menu = null; ui.edit = false; ui.editing = null; }}>
        <span class="av" style="background:{s.color}">{s.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}</span>
        <span class="mi-t">{s.name}<small>{s.subtitle}</small></span>
        <span class="mini"><span>{s.hp.cur}/{s.hp.max} · AC {s.ac}</span><HpBar hp={s.hp} /></span>
      </button>
    {/each}
    <div class="sep"></div>
    <button class="mi" onclick={() => newSheet("character")}><Icon name="plus" /><span class="mi-t">New character</span></button>
    <button class="mi" onclick={() => newSheet("creature")}><Icon name="plus" /><span class="mi-t">New creature</span></button>
    <button class="mi" onclick={() => fileInput?.click()}><Icon name="upload" /><span class="mi-t">Import a sheet file</span></button>
  </div>
{/if}

{#if ui.menu === "more"}
  <div class="menu" bind:this={menuEl} style="right:16px">
    <button class="mi" disabled={!sheet} onclick={() => { ui.menu = null; if (sheet) app.rest(sheet, "SR"); }}>
      <Icon name="moon" /><span class="mi-t">Short rest<small>Restores short-rest uses</small></span>
    </button>
    <button class="mi" disabled={!sheet} onclick={() => { ui.menu = null; if (sheet) app.rest(sheet, "LR"); }}>
      <Icon name="bed" /><span class="mi-t">Long rest<small>Restores HP, slots and all uses</small></span>
    </button>
    <div class="sep"></div>
    {#if app.room?.inOwlbear !== false || app.tokens.length}
      <button class="mi" disabled={!sheet} onclick={() => { ui.menu = null; if (sheet) void app.linkSelected(sheet); }}>
        <Icon name="link" /><span class="mi-t">Link to selected token<small>{linked ? `Linked to ${linked} token${linked > 1 ? "s" : ""}` : "Shows its HP on the map"}</small></span>
      </button>
      {#if linked}
        <button class="mi" onclick={() => { ui.menu = null; if (sheet) void app.unlinkSheet(sheet); }}>
          <Icon name="unlink" /><span class="mi-t">Unlink {linked > 1 ? `${linked} tokens` : "token"}</span>
        </button>
      {/if}
      {#if app.isGM}
        <button class="mi" onclick={() => (ui.menu = "bars")}>
          <Icon name="heart" /><span class="mi-t">Token HP bars<small>What the GM and players see</small></span>
        </button>
      {/if}
      <div class="sep"></div>
    {/if}
    <button class="mi" onclick={() => { ui.wide = !ui.wide; ui.menu = null; }}>
      <Icon name="widen" /><span class="mi-t">{ui.wide ? "Narrow panel" : "Widen panel"}<small>{ui.wide ? "Back to 500 px" : "Room for damage types and ability tags"}</small></span>
    </button>
    <button class="mi" disabled={!sheet} onclick={deleteSheet}><Icon name="trash" /><span class="mi-t">Delete this sheet<small>{sheet ? sheet.name : ""}</small></span></button>
    <button class="mi" disabled={!app.store.library.sheets.length} onclick={exportSheets}><Icon name="download" /><span class="mi-t">Export sheet file</span></button>
    <button class="mi" onclick={() => fileInput?.click()}><Icon name="upload" /><span class="mi-t">Import a sheet file</span></button>
    <div class="sep"></div>
    <div class="status"><i class:off={app.dice.name !== "dice+"}></i>{app.dice.name === "dice+" ? "Dice+ found: rolls use its 3D dice" : "Dice+ not found: using built-in dice"}</div>
    <div class="status" style="padding-top:0"><i class:off={app.store.storageBlocked}></i>{app.store.storageBlocked ? "Not saving: storage is blocked" : "Sheets are saved in this browser"}</div>
  </div>
{/if}

{#if ui.menu === "bars" && app.isGM}
  <div class="menu bars-panel" role="dialog" aria-label="Token HP bars" bind:this={menuEl}>
    <HpBarSettings />
  </div>
{/if}

{#if ui.menu === "hp" && sheet}
  <div class="menu hp-panel" role="dialog" aria-label="Change hit points" bind:this={menuEl} style="left:24px">
    <h3>Hit points <span class="num">{sheet.hp.cur} / {sheet.hp.max}</span></h3>
    <form class="hp-change" onsubmit={(e) => { e.preventDefault(); applyHp(parsed.op); }}>
      <label class="fld"><span>Damage or heal</span><input class="in num" id="f-hpdelta" inputmode="numeric" autocomplete="off" placeholder="7 or +7" aria-describedby="hp-hint" bind:value={delta} /></label>
      <div class="row2b">
        <button class="btn danger" type="button" onclick={() => applyHp("dmg")}>Damage</button>
        <button class="btn" type="button" onclick={() => applyHp("heal")}>Heal</button>
      </div>
    </form>
    <div class="hint" id="hp-hint">{hpHint(sheet.hp, parsed.op, parsed.n)}</div>
    <label class="fld temp-fld">
      <span>Temp HP</span>
      <input class="in num" type="number" min="0" inputmode="numeric" placeholder="0" value={sheet.hp.temp || ""} oninput={(e) => (sheet.hp.temp = Math.max(0, Number(e.currentTarget.value) || 0))} />
    </label>
  </div>
{/if}
