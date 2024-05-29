import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from '@/views/Login.vue'
import Layout from '@/components/Layout.vue'
import Home from '@/views/Home.vue'
import Product from '@/views/Product.vue'
import Order from '@/views/Order.vue'
import { authMiddleware } from '@/middlewares/authMiddleware'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'products',
        name: 'Products',
        component: Product,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'order',
        name: 'Order',
        component: Order,
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(authMiddleware)

export default router
