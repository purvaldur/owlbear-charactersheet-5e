import { defineStore } from 'pinia'
import OBR from '@owlbear-rodeo/sdk'

export const useDiceLogStore = defineStore('diceLog', {
  state: () => ({
    rolls: [],
    isVisible: false,
  }),
  actions: {
    addRoll(roll) {
      this.rolls.unshift(roll)
      this.broadcastRoll(roll)
    },
    clearLog() {
      this.rolls = []
    },
    toggleVisibility() {
      this.isVisible = !this.isVisible
    },
    broadcastRoll(roll) {
      OBR.broadcast.sendMessage("io.vald.owlbear/diceroll", roll)
    },
    receiveRoll(roll) {
      this.rolls.unshift(roll)
    }
  },
})