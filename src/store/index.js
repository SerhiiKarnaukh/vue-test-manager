import { createStore, createLogger } from 'vuex'

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
      isAuthenticated: false,
      token: '',
    }
  },
  mutations: {
    initializeStore(state) {
      if (localStorage.getItem('cart')) {
        state.cart = JSON.parse(localStorage.getItem('cart'))
      } else {
        localStorage.setItem('cart', JSON.stringify(state.cart))
      }

      if (localStorage.getItem('token')) {
        state.token = localStorage.getItem('token')
        state.isAuthenticated = true
      } else {
        state.token = ''
        state.isAuthenticated = false
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
    setToken(state, token) {
      state.token = token
      state.isAuthenticated = true
    },
    removeToken(state) {
      state.token = ''
      state.isAuthenticated = false
    },
    clearCart(state) {
      state.cart = { items: [] }

      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    logout(state) {
      state.token = null
      localStorage.removeItem('token')
    },
  },
  actions: {},
  modules: {},
  getters: {
    token(state) {
      return state.token
    },
    isAuthenticated(_, getters) {
      return !!getters.token
    },
  },
})
