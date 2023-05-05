import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  //Test Vue Manager
  {
    path: '/',
    name: 'homeTVmanager',
    component: () => import('@/views/tvmanager/HomeView.vue'),
    meta: {
      layout: 'mainTVmanager',
    },
  },
  {
    path: '/:NotFound(.*)*',
    name: 'notFound',
    component: () => import('@/views/tvmanager/NotFoundView.vue'),
    meta: {
      auth: false,
      layout: 'mainTVmanager',
    },
  },
  {
    path: '/tvmanager/search',
    name: 'searchTVmanager',
    component: () => import('@/views/tvmanager/SearchView.vue'),
    meta: {
      layout: 'mainTVmanager',
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
  //Social
  {
    path: '/social/home',
    name: 'homeSocial',
    component: () => import('@/views/social/HomeView.vue'),
    meta: {
      authJWT: true,
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/profile/:slug',
    name: 'profileSocial',
    component: () => import('@/views/social/ProfileView.vue'),
    meta: {
      authJWT: true,
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/signup',
    name: 'signupSocial',
    component: () => import('@/views/social/SignupView.vue'),
    meta: {
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/login',
    name: 'loginSocial',
    component: () => import('@/views/social/LoginView.vue'),
    meta: {
      authJWT: false,
      layout: 'mainSocial',
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

router.beforeEach((to, from, next) => {
  const requireAuthJWT = to.meta.authJWT

  if (requireAuthJWT && store.getters['authJWT/isAuthenticated']) {
    next()
  } else if (requireAuthJWT && !store.getters['authJWT/isAuthenticated']) {
    next('/social/login?message=auth')
  } else {
    next()
  }
})

export default router
