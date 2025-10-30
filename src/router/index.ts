import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import EmployeeCards from '../pages/EmployeeCards.vue'
import AccountingHelper from '../pages/AccountingHelper.vue'
import LunchExpert from '../pages/LunchExpert.vue'
import WarRoom from '../pages/WarRoom.vue'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/employees',
    name: 'EmployeeCards',
    component: EmployeeCards
  },
  {
    path: '/accounting',
    name: 'AccountingHelper',
    component: AccountingHelper
  },
  {
    path: '/lunch',
    name: 'LunchExpert',
    component: LunchExpert
  },
  {
    path: '/warroom',
    name: 'WarRoom',
    component: WarRoom
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
