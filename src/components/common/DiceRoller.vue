<template>
  <div class="dice-roller bg-white shadow rounded-lg p-4 mb-4">
    <h2 class="text-xl font-semibold mb-4">Dice Roller</h2>
    <div class="dice-buttons grid grid-cols-3 gap-2 mb-4">
      <button
        v-for="dice in commonDice"
        :key="dice"
        @click="rollDice(dice)"
        class="btn"
      >
        {{ dice }}
      </button>
    </div>
    <div class="custom-roll flex mb-4">
      <input
        v-model="customDiceNotation"
        placeholder="e.g., 2d6+3"
        @keyup.enter="rollDice(customDiceNotation)"
        class="input flex-grow mr-2"
      />
      <button @click="rollDice(customDiceNotation)" class="btn">Roll</button>
    </div>
    <div v-if="lastRoll" class="roll-result bg-gray-100 p-3 rounded">
      <p class="font-bold">Rolled {{ lastRoll.notation }}: {{ lastRoll.total }}</p>
      <p class="text-sm">Details: {{ lastRoll.output }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { rollDice } from '../../utils/diceRoller'

export default {
  name: 'DiceRoller',
  setup() {
    const commonDice = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100']
    const customDiceNotation = ref('')
    const lastRoll = ref(null)

    const roll = (notation) => {
      try {
        lastRoll.value = rollDice(notation)
      } catch (error) {
        console.error(error)
        // You might want to show an error message to the user here
      }
    }

    return {
      commonDice,
      customDiceNotation,
      lastRoll,
      rollDice: roll
    }
  }
}
</script>