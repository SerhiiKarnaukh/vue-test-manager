import { createStore, createLogger } from 'vuex'
import authToken from './modules/authToken.module'
import authJWT from './modules/authJWT.module'
import alert from './modules/alert.module'
import socialUserData from './modules/socialNetworkData/socialUserData.module'
import socialPostData from './modules/socialNetworkData/socialPostData.module'
const plugins = []

if (process.env.NODE_ENV === 'development') {
  plugins.push(createLogger())
}

export default createStore({
  plugins,
  state() {
    return {
      cart: {
        items: [],
      },
    }
  },
  mutations: {
    initializeStore(state) {
      if (localStorage.getItem('cart')) {
        state.cart = JSON.parse(localStorage.getItem('cart'))
      } else {
        localStorage.setItem('cart', JSON.stringify(state.cart))
      }
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
  actions: {},
  modules: {
    authToken,
    authJWT,
    alert,
    socialUserData,
    socialPostData,
  },
  getters: {},
})
