import { createRouter, createWebHistory } from '@ionic/vue-router'
import Home from '../views/Home.vue'
import CoinDetail from '../views/CoinDetail.vue'
import FavoritesPage from '../components/FavoritesPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/coin/:id',
      name: 'coin-detail',
      component: CoinDetail,
      props: true
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesPage,
      props: true
    }
  ]
})

export default router
