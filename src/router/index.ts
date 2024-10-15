import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import AdminPanel from '../views/AdminPanel.vue'
import IDVerification from '../views/IDVerification.vue'
import ClientPanel from '../views/ClientPanel.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPanel
    },
    {
      path: '/verify',
      name: 'verify',
      component: IDVerification
    },
    {
      path: '/client',
      name: 'client',
      component: ClientPanel
    }
  ]
})

export default router