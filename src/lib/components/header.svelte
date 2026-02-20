<script>
  import { state } from '../stores/state.svelte.js'
  const character = $derived(state.character)
</script>

<header>
  <div>
    <h1 class=name>{character.meta.name.toUpperCase()}</h1>
  </div>
  <div class="subheader">
    <div class="hp">
      <span class="current">{character.meta.hp.current}</span>
      <span class="separator">/</span>
      <span class="max">{character.meta.hp.max}</span>
    </div>
    <span class="hp-temp">{character.meta.hp.temp}</span>
    <div class="ac">
      <span>AC {character.meta.armorClass}</span>
    </div>
    <div class="rollState">
      <button class="advantage">ADV</button>
      <button class="disadvantage">DISADV</button>
    </div>
  </div>
</header>

<style>
  @font-face {
    font-family: 'Cinzel Decorative';
    src: url('/fonts/Cinzel_Decorative/CinzelDecorative-Bold.ttf')
  }
  @font-face {
    font-family: 'Cinzel';
    src: url('/fonts/Cinzel/Cinzel-VariableFont_wght.ttf')
  }
  
  header h1.name {
    font-family: 'Cinzel Decorative', serif;
    font-weight: 400;
    margin-bottom: 18px;
  }

  .subheader {
    display: flex;
    align-items: center;
    font-family: 'Cinzel', serif;
    font-weight: 500;
    font-size: 1.4em;
  }

  .hp::before {
    content: 'HP';
    position: absolute;
    top: -0.55em;
    left: 0.4em;
    font-family: 'Cinzel', serif;
    font-size: 0.65em;
    letter-spacing: 0.15em;
    color: #c0392b;
    background: var(--iron-lt);
    padding: 0 0.2em;
  }

  .hp {
    display: flex;
    align-items: baseline;
    padding: 0.25em;
    position: relative;
    background: rgba(155,29,32,0.1);
    border: 1px solid rgba(155,29,32,0.35);
  }
  .hp .current {
    font-weight: 900;
  }
  .hp .separator {
    padding: 0px 8px;
  }
  .hp-temp {
    background: rgba(106,173,106,0.1);
    border: 1px solid rgba(106, 173, 106,0.35);
    border-left: none;
    padding: 0.25em;
    margin-right: 8px;
  }
  .ac {
    margin-right: 8px;
  }
</style>
