<script>
  import { state } from '../stores/state.svelte.js'

  const history = $derived(state.meta.rollHistory)
</script>

<div class="dice-log-strip">
  ⚄ &nbsp;Dice Log
  <div class="log-rolls">
    {#if history.length === 0}
      <span class="log-empty">No rolls yet this session</span>
    {:else}
      {#each history as entry}
        <span>{entry.name}: <strong>{entry.total}</strong></span>
      {/each}
    {/if}
  </div>
</div>

<style>
  .dice-log-strip {
    background: var(--iron-lt);
    border-top: 2px solid var(--blood);
    padding: 0.5em 1em;
    font-family: 'Cinzel', serif; font-size: 0.65em;
    letter-spacing: 0.15em; color: var(--ash); text-align: center;
    animation: fadeUp 0.4s 0.15s ease both;
  }
  .log-rolls {
    display: flex; justify-content: center; flex-wrap: wrap;
    gap: 0.5em 1em; margin-top: 0.35em;
    font-family: 'IM Fell English', Georgia, serif; font-size: 1.2em; font-style: italic;
    color: var(--ash);
  }
  .log-rolls :global(strong) { color: var(--parchment); }
  .log-empty { font-size: 0.9em; }
</style>
