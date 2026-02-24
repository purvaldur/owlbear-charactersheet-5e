<script>
  import { state } from '../stores/state.svelte.js'
  import Ability from './ability.svelte'

  const stats = $derived(state.character.stats)
</script>

<div class="ability-grid">
  {#each stats as stat}
    <Ability {stat} />
  {/each}
</div>

<style>
  .ability-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    background: var(--iron-lt);
    border-bottom: 1px solid var(--iron-edge);
    animation: fadeUp 0.4s 0.1s ease both;
  }
</style>
