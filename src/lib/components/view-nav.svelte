<script>
  import { state } from '../stores/state.svelte.js'

  const tabs = ['main', 'spells', 'inventory', 'backstory', 'notes']
</script>

<div class="view-nav">
  {#each tabs as tab}
    <button
      class="view-tab"
      class:active={state.meta.activeTab === tab}
      onclick={() => state.meta.activeTab = tab}
    >{tab}</button>
  {/each}
</div>

<style>
  .view-nav {
    display: flex;
    background: var(--iron-lt);
    border-bottom: 1px solid var(--iron-edge);
    animation: fadeUp 0.4s 0.05s ease both;
  }
  .view-tab {
    flex: 1; padding: 0.6em 0;
    font-family: 'Cinzel', serif; font-size: 0.65em;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--ash); text-align: center; cursor: pointer;
    border-right: 1px solid var(--iron-edge);
    border-bottom: 2px solid transparent;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
    user-select: none;
    background: none;
    border-top: none; border-left: none;
  }
  .view-tab:last-child { border-right: none; }
  .view-tab:hover { color: var(--bone); background: rgba(255,255,255,0.02); }
  .view-tab.active {
    color: var(--parchment);
    border-bottom-color: var(--blood);
    background: rgba(155,29,32,0.08);
  }
</style>
