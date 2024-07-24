import { createRouter, createWebHashHistory } from 'vue-router'
import CharacterSheet from '../views/CharacterSheet.vue'

const routes = [
  {
    path: '/',
    name: 'CharacterSheet',
    component: CharacterSheet
  },
  // {
  //   path: '/spellbook',
  //   name: 'Spellbook',
  //   component: () => import('../views/Spellbook.vue')
  // },
  // {
  //   path: '/settings',
  //   name: 'Settings',
  //   component: () => import('../views/Settings.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
