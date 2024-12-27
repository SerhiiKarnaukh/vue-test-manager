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
const plugins = []

if (process.env.NODE_ENV === 'development') {
  plugins.push(createLogger())
}

export default createStore({
  plugins,
  state() {
    return {
      appName: '',
      cart: {
        items: [],
      },
    }
  },
  mutations: {
    setAppName(state, appName) {
      state.appName = appName
    },
    addToCart(state, item) {
      const exists = state.cart.items.filter(
        (i) => i.product.id === item.product.id
      )
      if (exists.length) {
        exists[0].quantity =
          parseInt(exists[0].quantity) + parseInt(item.quantity)
      } else {
        state.cart.items.push(item)
      }

      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    clearCart(state) {
      state.cart = { items: [] }

      localStorage.setItem('cart', JSON.stringify(state.cart))
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
  },
  getters: {},
})
