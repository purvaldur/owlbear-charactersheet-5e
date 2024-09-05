import { computed } from 'vue'
import { useCharacterStore } from '@/stores/character'
import { useDiceLogStore } from '@/stores/diceLog'
import OBR from '@owlbear-rodeo/sdk'

export default {
  name: 'CharacterHeader',
  setup() {
    const characterStore = useCharacterStore()
    const diceLogStore = useDiceLogStore()

    const character = computed(() => characterStore)
    const editing = computed(() => characterStore.editing)
    const rollState = computed(() => characterStore.rollState)
    const diceLogVisible = computed(() => diceLogStore.isVisible)

    const toggleEditing = () => {
      characterStore.toggleEditing()
    }

    const updateCharacter = () => {
      characterStore.updateCharacter({
        name: characterStore.name,
        currentHP: characterStore.currentHP,
        maxHP: characterStore.maxHP,
        tempHP: characterStore.tempHP,
        armorClass: characterStore.armorClass
      })
    }

    const toggleRollState = (state) => {
      if (characterStore.rollState === state) {
        characterStore.setRollState('normal')
      } else {
        characterStore.setRollState(state)
      }
    }

    const toggleDiceLog = () => {
      diceLogStore.toggleVisibility()
      OBR.action.setWidth(diceLogStore.isVisible ? 800 : 550)
    }

    return {
      character,
      editing,
      rollState,
      diceLogVisible,
      toggleEditing,
      updateCharacter,
      toggleRollState,
      toggleDiceLog,
    }
  }
}