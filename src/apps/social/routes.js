export default [
  {
    path: '/social/home',
    name: 'homeSocial',
    component: () => import('@/apps/social/posts/views/HomeView.vue'),
    meta: {
      authJWT: false,
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/profile/edit',
    name: 'editProfileSocial',
    component: () => import('@/apps/social/profiles/views/EditProfileView.vue'),
    meta: {
      authJWT: true,
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/profile/:slug',
    name: 'profileSocial',
    component: () => import('@/apps/social/profiles/views/ProfileView.vue'),
    meta: {
      authJWT: false,
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/profile/:slug/friends',
    name: 'friendsSocial',
    component: () => import('@/apps/social/profiles/views/FriendsView.vue'),
    meta: {
      authJWT: true,
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/:id',
    name: 'postSocial',
    component: () => import('@/apps/social/posts/views/PostView.vue'),
    meta: {
      authJWT: false,
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/trends/:id',
    name: 'trendSocial',
    component: () => import('@/apps/social/posts/views/TrendView.vue'),
    meta: {
      authJWT: false,
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/chat',
    name: 'chatSocial',
    component: () => import('@/apps/social/chat/views/ChatView.vue'),
    meta: {
      authJWT: true,
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/notifications',
    name: 'notificationsSocial',
    component: () =>
      import('@/apps/social/notifications/views/NotificationsView.vue'),
    meta: {
      authJWT: true,
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/search',
    name: 'searchSocial',
    component: () => import('@/apps/social/posts/views/SearchView.vue'),
    meta: {
      authJWT: false,
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/signup',
    name: 'signupSocial',
    component: () => import('@/apps/social/profiles/views/SignupView.vue'),
    meta: {
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/login',
    name: 'loginSocial',
    component: () => import('@/apps/social/profiles/views/LoginView.vue'),
    meta: {
      authJWT: false,
      layout: 'mainSocial',
    },
  },
  {
    path: '/social/edit/password',
    name: 'editPassword',
    component: () => import('@/apps/social/profiles/views/EditPasswordView.vue'),
    meta: {
      authJWT: true,
      layout: 'mainSocial',
    },
  },
]
