import { defineStore } from 'pinia'

export const useCharacterStore = defineStore('character', {
  state: () => ({
    name: '',
    currentHP: 10,
    maxHP: 10,
    tempHP: 0,
    armorClass: 10,
    proficiency: 2,
    stats: [
      { name: 'str', fullName: 'Strength', value: 10, saveProficient: false },
      { name: 'dex', fullName: 'Dexterity', value: 10, saveProficient: false },
      { name: 'con', fullName: 'Constitution', value: 10, saveProficient: false },
      { name: 'int', fullName: 'Intelligence', value: 10, saveProficient: false },
      { name: 'wis', fullName: 'Wisdom', value: 10, saveProficient: false },
      { name: 'cha', fullName: 'Charisma', value: 10, saveProficient: false },
    ],
  }),
  getters: {
    getStatModifier: (state) => (statName) => {
      const stat = state.stats.find(s => s.name === statName)
      return Math.floor((stat.value - 10) / 2)
    },
  },
  actions: {
    updateStat(statName, newValue) {
      const stat = this.stats.find(s => s.name === statName)
      if (stat) {
        stat.value = newValue
      }
    },
    updateHP(newHP) {
      this.currentHP = Math.min(newHP, this.maxHP)
    },
    updateMaxHP(newMaxHP) {
      this.maxHP = newMaxHP
      this.currentHP = Math.min(this.currentHP, this.maxHP)
    },
  },
})