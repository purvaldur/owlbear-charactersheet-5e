<script lang="ts">
  // The editor popover, in the middle of the room. It edits its own copy of the sheet and sends each change to the
  // Codex, which saves it; the Codex sends the sheet again when it changes there, and closes this popover.
  import { onMount } from "svelte";
  import type { Room } from "../lib/obr/adapter";
  import type { Sheet } from "../lib/model/types";
  import { EDITOR, EDITOR_POPOVER, findEntry, type ChangeMessage, type EditKind, type EntryMessage, type OpenMessage } from "../lib/editor/protocol";
  import ItemEditor from "../components/ItemEditor.svelte";
  import Icon from "../components/Icon.svelte";

  let { room }: { room: Room } = $props();
  let sheet = $state<Sheet | null>(null);
  let kind = $state<EditKind>("action");
  let id = $state("");
  let focus = $state(0);
  /** Changes sent so far; the Codex acknowledges the last one it applied. */
  let seq = 0;
  /** The entry as last sent or received, so only real edits go out. */
  let known = "";
  const item = $derived(sheet ? findEntry(sheet, kind, id) : null);
  let maxHeight = 800;
  let head: HTMLElement | undefined = $state();
  let body: HTMLElement | undefined = $state();
  let foot: HTMLElement | undefined = $state();

  onMount(() => {
    const stop = room.pages.listen(EDITOR.open, (d) => {
      const m = d as OpenMessage;
      if (!m?.sheet || (!m.focus && m.ack < seq)) return;
      known = JSON.stringify(findEntry(m.sheet, m.kind, m.id));
      sheet = m.sheet;
      kind = m.kind;
      id = m.id;
      if (m.focus) focus++;
    });
    room.pages.send(EDITOR.ready, {});
    void room.viewportHeight().then((h) => (maxHeight = h - 32), () => {});
    return stop;
  });

  $effect(() => {
    if (!item || !sheet) return;
    const json = JSON.stringify(item);
    if (json === known) return;
    known = json;
    room.pages.send(EDITOR.change, { sheetId: sheet.id, kind, item: JSON.parse(json), seq: ++seq } satisfies ChangeMessage);
  });

  // Fit the popover to the form, up to the height of the room; past that the form scrolls.
  $effect(() => {
    const content = body?.firstElementChild;
    if (!content || !head || !foot) return;
    const ro = new ResizeObserver(() => {
      const pad = body ? parseFloat(getComputedStyle(body).paddingTop) + parseFloat(getComputedStyle(body).paddingBottom) : 0;
      const natural = Math.ceil(head!.offsetHeight + content.getBoundingClientRect().height + pad + foot!.offsetHeight);
      void room.setPopoverHeight(EDITOR_POPOVER, Math.min(natural, maxHeight)).catch(() => {});
    });
    ro.observe(content);
    return () => ro.disconnect();
  });

  const entry = (): EntryMessage => ({ sheetId: sheet!.id, kind, id });
  const done = () => room.pages.send(EDITOR.done, entry());
</script>

<svelte:window onkeydown={(e) => e.key === "Escape" && sheet && done()} />

{#if sheet && item}
  <div class="ed-page">
    <header class="ed-h" bind:this={head}>
      <h2>Edit {kind}</h2>
      <span class="ed-who">{sheet.name}</span>
    </header>
    <div class="ed-b" bind:this={body}>
      <!-- Bound because the form edits the entry in place; only a message from the Codex ever replaces it. -->
      <ItemEditor {sheet} {kind} bind:item={() => item!, () => {}} {focus} />
    </div>
    <footer class="ed-f" bind:this={foot}>
      <button class="btn ghost" style="color:var(--text-2)" onclick={() => room.pages.send(EDITOR.remove, entry())}><Icon name="trash" size="sm" />Delete {kind}</button>
      <span class="grow calc">Changes save as you type</span>
      <button class="btn primary" onclick={done}>Done</button>
    </footer>
  </div>
{/if}
