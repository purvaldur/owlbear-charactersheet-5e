<template>
  <div class="character-info">
    <input v-model="name" @input="updateName" placeholder="Character Name" />
    <div class="hp-container">
      <input v-model.number="currentHP" @input="updateCurrentHP" type="number" />
      <span>/</span>
      <input v-model.number="maxHP" @input="updateMaxHP" type="number" />
    </div>
    <div class="stats-container">
      <div v-for="stat in stats" :key="stat.name" class="stat">
        <label>{{ stat.fullName }}</label>
        <input v-model.number="stat.value" @input="updateStat(stat.name, stat.value)" type="number" />
        <span>{{ getModifier(stat.name) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { useCharacterStore } from '../stores/characterStore'
import { computed } from 'vue'

export default {
  name: 'CharacterInfo',
  setup() {
    const characterStore = useCharacterStore()

    return {
      name: computed({
        get: () => characterStore.name,
        set: (value) => characterStore.name = value,
      }),
      currentHP: computed({
        get: () => characterStore.currentHP,
        set: (value) => characterStore.updateHP(value),
      }),
      maxHP: computed({
        get: () => characterStore.maxHP,
        set: (value) => characterStore.updateMaxHP(value),
      }),
      stats: computed(() => characterStore.stats),
      updateName: (event) => characterStore.name = event.target.value,
      updateCurrentHP: (event) => characterStore.updateHP(parseInt(event.target.value)),
      updateMaxHP: (event) => characterStore.updateMaxHP(parseInt(event.target.value)),
      updateStat: characterStore.updateStat,
      getModifier: characterStore.getStatModifier,
    }
  },
}
</script>

<style scoped>
.character-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.hp-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>