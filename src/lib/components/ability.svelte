<script>
  import { state } from '../stores/state.svelte.js'

  const { stat } = $props()

  const mod  = $derived(state.getModifier(stat.value))
  const prof = $derived(state.character.meta.proficiencyBonus)
  const saveMod = $derived(stat.saveProficient ? mod + prof : mod)
  const modLabel = $derived((mod >= 0 ? '+' : '') + mod)
  const saveLabel = $derived((saveMod >= 0 ? '+' : '') + saveMod)
</script>

<div class="ability">
  <div class="ability-label">{stat.name.short}</div>
  <div
    class="ability-mod"
    class:negative={mod < 0}
    onclick={() => state.rollDice(stat.name.short.toUpperCase(), mod)}
  >{modLabel}</div>
  <div class="ability-score">{stat.value}</div>
  {#if stat.saveProficient}
    <div
      class="ability-save"
      onclick={() => state.rollDice(stat.name.short.toUpperCase() + ' Save', saveMod)}
      title="{stat.name.full} Saving Throw"
    >
      <span class="save-icon">⛨</span>{saveLabel}
    </div>
  {/if}
</div>

<style>
  .ability {
    display: flex; flex-direction: column; align-items: center;
    padding: 0.75em 0 0.6em;
    border-right: 1px solid var(--iron-mid);
  }
  .ability:last-child { border-right: none; }

  .ability-label {
    font-family: 'Cinzel', serif; font-size: 0.6em;
    letter-spacing: 0.2em; color: var(--ash);
    text-transform: uppercase; margin-bottom: 0.3em;
  }
  .ability-mod {
    font-family: 'Cinzel', serif; font-size: 1.35em;
    font-weight: 900; color: var(--parchment); line-height: 1;
    cursor: pointer; padding: 0.05em 0.15em;
    transition: color 0.15s;
  }
  .ability-mod:hover { color: #fff; }
  .ability-mod.negative { color: var(--blood-lt); }
  .ability-mod.negative:hover { color: #e05555; }

  .ability-score {
    font-family: 'IM Fell English', Georgia, serif; font-size: 0.85em;
    color: var(--ash); margin-top: 0.12em;
  }
  .ability-save {
    display: flex; align-items: center; gap: 0.12em;
    margin-top: 0.3em; padding-top: 0.22em;
    border-top: 1px solid rgba(255,255,255,0.07);
    font-family: 'Cinzel', serif; font-size: 0.65em;
    color: var(--parch-dk); cursor: pointer;
    transition: color 0.15s;
  }
  .ability-save:hover { color: var(--parchment); }
  .save-icon { font-size: 0.85em; }
</style>
