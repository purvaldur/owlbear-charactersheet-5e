import { createApp } from 'vue'
import { createPinia } from 'pinia'
import OBR from '@owlbear-rodeo/sdk'
import App from './App.vue'
import './styles/main.css'

OBR.onReady(() => {
  const app = createApp(App)
  app.use(createPinia())
  app.mount('#app')

  // Set the width, height of the extension
  OBR.action.setWidth(500)
  OBR.action.setHeight(99999)
})