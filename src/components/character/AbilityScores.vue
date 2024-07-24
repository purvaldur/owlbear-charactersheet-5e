<template>
  <div class="ability-scores bg-white shadow rounded-lg p-4 mb-4">
    <h2 class="text-xl font-semibold mb-4">Ability Scores</h2>
    <div class="grid grid-cols-3 gap-4">
      <div v-for="(score, ability) in character.abilityScores" :key="ability" class="ability-score text-center">
        <label class="block text-sm font-medium text-gray-700 uppercase">{{ ability }}</label>
        <input
          type="number"
          v-model.number="character.abilityScores[ability]"
          @input="updateCharacter"
          class="input w-full text-center font-bold text-lg"
        />
        <span class="modifier text-sm">
          {{ getModifierString(character.getAbilityModifier(ability)) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { useCharacterStore } from '../../store/character'

export default {
  name: 'AbilityScores',
  props: {
    character: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const characterStore = useCharacterStore()

    const updateCharacter = () => {
      characterStore.updateCharacter(props.character)
    }

    const getModifierString = (modifier) => {
      return modifier >= 0 ? `+${modifier}` : `${modifier}`
    }

    return {
      updateCharacter,
      getModifierString
    }
  }
}
</script>