<template>
  <div class="dice-roller">
    <h2>Dice Roller</h2>
    <div>
      <input v-model="diceNotation" placeholder="Enter dice notation (e.g., 2d6+3)" />
      <button @click="roll">Roll</button>
    </div>
    <div v-if="result">
      <p>Result: {{ result.output }}</p>
    </div>
    <h3>Skill Check</h3>
    <div>
      <input v-model.number="modifier" type="number" placeholder="Modifier" />
      <label><input type="checkbox" v-model="advantage" /> Advantage</label>
      <label><input type="checkbox" v-model="disadvantage" /> Disadvantage</label>
      <button @click="rollCheck">Roll Check</button>
    </div>
    <div v-if="checkResult">
      <p>Check Result: {{ checkResult.output }}</p>
      <p v-if="checkResult.isSuccess">Critical Success!</p>
      <p v-if="checkResult.isCriticalFailure">Critical Failure!</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { rollDice, rollCheck } from '@/utils/diceRoller'

export default {
  name: 'DiceRoller',
  setup() {
    const diceNotation = ref('')
    const result = ref(null)
    const modifier = ref(0)
    const advantage = ref(false)
    const disadvantage = ref(false)
    const checkResult = ref(null)

    const roll = () => {
      result.value = rollDice(diceNotation.value)
    }

    const performRollCheck = () => {
      checkResult.value = rollCheck(modifier.value, advantage.value, disadvantage.value)
    }

    return {
      diceNotation,
      result,
      roll,
      modifier,
      advantage,
      disadvantage,
      checkResult,
      rollCheck: performRollCheck
    }
  }
}
</script>

<style scoped>
.dice-roller {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>