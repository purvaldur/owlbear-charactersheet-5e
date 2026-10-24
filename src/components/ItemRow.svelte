<script lang="ts">
  // One action or spell: a single roll target. The effects line breaks only between segments; the range stays whole.
  import { app } from "../lib/app.svelte";
  import { ACTIVATIONS } from "../lib/model/defaults";
  import { effects } from "../lib/rules";
  import type { Action, Sheet, Spell } from "../lib/model/types";
  import Uses from "./Uses.svelte";
  import Icon from "./Icon.svelte";
  import { reorderHandlers } from "../lib/ui/reorder";

  let { sheet, item, kind, list }: { sheet: Sheet; item: Action | Spell; kind: "action" | "spell"; list: (Action | Spell)[] } = $props();
  // Spells share one list but show by level, so they reorder among their own level.
  const drag = $derived(reorderHandlers(list, () => item, kind === "spell" ? () => list.filter((s) => (s as Spell).level === (item as Spell).level) : undefined));
  const ui = app.ui;
  const fx = $derived(effects(sheet, item, kind));
  const editing = $derived(ui.edit);
  const open = $derived(editing && ui.editing?.id === item.id);
  const actLabel = $derived(ACTIVATIONS.find((a) => a[0] === item.act)?.[1] ?? "");
  const toggleEditor = () => ui.toggleEditor(kind, item.id);
</script>

<div class="li" class:open draggable={editing && !open} ondragstart={drag.ondragstart} ondragover={drag.ondragover} ondrop={drag.ondrop} ondragend={drag.ondragend} role="listitem">
  <div class="row">
    {#if editing}<button class="grip" title="Drag, or use the arrow keys, to reorder" aria-label="Reorder {item.name}. Use the up and down arrow keys." onkeydown={drag.onkeydown}><Icon name="grip" size="sm" /></button>{/if}
    <button
      class="row-main"
      aria-pressed={editing ? open : undefined}
      aria-label="{editing ? 'Edit' : 'Roll'} {item.name}"
      title={editing ? "Edit" : `Roll everything for ${item.name}`}
      onclick={(e) => (editing ? toggleEditor() : app.rollItem(sheet, item, kind, e))}
    >
      <span class="tag" title={actLabel}>{item.act}</span>
      <span class="row-txt">
        <span class="row-nm"><span class="ell">{item.name}</span></span>
        {#if fx.fx.length || fx.range}
          <span class="row-fx">
            {#each fx.fx as seg, i (i)}
              {#if i > 0}<span class="fx-sep" aria-hidden="true">{" · "}</span>{/if}<span class="fx-i"><b>{seg.strong}</b> {seg.rest}</span>
            {/each}
            {#if fx.range}
              {#if fx.fx.length}<span class="fx-sep" aria-hidden="true">{" · "}</span>{/if}<span class="fx-i rng">{fx.range}</span>
            {/if}
          </span>
        {/if}
      </span>
    </button>
    {#if kind === "action" && (item as Action).uses}<Uses uses={(item as Action).uses!} name={item.name} />{/if}
    {#if editing}
      <span class="edit-tools">
        <button class="btn icon ghost" aria-pressed={open} aria-label="Edit {item.name}" onclick={toggleEditor}><Icon name="pencil" size="sm" /></button>
        <button class="btn icon ghost" aria-label="Delete {item.name}" onclick={() => app.deleteItem(sheet, kind, item.id)}><Icon name="trash" size="sm" /></button>
      </span>
    {/if}
  </div>
</div>
