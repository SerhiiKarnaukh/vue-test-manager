import { createStore, createLogger } from 'vuex'

import aiLabChatData from '@/apps/ai_lab/store/aiLab.module'

import socialChatData from '@/apps/social/chat/store/chat.module'

import socialNotificationData from '@/apps/social/notifications/store/notifications.module'

import socialPostData from '@/apps/social/posts/store/posts.module'

import socialProfileData from '@/apps/social/profiles/store/profiles.module'

import tabernaCartData from '@/apps/taberna/cart/store/cart.module'

import tabernaOrdersData from '@/apps/taberna/orders/store/orders.module'

import tabernaProductData from '@/apps/taberna/product/store/product.module'

import tabernaProfileData from '@/apps/taberna/profiles/store/profiles.module'

import authJWT from '@/shared/auth/store/authJWT.module'

import authToken from '@/shared/auth/store/authToken.module'

import alert from './modules/alert.module'

const plugins = []

if (process.env.NODE_ENV === 'development') {
  plugins.push(createLogger())
}

export default createStore({
  plugins,

  state() {
    return {
      appName: '',

      isLoading: false,
    }
  },

  mutations: {
    setAppName(state, appName) {
      state.appName = appName
    },

    setIsLoading(state, value) {
      state.isLoading = value
    },
  },

  actions: {
    setPageTitle({ state }, pageTitle) {
      document.title = `${pageTitle} | ${state.appName}`
    },
  },

  modules: {
    authToken,
    authJWT,
    alert,
    socialProfileData,
    socialPostData,
    socialChatData,
    socialNotificationData,
    tabernaCartData,
    tabernaOrdersData,
    tabernaProductData,
    tabernaProfileData,
    aiLabChatData,
  },

  getters: {
    isLoading: (state) => state.isLoading,
  },
})
