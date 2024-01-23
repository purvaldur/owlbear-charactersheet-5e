import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import OBR from '@owlbear-rodeo/sdk'

OBR.onReady(() => {
  createApp(App).mount('#app')
})

