import { createApp } from 'vue'
import { createPinia } from 'pinia'
import OBR from '@owlbear-rodeo/sdk'
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars, ScrollbarsHidingPlugin, SizeObserverPlugin, ClickScrollPlugin } from 'overlayscrollbars';
import App from '@/App.vue'
import '@/style.css'
import { useDiceLogStore } from '@/stores/diceLog'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

OBR.onReady(() => {
  const diceLogStore = useDiceLogStore()

  OBR.broadcast.onMessage("io.vald.owlbear/diceroll", (roll) => {
    diceLogStore.receiveRoll(roll)
  })

  app.mount('#app')
  OverlayScrollbars(document.querySelector('.main'), {overflow: {x: 'hidden',}});
  OverlayScrollbars(document.querySelector('.dice-log'), {overflow: {x: 'hidden',}});
})