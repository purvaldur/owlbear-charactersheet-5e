import { defineStore } from 'pinia'
import { Character } from '../models/Character'
import * as OBR from '../api/owlbear'

export const useCharacterStore = defineStore('character', {
  state: () => ({
    characters: {},
    activeCharacterId: null,
    playerId: null,
    isInitialized: false
  }),
  getters: {
    activeCharacter: (state) => state.characters[state.activeCharacterId],
    playerCharacter: (state) => Object.values(state.characters).find(char => char.playerId === state.playerId)
  },
  actions: {
    async initialize() {
      if (this.isInitialized) return

      try {
        await OBR.initializeOBR()
        this.playerId = await OBR.getPlayerId()
        const charactersData = await OBR.getCharacters()
        this.characters = Object.fromEntries(
          Object.entries(charactersData).map(([id, data]) => [id, Character.fromPlainObject(data)])
        )
        await OBR.onCharacterUpdate(this.setCharacters)
        this.isInitialized = true
      } catch (error) {
        console.error('Failed to initialize character store:', error)
        throw error
      }
    },
    setCharacters(charactersData) {
      this.characters = Object.fromEntries(
        Object.entries(charactersData).map(([id, data]) => [id, Character.fromPlainObject(data)])
      )
    },
    async addCharacter(characterData) {
      const character = new Character(characterData)
      character.playerId = this.playerId
      await OBR.updateCharacter(character)
      this.characters[character.id] = character
    },
    setActiveCharacter(characterId) {
      this.activeCharacterId = characterId
    },
    async updateCharacter(updatedCharacter) {
      await OBR.updateCharacter(updatedCharacter)
      this.characters[updatedCharacter.id] = updatedCharacter
    }
  }
})