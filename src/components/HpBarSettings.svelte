<script lang="ts">
  // The GM's choice of what token HP bars show: per audience (the GM, the players) and per token kind.
  import { app } from "../lib/app.svelte";
  import { BAR_MODES, type BarMode, type BarSettings } from "../lib/tokens/link";
  import type { SheetKind } from "../lib/model/types";
  import TokenBar from "./TokenBar.svelte";

  const AUDIENCES: [keyof BarSettings, string][] = [
    ["gm", "You"],
    ["players", "Players"],
  ];
  const KINDS: [SheetKind, string][] = [
    ["character", "Characters"],
    ["creature", "Creatures"],
  ];
  /** A token a little under half health, so steps visibly round up. */
  const SAMPLE = { cur: 17, max: 38, temp: 0 };

  function choose(aud: keyof BarSettings, kind: SheetKind, mode: BarMode) {
    app.setBars({ ...app.bars, [aud]: { ...app.bars[aud], [kind]: mode } });
  }
</script>

<h3>Token HP bars</h3>
<p class="hint">What you and the players see on tokens they don't own. Owners always see their own token's exact HP.</p>
{#each AUDIENCES as [aud, audLabel] (aud)}
  <div class="bars-aud">
    <div class="menu-h">{audLabel}</div>
    {#each KINDS as [kind, kindLabel] (kind)}
      <div class="bars-row">
        <span class="bars-lbl">{kindLabel}<TokenBar hp={SAMPLE} mode={app.bars[aud][kind]} /></span>
        <div class="seg" role="group" aria-label="{audLabel === 'You' ? 'What you see' : 'What players see'} on {kindLabel.toLowerCase()}">
          {#each BAR_MODES as [mode, label] (mode)}
            <button aria-pressed={app.bars[aud][kind] === mode} onclick={() => choose(aud, kind, mode)}>{label}</button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
{/each}
