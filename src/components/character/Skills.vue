<template>
  <div class="skills bg-white shadow rounded-lg p-4 mb-4">
    <h2 class="text-xl font-semibold mb-4">Skills</h2>
    <div class="grid grid-cols-1 gap-2">
      <div v-for="skill in character.skills" :key="skill.name" class="skill flex items-center">
        <input
          type="checkbox"
          v-model="skill.proficient"
          @change="updateCharacter"
          class="mr-2"
        />
        <span class="skill-modifier w-8 text-center">
          {{ getModifierString(character.getSkillModifier(skill)) }}
        </span>
        <span class="skill-name flex-grow">
          {{ skill.name }}
          <span class="text-xs text-gray-500">({{ skill.ability.charAt(0).toUpperCase() }})</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { useCharacterStore } from '../../store/character'

export default {
  name: 'Skills',
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