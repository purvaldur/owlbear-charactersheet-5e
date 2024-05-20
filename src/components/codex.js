import { nextTick, toRaw, reactive } from 'vue'
import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

// export const socket = io("https://owlbear.vald.io/", {})
export const socket = io("localhost:3000", {}) // for local development

export let codex = reactive({
  player: {
    tabs: {}
  },
  characters: {
    active: 0,
    list: []
  },

  meta: {
    obr: {
      user_id: null,
      room_id: null,
      user_name: null,
      isGM: null
    },
    get() {
      // not used anymore - keeping around for future ideas
    },
    set() {
      // uses codex.stuff instead of this.stuff because 'this' refers to 'codex.meta'
      codex.player.advantage = false
      codex.player.disadvantage = false
      codex.characters.list[codex.characters.active] = codex.player
      localStorage.setItem('characters', JSON.stringify(codex.characters))
      socket.emit('update', {
        id: codex.meta.obr.user_id,
        characters: JSON.stringify(codex.characters),
        name: codex.meta.obr.user_name
      })
    }
  }
})