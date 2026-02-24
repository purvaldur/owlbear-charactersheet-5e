<script>
  import { state } from '../stores/state.svelte.js'
  const character = $derived(state.character)
</script>

<div class="header">
  <span class="corner tl">✦</span>
  <span class="corner tr">✦</span>
  <div class="char-name">{character.meta.name}</div>
  <div class="char-sub">
    {character.meta.class} · Level {character.meta.level} · {character.meta.race}
  </div>
  <div class="vitals-row">
    <div class="hp-block">
      <span class="hp-current">{character.meta.hp.current}</span>
      <span class="hp-sep">/</span>
      <span class="hp-max">{character.meta.hp.max}</span>
    </div>
    <div class="badge">AC {character.meta.armorClass}</div>
    <button
      class="badge adv"
      class:active={state.meta.rollState === 'advantage'}
      onclick={() => state.toggleRollState('advantage')}
    >ADV</button>
    <button
      class="badge dis"
      class:active={state.meta.rollState === 'disadvantage'}
      onclick={() => state.toggleRollState('disadvantage')}
    >DISADV</button>
  </div>
</div>

<style>
  .header {
    background: var(--iron-lt);
    border-bottom: 2px solid var(--blood);
    padding: 1.1em 1.2em 0.9em;
    position: relative;
    animation: fadeUp 0.4s ease both;
  }
  .corner {
    position: absolute;
    font-size: 0.9em; color: var(--rune); opacity: 0.45;
    font-family: 'Cinzel Decorative', serif;
  }
  .corner.tl { top: 0.45em; left: 0.65em; }
  .corner.tr { top: 0.45em; right: 0.65em; }

  .char-name {
    font-family: 'Cinzel Decorative', serif;
    font-size: 2.25em; font-weight: 700; color: var(--parchment); line-height: 1;
    text-transform: uppercase;
    text-shadow: 0 0.08em 1em rgba(155,29,32,0.3);
  }
  .char-sub {
    font-family: 'Cinzel', serif; font-size: 0.65em;
    letter-spacing: 0.28em; color: var(--ash);
    text-transform: uppercase; margin-top: 0.45em;
  }
  .vitals-row {
    display: flex; align-items: center;
    gap: 0.5em; margin-top: 0.75em; flex-wrap: wrap;
  }
  .hp-block {
    display: flex; align-items: baseline;
    background: rgba(155,29,32,0.1);
    border: 1px solid rgba(155,29,32,0.35);
    padding: 0.25em 0.65em; position: relative;
  }
  .hp-block::before {
    content: 'HP';
    position: absolute; top: -0.55em; left: 0.4em;
    font-family: 'Cinzel', serif; font-size: 0.65em;
    letter-spacing: 0.15em; color: var(--blood-lt);
    background: var(--iron-lt); padding: 0 0.2em;
  }
  .hp-current { font-family: 'Cinzel', serif; font-size: 1.4em; font-weight: 900; color: var(--parchment); }
  .hp-sep     { color: var(--blood); font-size: 0.9em; margin: 0 0.1em; font-family: 'Cinzel', serif; }
  .hp-max     { font-family: 'Cinzel', serif; font-size: 0.85em; color: var(--ash); }

  .badge {
    border: 1px solid var(--iron-edge);
    padding: 0.22em 0.6em;
    font-family: 'Cinzel', serif; font-size: 0.85em;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--ash); cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    background: none;
  }
  .badge:hover { border-color: var(--blood); color: var(--parchment); }
  .badge.adv  { color: #6aad6a; border-color: #3a5e3a; }
  .badge.adv.active { background: rgba(106,173,106,0.15); border-color: #6aad6a; color: #8fd48f; }
  .badge.dis  { color: #ad6a6a; border-color: #5e3a3a; }
  .badge.dis.active { background: rgba(173,106,106,0.15); border-color: #ad6a6a; color: #d48f8f; }
</style>
