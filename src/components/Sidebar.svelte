<script lang="ts">
  // The table-rolls sidebar: opened only by the user, never by an arriving roll.
  import { app } from "../lib/app.svelte";
  import { parseNotation } from "../lib/dice/notation";
  import { IDENTITY_COLORS } from "../lib/model/defaults";
  import Icon from "./Icon.svelte";
  import RollCard from "./RollCard.svelte";

  const ui = app.ui;
  const entries = $derived(app.log.visible(app.player.role, app.player.id));
  const anim = ui.sidebarAnim;
  ui.sidebarAnim = false;
  let notation = $state("");
  let error = $state("");
  let logEl: HTMLDivElement | undefined = $state();
  let atEnd = true;

  // Stay pinned to the newest roll while the reader is at the end; someone scrolled up keeps their place.
  $effect.pre(() => {
    void entries.length;
    if (logEl) atEnd = logEl.scrollHeight - logEl.scrollTop - logEl.clientHeight < 12;
  });
  $effect(() => {
    void entries.length;
    void entries.map((e) => e.replies.length);
    if (logEl && atEnd) logEl.scrollTop = logEl.scrollHeight;
  });

  const roller = () => app.sheet ?? { id: "", name: app.player.name || "Someone", color: IDENTITY_COLORS[3]! };

  function roll(e: SubmitEvent) {
    e.preventDefault();
    const p = parseNotation(notation);
    if (!p) {
      error = "Use dice notation like 2d6+3 or d20-1.";
      return;
    }
    error = "";
    app.rollDice(roller(), p.n, p.d, p.flat);
    notation = "";
  }
</script>

<aside class="side" class:anim id="side" aria-label="Table rolls">
  <div class="side-h">
    <h2>Table rolls</h2>
    <span class="calc">{app.dice.name === "dice+" ? "Rolling with Dice+" : "Built-in dice"}</span>
    <button class="btn icon ghost" aria-label="Hide table rolls" onclick={() => (ui.sidebar = false)}><Icon name="x" /></button>
  </div>
  <div class="log" id="log" bind:this={logEl}>
    {#each entries as entry (entry.id)}<RollCard {entry} />{:else}<p class="log-empty">Rolls from everyone at the table show up here.</p>{/each}
  </div>
  <div class="vis-row">
    <span>Your rolls go to</span>
    <div class="seg" role="group" aria-label="Who sees your rolls">
      <button aria-pressed={ui.vis === "public"} onclick={() => (ui.vis = "public")}>Everyone</button>
      <button aria-pressed={ui.vis === "gm"} onclick={() => (ui.vis = "gm")}>{app.isGM ? "Only me" : "GM only"}</button>
    </div>
  </div>
  <div class="quick">
    {#each [4, 6, 8, 10, 12, 20, 100] as d (d)}
      <button class="btn" onclick={() => app.rollDice(roller(), 1, d)}>d{d}</button>
    {/each}
    <form onsubmit={roll}>
      <input class="in num" bind:value={notation} placeholder="2d6+3" aria-label="Dice notation" autocomplete="off" />
      <button class="btn primary" type="submit">Roll</button>
    </form>
    {#if error}<div class="quick-err" role="alert">{error}</div>{/if}
  </div>
</aside>
