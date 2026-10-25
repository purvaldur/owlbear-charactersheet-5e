<script lang="ts">
  // The dialog popover, in the middle of the room: an entry's editor, an SRD list of spells or items, or the SRD creatures
  // to make a new sheet from. It works on its own copy of the sheet and sends each change to the Codex, which saves it;
  // the Codex sends the sheet again when it changes there, and closes this popover.
  import { onMount } from "svelte";
  import type { Room } from "../lib/obr/adapter";
  import type { Item, Sheet, Spell } from "../lib/model/types";
  import {
    EDITOR, EDITOR_POPOVER, findEntry, onSheet,
    type AddSrdMessage, type ChangeMessage, type CreateSheetMessage, type Dialog, type DoneMessage, type EntryMessage, type OpenMessage,
  } from "../lib/editor/protocol";
  import ItemEditor from "../components/ItemEditor.svelte";
  import Icon from "../components/Icon.svelte";
  import SrdPicker from "./SrdPicker.svelte";
  import MonsterPicker from "./MonsterPicker.svelte";
  import { fit } from "./fit";

  /** The tallest the popover gets; a long form or list scrolls inside it. */
  const MAX_HEIGHT = 800;

  let { room }: { room: Room } = $props();
  let sheet = $state<Sheet | null>(null);
  let dialog = $state<Dialog | null>(null);
  let focus = $state(0);
  /** Changes sent so far; the Codex acknowledges the last one it applied. */
  let seq = 0;
  /** The entry as last sent or received, so only real edits go out. */
  let known = "";
  const editing = $derived(dialog?.view === "edit" ? dialog : null);
  const item = $derived(sheet && editing ? findEntry(sheet, editing.kind, editing.id) : null);
  let maxHeight = $state(MAX_HEIGHT);
  const size = {
    max: () => maxHeight,
    set: (h: number) => void room.setPopoverHeight(EDITOR_POPOVER, h).catch(() => {}),
  };

  onMount(() => {
    const stop = room.pages.listen(EDITOR.open, (d) => {
      const m = d as OpenMessage;
      if (!m?.dialog || (!m.sheet && onSheet(m.dialog)) || (!m.focus && m.ack < seq)) return;
      known = m.dialog.view === "edit" && m.sheet ? JSON.stringify(findEntry(m.sheet, m.dialog.kind, m.dialog.id)) : "";
      sheet = m.sheet;
      dialog = m.dialog;
      if (m.focus) focus++;
    });
    room.pages.send(EDITOR.ready, {});
    void room.viewportHeight().then((h) => (maxHeight = Math.min(MAX_HEIGHT, h - 32)), () => {});
    return stop;
  });

  $effect(() => {
    if (!item || !sheet || !editing) return;
    const json = JSON.stringify(item);
    if (json === known) return;
    known = json;
    room.pages.send(EDITOR.change, { sheetId: sheet.id, kind: editing.kind, item: JSON.parse(json), seq: ++seq } satisfies ChangeMessage);
  });

  const done = () => dialog && room.pages.send(EDITOR.done, { sheetId: sheet?.id ?? "", dialog: $state.snapshot(dialog) } satisfies DoneMessage);
  const create = (made: Sheet) => room.pages.send(EDITOR.createSheet, { sheet: made } satisfies CreateSheetMessage);
  const remove = () => sheet && editing && room.pages.send(EDITOR.remove, { sheetId: sheet.id, kind: editing.kind, id: editing.id } satisfies EntryMessage);
  const addSrd = (entries: (Spell | Item)[]) =>
    sheet && dialog?.view === "srd" && room.pages.send(EDITOR.addSrd, { sheetId: sheet.id, list: dialog.list, entries } satisfies AddSrdMessage);
</script>

<svelte:window onkeydown={(e) => e.key === "Escape" && done()} />

{#if dialog?.view === "monsters"}
  <MonsterPicker rules={dialog.rules} {focus} {size} oncreate={create} onclose={done} />
{:else if sheet && dialog?.view === "srd"}
  <SrdPicker {sheet} list={dialog.list} cat={dialog.cat} {focus} {size} onadd={addSrd} onclose={done} />
{:else if sheet && editing && item}
  <div class="ed-page" use:fit={size}>
    <header class="ed-h">
      <div class="ed-title"><h2>Edit {editing.kind}</h2><span class="ed-who">{sheet.name}</span></div>
    </header>
    <div class="ed-b">
      <!-- Bound because the form edits the entry in place; only a message from the Codex ever replaces it. -->
      <ItemEditor {sheet} kind={editing.kind} bind:item={() => item!, () => {}} {focus} />
    </div>
    <footer class="ed-f">
      <button class="btn ghost" style="color:var(--text-2)" onclick={remove}><Icon name="trash" size="sm" />Delete {editing.kind}</button>
      <span class="grow calc">Changes save as you type</span>
      <button class="btn primary" onclick={done}>Done</button>
    </footer>
  </div>
{/if}
