<script>
  import { state } from '../stores/state.svelte.js'

  const { skill, index } = $props()

  const stat = $derived(state.character.stats.find(stat => stat.name.short === skill.baseStat))
  const modifier = $derived(() => {
    let total = state.getModifier(stat.value)
    if (skill.proficiency) total += state.character.meta.proficiencyBonus
    if (skill.expertise) total += state.character.meta.proficiencyBonus
    return total
  })

  function changeProficiency() {
    const s = state.character.skills[index]
    if (!skill.proficiency && !skill.expertise) { s.proficiency = true; return }
    if (skill.proficiency && !skill.expertise) { s.expertise = true; return }
    if (skill.proficiency && skill.expertise) { s.proficiency = false; s.expertise = false; return }
  }
</script>

<div>
  <span onclick={changeProficiency}>{skill.expertise ? "◆" : skill.proficiency ? "●" : "○"}</span>
  <span>{skill.name}</span>
  <span>{modifier() >= 0 ? '+' : ''}{modifier()}</span>
</div>

