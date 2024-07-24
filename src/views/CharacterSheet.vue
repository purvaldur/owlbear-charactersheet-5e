<template>
  <div class="character-sheet bg-gray-100 min-h-screen p-4">
    <div v-if="playerCharacter" class="max-w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="bg-primary text-white p-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold">{{ playerCharacter.name }}</h1>
        <div class="text-sm">
          <span class="mr-2">Level {{ playerCharacter.level }}</span>
          <span>{{ playerCharacter.class }}</span>
        </div>
      </div>
      <div class="p-4 grid grid-cols-12 gap-4">
        <div class="col-span-8">
          <BasicInfo :character="playerCharacter" />
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-1">
              <AbilityScores :character="playerCharacter" />
            </div>
            <div class="col-span-1">
              <Skills :character="playerCharacter" />
            </div>
          </div>
        </div>
        <div class="col-span-4">
          <DiceRoller />
          <!-- Add more sections here in the future, like inventory or spells -->
        </div>
      </div>
    </div>
    <div v-else class="max-w-full mx-auto bg-white shadow-lg rounded-lg p-4 text-center">
      <p class="text-lg mb-4">No character found for this player</p>
      <button @click="createNewCharacter" class="btn">Create New Character</button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useCharacterStore } from '../store/character'
import { Character } from '../models/Character'
import BasicInfo from '../components/character/BasicInfo.vue'
import AbilityScores from '../components/character/AbilityScores.vue'
import Skills from '../components/character/Skills.vue'
import DiceRoller from '../components/common/DiceRoller.vue'

export default {
  name: 'CharacterSheet',
  components: {
    BasicInfo,
    AbilityScores,
    Skills,
    DiceRoller
  },
  setup() {
    const characterStore = useCharacterStore()

    const playerCharacter = computed(() => characterStore.playerCharacter)

    const createNewCharacter = () => {
      const newCharacter = new Character()
      characterStore.addCharacter(newCharacter)
    }

    return {
      playerCharacter,
      createNewCharacter
    }
  }
}
</script>