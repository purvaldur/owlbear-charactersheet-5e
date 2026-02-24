<script>
  import { onMount } from 'svelte'
  import { state, initDicePlus } from './lib/stores/state.svelte.js'

  import Header      from './lib/components/header.svelte'
  import ViewNav     from './lib/components/view-nav.svelte'
  import AbilityGrid from './lib/components/ability-grid.svelte'
  import DiceLog     from './lib/components/dice-log.svelte'
  import MainView    from './lib/components/views/main-view.svelte'

  const toast     = $derived(state.meta.toast)
  const activeTab = $derived(state.meta.activeTab)

  onMount(() => {
    initDicePlus();

    OBR.onReady(async () => {
      const [vw, vh] = await Promise.all([
        OBR.viewport.getWidth(),
        OBR.viewport.getHeight(),
      ]);

      // Scale popover to ~24% of viewport width.
      // 1080p (~1700px) → 460px / 18px
      // 1440p (~2200px) → 528px / 20px
      // 4K   (~3400px) → 680px / 24px
      const width  = Math.min(Math.max(Math.round(vw * 0.24), 460), 680);
      const height = Math.min(Math.round(vh * 0.92), 1100);

      await Promise.all([
        OBR.action.setWidth(width),
        OBR.action.setHeight(height),
      ]);

      // 1px of font per 26px of popover width, clamped [16, 24].
      const fontSize = Math.min(Math.max(Math.round(width / 26), 16), 24);
      document.documentElement.style.fontSize = `${fontSize}px`;
    });
  })
</script>

<!-- Toast (fixed, outside sheet) -->
<div class="roll-toast" class:show={!!toast}>
  {#if toast}
    <span class="toast-label">{toast.label}</span>
    <span
      class="roll-num"
      style:color={toast.die === 20 ? '#6adf6a' : toast.die === 1 ? '#c0392b' : ''}
    >{toast.total}</span>
  {/if}
</div>

<div class="sheet">
  <Header />
  <ViewNav />
  <AbilityGrid />

  <!-- Views -->
  {#if activeTab === 'main'}
    <div class="view active">
      <MainView />
    </div>
  {:else if activeTab === 'spells'}
    <div class="view active">
      <div class="view-stub">
        <span class="stub-glyph">✦</span>
        <div class="stub-label">No spells configured</div>
      </div>
    </div>
  {:else if activeTab === 'inventory'}
    <div class="view active">
      <div class="view-stub">
        <span class="stub-glyph">⚖</span>
        <div class="stub-label">Inventory empty</div>
      </div>
    </div>
  {:else if activeTab === 'backstory'}
    <div class="view active">
      <div class="view-stub">
        <span class="stub-glyph">✦</span>
        <div class="stub-label">No backstory written</div>
      </div>
    </div>
  {:else if activeTab === 'notes'}
    <div class="view active">
      <div class="view-stub">
        <span class="stub-glyph">✦</span>
        <div class="stub-label">No notes yet</div>
      </div>
    </div>
  {/if}

  <DiceLog />
</div>

<style>
  .view.active { animation: fadeUp 0.3s ease both; }

  .view-stub {
    padding: 3em 1.5em;
    text-align: center;
    border-bottom: 1px solid var(--iron-edge);
  }
  .stub-glyph {
    font-family: 'Cinzel Decorative', serif;
    font-size: 3em; color: var(--rune); opacity: 0.35;
    display: block; margin-bottom: 0.3em;
  }
  .stub-label {
    font-family: 'Cinzel', serif; font-size: 0.85em;
    letter-spacing: 0.25em; color: var(--ash); text-transform: uppercase;
  }

  .toast-label { display: block; }
</style>
