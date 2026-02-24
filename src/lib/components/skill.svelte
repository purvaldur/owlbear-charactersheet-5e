<script>
  import { state } from '../stores/state.svelte.js'

  const { skill, index } = $props()

  const stat = $derived(state.character.stats.find(s => s.name.short === skill.baseStat))
  const mod = $derived.by(() => {
    let total = state.getModifier(stat.value)
    if (skill.expertise)  total += state.character.meta.proficiencyBonus * 2
    else if (skill.proficiency) total += state.character.meta.proficiencyBonus
    return total
  })
  const modLabel = $derived((mod >= 0 ? '+' : '') + mod)

  function cycleProficiency() {
    const s = state.character.skills[index]
    if (!s.proficiency && !s.expertise) { s.proficiency = true; return }
    if (s.proficiency && !s.expertise)  { s.expertise = true;   return }
    s.proficiency = false; s.expertise = false
  }
</script>

<div class="stat-row" onclick={() => state.rollDice(skill.name, mod)}>
  <span class="stat-row-inner">
    <span
      class="prof-pip"
      class:proficient={skill.proficiency && !skill.expertise}
      class:expertise={skill.expertise}
      title={skill.expertise ? 'Expertise' : skill.proficiency ? 'Proficient' : 'No proficiency'}
      onclick={(e) => { e.stopPropagation(); cycleProficiency() }}
    >{skill.expertise ? '◆' : skill.proficiency ? '●' : ''}</span>
    <span class="stat-name">{skill.name}</span>
    <span class="stat-attr">{skill.baseStat}</span>
  </span>
  <span class="stat-val" class:neg={mod < 0}>{modLabel}</span>
</div>

<style>
  .stat-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.22em 0;
    border-bottom: 1px solid rgba(255,255,255,0.035);
    cursor: pointer; position: relative;
    transition: padding-left 0.14s;
  }
  .stat-row:last-child { border-bottom: none; }
  .stat-row::before {
    content: '▶'; font-size: 0.35em; color: var(--blood);
    opacity: 0; position: absolute; left: 0;
    transition: opacity 0.14s; top: 50%; transform: translateY(-50%);
  }
  .stat-row:hover { padding-left: 0.6em; }
  .stat-row:hover::before { opacity: 1; }

  .prof-pip {
    display: inline-block;
    width: 0.65em; height: 0.65em;
    line-height: 0.65em; text-align: center;
    font-size: 0.75em; margin-right: 0.3em;
    flex-shrink: 0; color: var(--ash);
    position: relative; top: 0.05em;
    cursor: pointer;
  }
  .prof-pip.proficient { color: var(--parchment); }
  .prof-pip.expertise  { color: #f0c060; }

  .stat-row-inner { display: flex; align-items: center; flex: 1; }
  .stat-name { font-family: 'Cinzel', serif; font-weight: 500; color: var(--bone); }
  .stat-attr { font-family: 'Cinzel', serif; color: var(--ash); margin-left: 0.25em; }
  .stat-val  { font-family: 'Cinzel', serif; font-weight: 600; color: var(--parchment); min-width: 1.8em; text-align: right; }
  .stat-val.neg { color: var(--blood-lt); }
</style>
