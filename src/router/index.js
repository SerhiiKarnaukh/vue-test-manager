import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      auth: false,
    },
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/SignupView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      auth: false,
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/:category_slug/:product_slug',
    name: 'product',
    component: () => import('@/views/ProductDetailView.vue'),
    meta: {
      auth: false,
    },
  },
  {
    path: '/:category_slug',
    name: 'Category',
    component: () => import('@/views/CategoryDetailView.vue'),
    meta: {
      auth: false,
    },
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/CartView.vue'),
  },
  {
    path: '/:NotFound(.*)*',
    name: 'notFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      auth: false,
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const requireAuth = to.meta.auth

  if (requireAuth && store.getters['auth/isAuthenticated']) {
    next()
  } else if (requireAuth && !store.getters['auth/isAuthenticated']) {
    next('/login?message=auth')
  } else {
    next()
  }
})

export default router
