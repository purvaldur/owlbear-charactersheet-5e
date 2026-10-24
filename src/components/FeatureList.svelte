<script lang="ts">
  import { app } from "../lib/app.svelte";
  import type { Sheet } from "../lib/model/types";
  import Icon from "./Icon.svelte";
  import Uses from "./Uses.svelte";
  import Details from "./Details.svelte";
  import { reorderHandlers } from "../lib/ui/reorder";

  let { sheet }: { sheet: Sheet } = $props();
  const ui = app.ui;
  const editing = $derived(ui.edit);
  const toggleEditor = (id: string) => ui.toggleEditor("feature", id);
</script>

<div class="list" role="list">
  {#each sheet.features as f (f.id)}
    {@const open = editing ? ui.editing?.id === f.id : !!ui.open[f.id]}
    {@const drag = reorderHandlers(sheet.features, () => f)}
    <div class="li" class:open={editing && open} draggable={editing && !open} ondragstart={drag.ondragstart} ondragover={drag.ondragover} ondrop={drag.ondrop} ondragend={drag.ondragend} role="listitem">
      <div class="row">
        {#if editing}<button class="grip" title="Drag, or use the arrow keys, to reorder" aria-label="Reorder {f.name}. Use the up and down arrow keys." onkeydown={drag.onkeydown}><Icon name="grip" size="sm" /></button>{/if}
        <button class="row-main" aria-expanded={editing ? undefined : open} aria-pressed={editing ? open : undefined} onclick={() => (editing ? toggleEditor(f.id) : ui.toggle(f.id))}>
          <span class="row-txt"><span class="row-nm"><span class="ell">{f.name}</span></span></span>
        </button>
        {#if f.uses}<Uses uses={f.uses} name={f.name} />{/if}
        {#if editing}
          <span class="edit-tools">
            <button class="btn icon ghost" aria-pressed={open} aria-label="Edit {f.name}" onclick={() => toggleEditor(f.id)}><Icon name="pencil" size="sm" /></button>
            <button class="btn icon ghost" aria-label="Delete {f.name}" onclick={() => app.deleteItem(sheet, "feature", f.id)}><Icon name="trash" size="sm" /></button>
          </span>
        {:else}
          <span class="chev"><Icon name={open ? "chevronUp" : "chevronDown"} size="sm" /></span>
        {/if}
      </div>
      {#if open && !editing}<Details {sheet} title={f.name} desc={f.desc} />{/if}
    </div>
  {/each}
</div>
{#if editing}<button class="add-btn" onclick={() => app.addItem(sheet, "feature")}><Icon name="plus" size="sm" />Add feature</button>{/if}
