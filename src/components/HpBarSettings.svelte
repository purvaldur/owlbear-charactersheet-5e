<script lang="ts">
  // The GM's choice of what token HP bars show: what the GM sees on players' tokens, and what players see on each
  // other's tokens and on the GM's. Owners always see their own exactly, so the GM's own tokens need no setting.
  import { app } from "../lib/app.svelte";
  import { BAR_MODES, BAR_STEPS, type BarMode, type BarSettings, type BarStep } from "../lib/tokens/link";
  import TokenBar from "./TokenBar.svelte";

  type Row = { aud: "gm" | "players"; owner: "player" | "gm"; label: string; aria: string };
  const SECTIONS: { title: string; rows: Row[] }[] = [
    { title: "GM", rows: [{ aud: "gm", owner: "player", label: "Players' tokens", aria: "What the GM sees on players' tokens" }] },
    {
      title: "Players",
      rows: [
        { aud: "players", owner: "player", label: "Other players' tokens", aria: "What players see on each other's tokens" },
        { aud: "players", owner: "gm", label: "GM's tokens", aria: "What players see on the GM's tokens" },
      ],
    },
  ];
  /** A token a little under half health, so steps visibly round up. */
  const SAMPLE = { cur: 17, max: 38, temp: 0 };

  const modeOf = (r: Row): BarMode => (r.aud === "gm" ? app.bars.gm.player : app.bars.players[r.owner]);
  const usesSteps = $derived(app.bars.gm.player === "steps" || app.bars.players.player === "steps" || app.bars.players.gm === "steps");

  function choose(r: Row, mode: BarMode) {
    const b: BarSettings = $state.snapshot(app.bars);
    if (r.aud === "gm") b.gm.player = mode;
    else b.players[r.owner] = mode;
    app.setBars(b);
  }
  const chooseStep = (step: BarStep) => app.setBars({ ...$state.snapshot(app.bars), step });
</script>

<h3>Token HP bars</h3>
<p class="hint">What the GM and players see on tokens they don't own. Owners always see their own token's exact HP.</p>
{#each SECTIONS as sec (sec.title)}
  <div class="bars-aud">
    <div class="menu-h">{sec.title}</div>
    {#each sec.rows as r (r.label)}
      <div class="bars-row">
        <span class="bars-lbl">{r.label}<TokenBar hp={SAMPLE} mode={modeOf(r)} step={app.bars.step} /></span>
        <div class="seg" role="group" aria-label={r.aria}>
          {#each BAR_MODES as [mode, label] (mode)}
            <button aria-pressed={modeOf(r) === mode} onclick={() => choose(r, mode)}>{label}</button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
{/each}
{#if usesSteps}
  <div class="bars-aud">
    <div class="menu-h">Steps</div>
    <div class="bars-row">
      <span class="bars-lbl">Round up to</span>
      <div class="seg" role="group" aria-label="Step size for bars in steps mode">
        {#each BAR_STEPS as step (step)}
          <button aria-pressed={app.bars.step === step} onclick={() => chooseStep(step)}>{step}%</button>
        {/each}
      </div>
    </div>
  </div>
{/if}
