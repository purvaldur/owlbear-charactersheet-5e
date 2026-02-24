<script>
  import { state } from '../../stores/state.svelte.js'
  import Skill   from '../skill.svelte'
  import Action  from '../action.svelte'
  import Feature from '../feature.svelte'

  const character = $derived(state.character)
</script>

<div class="main-grid">

  <!-- LEFT: Skills -->
  <div class="section">
    <div class="section-title">Skills <span>d20+mod</span></div>
    {#each character.skills as skill, index}
      <Skill {skill} {index} />
    {/each}
  </div>

  <!-- RIGHT: Actions + Features stacked -->
  <div class="right-col">

    <div class="section no-right">
      <div class="section-title">Actions <span>click to roll</span></div>
      {#each character.actions as action}
        <Action {action} />
      {/each}
    </div>

    <div class="section no-right no-bottom">
      <div class="section-title">Features &amp; Traits</div>
      {#each character.features as feature}
        <Feature {feature} />
      {/each}
    </div>

  </div>
</div>

<style>
  .main-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .section {
    padding: 0.7em 0.85em 0.6em;
    border-right: 1px solid var(--iron-edge);
    border-bottom: 1px solid var(--iron-edge);
  }
  .section.no-right  { border-right: none; }
  .section.no-bottom { border-bottom: none; }

  .right-col {
    border-bottom: 1px solid var(--iron-edge);
  }

  .section-title {
    font-family: 'Cinzel', serif; font-size: 0.65em; font-weight: 600;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--blood-lt);
    border-bottom: 1px solid var(--iron-mid);
    padding-bottom: 0.4em; margin-bottom: 0.5em;
    display: flex; justify-content: space-between; align-items: baseline;
  }
  .section-title span { font-size: 0.85em; color: var(--ash); letter-spacing: 0.1em; font-weight: 400; }
</style>
