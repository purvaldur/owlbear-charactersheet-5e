<template>
  <div class="basic-info bg-white shadow rounded-lg p-4 mb-4" v-if="character">
    <h2 class="text-xl font-semibold mb-4">Basic Information</h2>
    <div class="grid grid-cols-2 gap-4">
      <div class="col-span-2 sm:col-span-1">
        <label class="block text-sm font-medium text-gray-700">Name</label>
        <input v-model="character.name" @input="updateCharacter" class="input w-full" />
      </div>
      <div class="col-span-2 sm:col-span-1">
        <label class="block text-sm font-medium text-gray-700">Class</label>
        <input v-model="character.class" @input="updateCharacter" class="input w-full" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Level</label>
        <input type="number" v-model.number="character.level" @input="updateCharacter" class="input w-full" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Race</label>
        <input v-model="character.race" @input="updateCharacter" class="input w-full" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Armor Class</label>
        <input type="number" v-model.number="character.armorClass" @input="updateCharacter" class="input w-full" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Initiative</label>
        <span class="inline-block w-full py-2 px-3 bg-gray-100 rounded">{{ getModifierString(character.getAbilityModifier('dexterity')) }}</span>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Current HP</label>
        <input type="number" v-model.number="character.hitPoints.current" @input="updateCharacter" class="input w-full" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Max HP</label>
        <input type="number" v-model.number="character.hitPoints.max" @input="updateCharacter" class="input w-full" />
      </div>
    </div>
  </div>
  <div v-else class="bg-white shadow rounded-lg p-4 mb-4 text-center">
    <p>No character data available</p>
  </div>
</template>

<script>
import { useCharacterStore } from '../../store/character'

export default {
  name: 'BasicInfo',
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