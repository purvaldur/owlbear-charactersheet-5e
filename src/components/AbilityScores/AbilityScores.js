import { computed } from 'vue'
import { useCharacterStore } from '@/stores/character'
import { rollCheck } from '@/utils/diceRoller'

export default {
  name: 'AbilityScores',
  setup() {
    const characterStore = useCharacterStore()

    const stats = computed(() => characterStore.stats)
    const editing = computed(() => characterStore.editing)

    const getModifierString = (stat) => {
      const modifier = characterStore.getModifier(stat)
      return modifier >= 0 ? `+${modifier}` : `${modifier}`
    }

    const updateStat = (stat) => {
      characterStore.updateStat(stat, stats.value[stat].value)
    }

    const toggleSaveProficiency = (stat) => {
      characterStore.toggleSaveProficiency(stat)
    }

    const rollAbilityCheck = (stat) => {
      const modifier = characterStore.getModifier(stat)
      rollCheck(modifier)
    }

    return {
      stats,
      editing,
      getModifierString,
      updateStat,
      toggleSaveProficiency,
      rollAbilityCheck
    }
  }
}