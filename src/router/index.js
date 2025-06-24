import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  //Vue Applications Manager
  {
    path: '/',
    name: 'homeAppsManager',
    component: () => import('@/views/appsmanager/HomeView.vue'),
    meta: {
      layout: 'mainAppsManager',
    },
  },
  {
    path: '/:NotFound(.*)*',
    name: 'notFound',
    component: () => import('@/views/appsmanager/NotFoundView.vue'),
    meta: {
      authJWT: false,
      layout: 'mainAppsManager',
    },
  },
  {
    path: '/apps_manager/search',
    name: 'searchAppsManager',
    component: () => import('@/views/appsmanager/SearchView.vue'),
    meta: {
      layout: 'mainAppsManager',
    },
  },
  //Taberna
  {
    path: '/taberna',
    name: 'homeTaberna',
    component: () => import('@/views/taberna/HomeView.vue'),
    meta: {
      authJWT: false,
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
      authJWT: false,
      layout: 'mainTaberna',
    },
  },
  {
    path: '/taberna/dashboard',
    name: 'dashboardTaberna',
    component: () => import('@/views/taberna/DashboardView.vue'),
    meta: {
      authJWT: true,
      layout: 'mainTaberna',
    },
  },
  {
    path: '/taberna-store/category/:category_slug/:product_slug',
    name: 'productTaberna',
    component: () => import('@/views/taberna/ProductDetailView.vue'),
    meta: {
      authJWT: false,
      layout: 'mainTaberna',
    },
  },
  {
    path: '/taberna-store/category/:category_slug',
    name: 'categoryTaberna',
    component: () => import('@/views/taberna/CategoryDetailView.vue'),
    meta: {
      authJWT: false,
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
      authJWT: true,
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
  {
    path: '/taberna/cart/failed',
    name: 'failedTaberna',
    component: () => import('@/views/taberna/FailedView.vue'),
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
      authJWT: false,
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/profile/edit',
    name: 'editProfileSocial',
    component: () => import('@/views/social/EditProfileView.vue'),
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
      authJWT: false,
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/profile/:slug/friends',
    name: 'friendsSocial',
    component: () => import('@/views/social/FriendsView.vue'),
    meta: {
      authJWT: true,
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/:id',
    name: 'postSocial',
    component: () => import('@/views/social/PostView.vue'),
    meta: {
      authJWT: false,
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/trends/:id',
    name: 'trendSocial',
    component: () => import('@/views/social/TrendView.vue'),
    meta: {
      authJWT: false,
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/chat',
    name: 'chatSocial',
    component: () => import('@/views/social/ChatView.vue'),
    meta: {
      authJWT: true,
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/notifications',
    name: 'notificationsSocial',
    component: () => import('@/views/social/NotificationsView.vue'),
    meta: {
      authJWT: true,
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/search',
    name: 'searchSocial',
    component: () => import('@/views/social/SearchView.vue'),
    meta: {
      authJWT: false,
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
  {
    path: '/social/edit/password',
    name: 'editPassword',
    component: () => import('@/views/social/EditPasswordView.vue'),
    meta: {
      authJWT: true,
      layout: 'mainSocial',
    },
  },
  //AI Lab
  {
    path: '/ai-lab',
    name: 'homeAILab',
    component: () => import('@/views/ai_lab/HomeView.vue'),
    meta: {
      layout: 'mainAILab',
    },
  },
  {
    path: '/ai-lab/image-generator',
    name: 'imageGenerator',
    component: () => import('@/views/ai_lab/ImageGeneratorView.vue'),
    meta: {
      layout: 'mainAILab',
    },
  },
  {
    path: '/ai-lab/voice-generator',
    name: 'voiceGenerator',
    component: () => import('@/views/ai_lab/VoiceGeneratorView.vue'),
    meta: {
      layout: 'mainAILab',
    },
  },
  {
    path: '/ai-lab/realtime-chat',
    name: 'realtimeChat',
    component: () => import('@/views/ai_lab/RealtimeChatView.vue'),
    meta: {
      layout: 'mainAILab',
    },
  },
  //Hyper 3D
  {
    path: '/hyper3d',
    name: 'homeHyper3d',
    component: () => import('@/views/hyper3d/HomeView.vue'),
    meta: {
      layout: 'mainHyper3d',
    },
  },
  {
    path: '/hyper3d/animate',
    name: 'animateHyper3d',
    component: () => import('@/views/hyper3d/AnimateView.vue'),
    meta: {
      layout: 'mainHyper3d',
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

function getLoginRoute(path) {
  if (path.startsWith('/taberna'))
    return `/taberna/login?redirect=${encodeURIComponent(path)}&message=auth`

  if (path.startsWith('/social')) return '/social/login?message=auth'

  return '/'
}

router.beforeEach((to, from, next) => {
  const requireAuthJWT = to.meta.authJWT

  // === Authorization check ===
  if (requireAuthJWT && store.getters['authJWT/isAuthenticated']) {
    next()
  } else if (requireAuthJWT && !store.getters['authJWT/isAuthenticated']) {
    next(getLoginRoute(to.fullPath))
  } else {
    next()
  }
})

export default router
