import { defineStore } from 'pinia'

export const useCharacterStore = defineStore('character', {
  state: () => ({
    editing: false,
    name: 'Change Me',
    currentHP: 10,
    maxHP: 14,
    tempHP: 4,
    armorClass: 10,
    proficiency: 2,
    rollState: 'normal', // Can be 'normal', 'advantage', or 'disadvantage'
    stats: {
      str: { name: 'strength', value: 20, saveProficient: false },
      dex: { name: 'dexterity', value: 15, saveProficient: false },
      con: { name: 'constitution', value: 10, saveProficient: false },
      int: { name: 'intelligence', value: 13, saveProficient: false },
      wis: { name: 'wisdom', value: 10, saveProficient: false },
      cha: { name: 'charisma', value: 4, saveProficient: false }
    },
    skills: [
      { name: 'Acrobatics', ability: 'dex', proficient: false },
      { name: 'Animal Handling', ability: 'wis', proficient: false },
      { name: 'Arcana', ability: 'int', proficient: false },
      { name: 'Athletics', ability: 'str', proficient: false },
      { name: 'Deception', ability: 'cha', proficient: false },
      { name: 'History', ability: 'int', proficient: false },
      { name: 'Insight', ability: 'wis', proficient: false },
      { name: 'Intimidation', ability: 'cha', proficient: false },
      { name: 'Investigation', ability: 'int', proficient: false },
      { name: 'Medicine', ability: 'wis', proficient: false },
      { name: 'Nature', ability: 'int', proficient: false },
      { name: 'Perception', ability: 'wis', proficient: false },
      { name: 'Performance', ability: 'cha', proficient: false },
      { name: 'Persuasion', ability: 'cha', proficient: false },
      { name: 'Religion', ability: 'int', proficient: false },
      { name: 'Sleight of Hand', ability: 'dex', proficient: false },
      { name: 'Stealth', ability: 'dex', proficient: false },
      { name: 'Survival', ability: 'wis', proficient: false }
    ],
    actions: [
      {
        editing: false,
        name: 'Unarmed Strike',
        type: 'melee',
        toHit: {
          enabled: true,
          baseStat: 'str',
          proficient: true,
          flatBonus: null
        },
        diceEnabled: true,
        dice: [
          {
            count: 1,
            sides: 4,
            baseStat: 'str', // null if disabled
            flatBonus: 0,
            type: 'bludgeoning',
          }
        ],
        save: {
          enabled: true,
          baseStat: 'str',
          override: null,
          target: 'str',
        },
        description: 'A punch, kick, head-butt, or similar forceful blow.'
      }
    ],
    featuresTraits: [
      {
        editing: false,
        name: 'Languages',
        description: 'Your character knows the following languages:\n\n- Common',
        limited: false,
        uses: 0,
        usesMax: null,
      },
      {
        editing: false,
        name: 'Rage',
        description: 'In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action.',
        limited: true,
        uses: [],
        usesMax: 2,
      }
    ],
    spellcastingAbility: 'int', // Default to Intelligence
    spells: {
      0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []
    },
    spellSlots: {
      1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []
    },
    inventory: {
      money: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
      equipment: []
    },
    features: []
  }),
  getters: {
    getModifier: (state) => (stat) => {
      return Math.floor((state.stats[stat].value - 10) / 2)
    },
    getSavingThrow: (state) => (stat) => {
      const modifier = Math.floor((state.stats[stat].value - 10) / 2)
      return state.stats[stat].saveProficient ? modifier + state.proficiency : modifier
    }
  },
  actions: {
    updateCharacter(characterData) {
      Object.assign(this, characterData)
    },
    toggleEditing() {
      this.editing = !this.editing
    },
    updateStat(stat, value) {
      this.stats[stat].value = value
    },
    toggleSaveProficiency(stat) {
      this.stats[stat].saveProficient = !this.stats[stat].saveProficient
    },
    addSkill(skill) {
      this.skills.push(skill)
    },
    updateSkill(index, skill) {
      this.skills[index] = skill
    },
    removeSkill(index) {
      this.skills.splice(index, 1)
    },
    updateAction(index, action) {
      this.actions[index] = action
    },
    addAction(action) {
      this.actions.push(action)
    },
    removeAction(index) {
      this.actions.splice(index, 1)
    },
    updateFeatureTrait(index, feature) {
      this.featuresTraits[index] = feature
    },
    addFeatureTrait(feature) {
      this.featuresTraits.push(feature)
    },
    removeFeatureTrait(index) {
      this.featuresTraits.splice(index, 1)
    },
    updateSpellcastingAbility(ability) {
      this.spellcastingAbility = ability
    },
    updateSpell(level, index, spell) {
      this.spells[level][index] = spell
    },
    addSpell(level, spell) {
      this.spells[level].push(spell)
    },
    removeSpell(level, index) {
      this.spells[level].splice(index, 1)
    },
    setRollState(state) {
      if (['normal', 'advantage', 'disadvantage'].includes(state)) {
        this.rollState = state
      }
    },
  }
})