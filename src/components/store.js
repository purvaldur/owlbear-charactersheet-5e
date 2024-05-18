import { nextTick, toRaw, reactive } from 'vue'
import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

export const socket = io("https://owlbear.vald.io/", {})
// export const socket = io("localhost:3000", {}) // for local development

export let store = reactive({
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
      const player = JSON.parse(localStorage.getItem('characters')).list[store.characters.active]
      console.log('player', player);
    },
    set() {
      store.player.advantage = false
      store.player.disadvantage = false
      store.characters.list[store.characters.active] = store.player
      localStorage.setItem('characters', JSON.stringify(store.characters))
      socket.emit('update', {
        id: store.meta.obr.user_id,
        characters: JSON.stringify(store.characters),
        name: store.meta.obr.user_name
      })
      store.meta.get()
    }
  }
})