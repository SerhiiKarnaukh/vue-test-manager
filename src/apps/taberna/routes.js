export default [
  {
    path: '/taberna',
    name: 'homeTaberna',
    component: () => import('@/apps/taberna/product/views/HomeView.vue'),
    meta: {
      authJWT: false,
      layout: 'mainTaberna',
    },
  },
  {
    path: '/taberna/signup',
    name: 'signupTaberna',
    component: () => import('@/apps/taberna/profiles/views/SignupView.vue'),
    meta: {
      layout: 'mainTaberna',
    },
  },
  {
    path: '/taberna/login',
    name: 'loginTaberna',
    component: () => import('@/apps/taberna/profiles/views/LoginView.vue'),
    meta: {
      authJWT: false,
      layout: 'mainTaberna',
    },
  },
  {
    path: '/taberna/dashboard',
    name: 'dashboardTaberna',
    component: () => import('@/apps/taberna/profiles/views/DashboardView.vue'),
    meta: {
      authJWT: true,
      layout: 'mainTaberna',
    },
  },
  {
    path: '/taberna-store/category/:category_slug/:product_slug',
    name: 'productTaberna',
    component: () => import('@/apps/taberna/product/views/ProductDetailView.vue'),
    meta: {
      authJWT: false,
      layout: 'mainTaberna',
    },
  },
  {
    path: '/taberna-store/category/:category_slug',
    name: 'categoryTaberna',
    component: () => import('@/apps/taberna/product/views/CategoryDetailView.vue'),
    meta: {
      authJWT: false,
      layout: 'mainTaberna',
    },
  },
  {
    path: '/taberna/search',
    name: 'searchTaberna',
    component: () => import('@/apps/taberna/product/views/SearchView.vue'),
    meta: {
      layout: 'mainTaberna',
    },
  },
  {
    path: '/taberna/cart',
    name: 'cartTaberna',
    component: () => import('@/apps/taberna/cart/views/CartView.vue'),
    meta: {
      layout: 'mainTaberna',
    },
  },
  {
    path: '/taberna/cart/checkout',
    name: 'checkoutTaberna',
    component: () => import('@/apps/taberna/orders/views/CheckoutView.vue'),
    meta: {
      authJWT: true,
      layout: 'mainTaberna',
    },
  },
  {
    path: '/taberna/cart/success',
    name: 'successTaberna',
    component: () => import('@/apps/taberna/orders/views/SuccessView.vue'),
    meta: {
      layout: 'mainTaberna',
    },
  },
  {
    path: '/taberna/cart/failed',
    name: 'failedTaberna',
    component: () => import('@/apps/taberna/orders/views/FailedView.vue'),
    meta: {
      layout: 'mainTaberna',
    },
  },
]
