import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/HomePage.vue'
import Admin from '../components/AdminPage.vue'

const routes = [
  {
    path: '/',
    children: [
      {
        path: '',
        name: 'home',
        component: Home
      },
      {
        path: 'admin',
        name: 'admin',
        component: Admin
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
