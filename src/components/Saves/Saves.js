import { computed } from 'vue'
import OBR from '@owlbear-rodeo/sdk';
import { useCharacterStore } from '@/stores/character'
import { rollCheck } from '@/utils/diceRoller'

export default {
  name: 'Saves',
  setup() {
    const characterStore = useCharacterStore()

    const stats = computed(() => characterStore.stats)
    const editing = computed(() => characterStore.editing)

    const getSaveModifier = (stat) => {
      const abilityModifier = characterStore.getModifier(stat)
      const proficiencyBonus = stat.saveProficient ? characterStore.proficiency : 0
      const modifier = abilityModifier + proficiencyBonus
      return modifier >= 0 ? `+${modifier}` : `${modifier}`
    }

    return {
      stats,
      editing,
      getSaveModifier
    }
  }
}