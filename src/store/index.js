import { createStore, createLogger } from 'vuex'
import authToken from './modules/authToken.module'
import authJWT from './modules/authJWT.module'
import alert from './modules/alert.module'
import socialProfileData from './modules/socialNetworkData/socialProfileData.module'
import socialPostData from './modules/socialNetworkData/socialPostData.module'
import socialChatData from './modules/socialNetworkData/socialChatData.module'
import socialNotificationData from './modules/socialNetworkData/socialNotificationData.module'
import tabernaCartData from './modules/tabernaData/tabernaCartData.module'
import tabernaProductData from './modules/tabernaData/tabernaProductData.module'
import tabernaProfileData from './modules/tabernaData/tabernaProfileData.module'
import aiLabChatData from './modules/aiLabData/aiLabChatData.module'
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
    tabernaProductData,
    tabernaProfileData,
    aiLabChatData,
  },
  getters: {
    isLoading: (state) => state.isLoading,
  },
})
