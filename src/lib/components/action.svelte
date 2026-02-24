<script>
  import { state } from '../stores/state.svelte.js'

  const { action } = $props()

  const bonusLabel = $derived((action.attackBonus >= 0 ? '+' : '') + action.attackBonus)
</script>

<div class="action-row" onclick={() => state.rollDice(action.name, action.attackBonus)}>
  <div class="action-name">
    {action.name}
    {#if action.thrown}<em class="action-thrown"> thrown</em>{/if}
    <span class="action-bonus">{bonusLabel}</span>
  </div>
  <div class="action-desc">{action.damage} · {action.desc}</div>
</div>

<style>
  .action-row {
    padding: 0.4em 0;
    border-bottom: 1px solid rgba(255,255,255,0.035);
    cursor: pointer; position: relative;
    transition: padding-left 0.14s;
  }
  .action-row:last-child { border-bottom: none; }
  .action-row::before {
    content: '⚔'; font-size: 0.42em; color: var(--blood);
    opacity: 0; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
    transition: opacity 0.14s;
  }
  .action-row:hover { padding-left: 0.8em; }
  .action-row:hover::before { opacity: 1; }

  .action-name {
    font-family: 'Cinzel', serif; font-weight: 600;
    color: var(--parchment); display: flex; justify-content: space-between;
  }
  .action-thrown { font-size: 0.8em; color: var(--ash); font-weight: 400; font-style: italic; }
  .action-bonus { color: var(--blood-lt); }
  .action-desc  { font-family: 'IM Fell English', Georgia, serif; font-style: italic; font-size: 0.78em; color: var(--ash); margin-top: 0.1em; }
</style>
