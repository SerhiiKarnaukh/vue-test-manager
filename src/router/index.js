import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  //Test Vue Manager
  {
    path: '/',
    name: 'homeTVmanager',
    component: () => import('@/views/tvmanager/HomeView.vue'),
  },
  {
    path: '/:NotFound(.*)*',
    name: 'notFound',
    component: () => import('@/views/tvmanager/NotFoundView.vue'),
    meta: {
      auth: false,
    },
  },
  //Taberna
  {
    path: '/taberna',
    name: 'homeTaberna',
    component: () => import('@/views/taberna/HomeView.vue'),
    meta: {
      auth: false,
      layout: 'mainTaberna',
    },
  },
  {
    path: '/taberna/signup',
    name: 'signupTaberna',
    component: () => import('@/views/taberna/SignupView.vue'),
    meta: {
      layout: 'mainTaberna',
    },
  },
  {
    path: '/taberna/login',
    name: 'loginTaberna',
    component: () => import('@/views/taberna/LoginView.vue'),
    meta: {
      auth: false,
      layout: 'mainTaberna',
    },
  },
  {
    path: '/taberna/dashboard',
    name: 'dashboardTaberna',
    component: () => import('@/views/taberna/DashboardView.vue'),
    meta: {
      auth: true,
      layout: 'mainTaberna',
    },
  },
  {
    path: '/store/category/:category_slug/:product_slug',
    name: 'productTaberna',
    component: () => import('@/views/taberna/ProductDetailView.vue'),
    meta: {
      auth: false,
      layout: 'mainTaberna',
    },
  },
  {
    path: '/store/category/:category_slug',
    name: 'categoryTaberna',
    component: () => import('@/views/taberna/CategoryDetailView.vue'),
    meta: {
      auth: false,
      layout: 'mainTaberna',
    },
  },
  {
    path: '/taberna/search',
    name: 'searchTaberna',
    component: () => import('@/views/taberna/SearchView.vue'),
    meta: {
      layout: 'mainTaberna',
    },
  },
  {
    path: '/taberna/cart',
    name: 'cartTaberna',
    component: () => import('@/views/taberna/CartView.vue'),
    meta: {
      layout: 'mainTaberna',
    },
  },
  {
    path: '/taberna/cart/checkout',
    name: 'checkoutTaberna',
    component: () => import('@/views/taberna/CheckoutView.vue'),
    meta: {
      auth: true,
      layout: 'mainTaberna',
    },
  },
  {
    path: '/taberna/cart/success',
    name: 'successTaberna',
    component: () => import('@/views/taberna/SuccessView.vue'),
    meta: {
      layout: 'mainTaberna',
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const requireAuth = to.meta.auth

  if (requireAuth && store.getters['authToken/isAuthenticated']) {
    next()
  } else if (requireAuth && !store.getters['authToken/isAuthenticated']) {
    next('/taberna/login?message=auth')
  } else {
    next()
  }
})

export default router
