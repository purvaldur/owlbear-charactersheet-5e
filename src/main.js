import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import { useCharacterStore } from './store/character'
import './index.css'

const app = createApp(App)

app.use(router)
app.use(pinia)

const characterStore = useCharacterStore()
characterStore.initialize()
  .then(() => {
    app.mount('#app')
  })
  .catch(error => {
    console.error('Failed to initialize the application:', error)
    app.mount('#app')
  })
