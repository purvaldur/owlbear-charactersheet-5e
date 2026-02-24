<script>
  const { feature } = $props()
</script>

<div class="feature-row">
  <div class="feature-name">
    {feature.name}
    {#if feature.pips}
      <div class="pips">
        {#each Array(feature.pips.total) as _, i}
          <span class="pip" class:filled={i < feature.pips.used}></span>
        {/each}
      </div>
    {/if}
  </div>
  <div class="feature-desc">{feature.desc}</div>
</div>

<style>
  .feature-row {
    padding: 0.4em 0;
    border-bottom: 1px solid rgba(255,255,255,0.035);
  }
  .feature-row:last-child { border-bottom: none; }

  .feature-name {
    font-family: 'Cinzel', serif; font-weight: 600;
    color: var(--parchment); display: flex; justify-content: space-between; align-items: center;
  }
  .feature-desc {
    font-family: 'IM Fell English', Georgia, serif; font-style: italic;
    font-size: 0.78em; color: var(--ash); margin-top: 0.12em; line-height: 1.45;
  }
  .pips { display: flex; gap: 0.25em; }
  .pip  { width: 0.5em; height: 0.5em; border: 1px solid var(--blood); }
  .pip.filled { background: var(--blood); }
</style>
