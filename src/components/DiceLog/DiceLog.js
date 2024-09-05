import { computed } from 'vue'
import { useDiceLogStore } from '@/stores/diceLog'

export default {
  name: 'DiceLog',
  setup() {
    const diceLogStore = useDiceLogStore()

    const rolls = computed(() => diceLogStore.rolls)
    const isVisible = computed(() => diceLogStore.isVisible)

    const clearLog = () => {
      diceLogStore.clearLog()
    }

    return {
      rolls,
      isVisible,
      clearLog
    }
  }
}