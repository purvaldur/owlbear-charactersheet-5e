<script lang="ts">
  // The popover: sheet column plus the optional table-rolls sidebar.
  import { app } from "../lib/app.svelte";
  import { orDefault } from "../lib/obr/safe";
  import type { Tab } from "../lib/ui/ui.svelte";
  import Header from "./Header.svelte";
  import Menus from "./Menus.svelte";
  import AbilityStrip from "./AbilityStrip.svelte";
  import MainTab from "./MainTab.svelte";
  import SpellsTab from "./SpellsTab.svelte";
  import InventoryTab from "./InventoryTab.svelte";
  import BackgroundTab, { hasBackground } from "./BackgroundTab.svelte";
  import NotesTab from "./NotesTab.svelte";
  import Sidebar from "./Sidebar.svelte";
  import Icon from "./Icon.svelte";
  import { download, exportFileName, exportJson } from "../lib/store/io";

  let { embedded = false }: { embedded?: boolean } = $props();
  const ui = app.ui;
  const sheet = $derived(app.sheet);
  const unread = $derived(app.store.unread);
  const unreadMsg = $derived.by(() => {
    if (!unread.length) return "";
    const one = unread.length === 1;
    const who = one ? `${unread[0]!.name} could not be read` : `${unread.length} sheets could not be read (${unread.map((u) => u.name).join(", ")})`;
    return `${who}: ${unread[0]!.errors[0]}. ${one ? "It is kept as it was" : "They are kept as they were"} in this browser; your other sheets work as usual.`;
  });

  const tabs = $derived.by((): [Tab, string][] => {
    if (!sheet) return [];
    const t: [Tab, string][] = [["main", "Main"]];
    if (sheet.spells.length || sheet.spellcasting || ui.edit) t.push(["spells", "Spells"]);
    if (sheet.kind === "character" || sheet.inventory.items.length || ui.edit) t.push(["inventory", "Inventory"]);
    if (sheet.kind === "character" || hasBackground(sheet.background) || ui.edit) t.push(["background", "Background"]);
    t.push(["notes", "Notes"]);
    return t;
  });
  $effect(() => {
    if (tabs.length && !tabs.some(([k]) => k === ui.tab)) ui.tab = "main";
  });

  // Keep the Owlbear popover as wide as the layout needs.
  $effect(() => {
    if (app.room) void orDefault(app.room.setSize(app.popoverWidth), undefined, "popover size");
  });

  function onWindowClick(e: MouseEvent) {
    const t = e.target as HTMLElement;
    if (ui.menu && !t.closest(".menu") && !t.closest("[data-menu-trigger]")) ui.menu = null;
  }
  function onKey(e: KeyboardEvent) {
    if (e.key !== "Escape") return;
    if (ui.menu) {
      ui.menu = null;
      ui.menuTrigger?.focus();
    }
    else if (ui.dialog) ui.dialog = null;
    else if (ui.sidebar) ui.sidebar = false;
  }
  function tabKeys(e: KeyboardEvent) {
    const i = tabs.findIndex(([k]) => k === ui.tab);
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const [k] = tabs[(next + tabs.length) % tabs.length]!;
    ui.tab = k;
    requestAnimationFrame(() => document.getElementById(`tab-${k}`)?.focus());
  }
</script>

<svelte:window onclick={onWindowClick} onkeydown={onKey} />

<div class="pop" class:wide={ui.wide} class:log-open={ui.sidebar} class:embedded class:overlay-side={app.overlaySidebar} id="pop">
  <div class="sheet" class:editing={ui.edit} id="sheet">
    <Header {sheet} />

    {#if app.store.storageBlocked || app.store.loadErrors.length || unread.length}
      <div style="display:flex;flex-direction:column;gap:6px;padding-top:10px">
        {#if app.store.loadErrors.length}
          <div class="banner warn">
            <Icon name="alert" size="sm" /><span>Your saved sheets could not be read ({app.store.loadErrors[0]}). They are untouched; nothing new will be saved until this is fixed.</span>
          </div>
        {:else if unread.length}
          <div class="banner warn">
            <Icon name="alert" size="sm" /><span>{unreadMsg}</span>
          </div>
        {/if}
        {#if app.store.storageBlocked && !app.store.loadErrors.length}
          <div class="banner warn">
            <Icon name="alert" size="sm" /><span>This browser is blocking storage, so changes will be lost when you leave the room. Export a file to keep your sheets.</span>
            <button class="btn" onclick={() => download(exportFileName(app.store.library.sheets), exportJson(app.store.library.sheets))}>Export</button>
          </div>
        {/if}
      </div>
    {/if}

    {#if sheet}
      <AbilityStrip {sheet} />
      {#if tabs.length > 1}
        <div class="tabs" role="tablist" tabindex="-1" onkeydown={tabKeys}>
          {#each tabs as [k, label] (k)}
            <button role="tab" id="tab-{k}" aria-selected={ui.tab === k} tabindex={ui.tab === k ? 0 : -1} onclick={() => (ui.tab = k)}>{label}</button>
          {/each}
        </div>
      {/if}
      <div class="scroll" id="scroll-main" role={tabs.length > 1 ? "tabpanel" : undefined} aria-labelledby={tabs.length > 1 ? `tab-${ui.tab}` : undefined}>
        {#if ui.tab === "spells"}<SpellsTab {sheet} />
        {:else if ui.tab === "inventory"}<InventoryTab {sheet} />
        {:else if ui.tab === "background"}<BackgroundTab {sheet} />
        {:else if ui.tab === "notes"}<NotesTab {sheet} />
        {:else}<MainTab {sheet} />{/if}
      </div>
    {:else}
      <div class="scroll">
        <div class="empty">
          <h2>No sheets yet</h2>
          <p>
            {app.isGM
              ? "Make a creature for each monster or NPC you run, or a character if you play too."
              : "Make a sheet for your character. You can add more later for companions, familiars or alternate characters."}
            Sheets are saved in this browser.
          </p>
          <div class="acts">
            <button class="btn primary" onclick={() => app.newSheet(app.isGM ? "creature" : "character")}><Icon name="plus" size="sm" />{app.isGM ? "New creature" : "New character"}</button>
            <button class="btn" onclick={() => app.newSheet(app.isGM ? "character" : "creature")}>{app.isGM ? "New character" : "New creature"}</button>
          </div>
        </div>
      </div>
    {/if}

    <Menus {sheet} />

    {#if ui.toast}
      <div class="toast" role="status">
        <span>{ui.toast.msg}</span>
        {#if ui.toast.undo}
          <button class="btn" onclick={() => { const u = ui.toast?.undo; ui.toast = null; u?.(); }}><Icon name="undo" size="sm" />Undo</button>
        {/if}
        {#if ui.toast.action}
          <button class="btn" onclick={() => { const a = ui.toast?.action; ui.toast = null; a?.run(); }}>{ui.toast.action.label}</button>
        {/if}
      </div>
    {/if}

  </div>

  {#if ui.sidebar}<Sidebar />{/if}
</div>
