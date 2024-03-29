import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import OBR from '@owlbear-rodeo/sdk'

OBR.onReady(() => {
  OBR.action.setWidth(500)
  OBR.action.setHeight(99999)
  createApp(App).mount('#app')
})
