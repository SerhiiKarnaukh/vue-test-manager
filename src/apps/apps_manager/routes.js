export default [
  {
    path: '/',
    name: 'homeAppsManager',
    component: () => import('@/apps/apps_manager/views/HomeView.vue'),
    meta: {
      layout: 'mainAppsManager',
    },
  },
  {
    path: '/:NotFound(.*)*',
    name: 'notFound',
    component: () => import('@/apps/apps_manager/views/NotFoundView.vue'),
    meta: {
      authJWT: false,
      layout: 'mainAppsManager',
    },
  },
  {
    path: '/apps_manager/search',
    name: 'searchAppsManager',
    component: () => import('@/apps/apps_manager/views/SearchView.vue'),
    meta: {
      layout: 'mainAppsManager',
    },
  },
]
