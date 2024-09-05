<template>
  <div class="main" :class="{logToggled: logToggled}">
    <CharacterHeader />
    <AbilityScores />
    <div class="skills-actions-features">
      <Skills />
      <Saves />
      <Actions />
      <Features />
    </div>
  </div>
  <DiceLog />
  <!-- <Spells /> -->
  <!-- <Inventory /> -->
</template>

<script>
import { computed } from 'vue'

import { useDiceLogStore } from '@/stores/diceLog'
import CharacterHeader from './components/CharacterHeader/CharacterHeader.vue'
import AbilityScores from './components/AbilityScores/AbilityScores.vue'
import Skills from './components/Skills/Skills.vue'
import Saves from './components/Saves/Saves.vue'
import Actions from './components/Actions/Actions.vue'
import Spells from './components/Spells/Spells.vue'
// import Inventory from './components/Inventory/Inventory.vue'
import Features from './components/Features/Features.vue'
import DiceLog from './components/DiceLog/DiceLog.vue'

export default {
  name: 'App',
  components: {
    CharacterHeader,
    AbilityScores,
    Skills,
    Saves,
    Actions,
    Spells,
    // Inventory,
    Features,
    DiceLog
  },
  setup() {
    const diceLogStore = useDiceLogStore()
    const logToggled = computed(() => diceLogStore.isVisible)
    return { logToggled }
  }
}
</script>
