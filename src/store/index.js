import { createStore, createLogger } from 'vuex'
import axios from 'axios'
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
    async logout(state) {
      await axios
        .post('/auth/token/logout/', null, {
          headers: {
            Authorization: `Token ${state.token}`,
          },
        })
        .then(() => {
          state.token = null
          localStorage.removeItem('token')
          axios.defaults.headers.common['Authorization'] = ''
        })
        .catch((error) => {
          if (error.response) {
            for (const property in error.response.data) {
              error.response.data[property].map((e) => this.errors.push(e))
            }
            console.log(JSON.stringify(error.response.data))
          } else {
            this.errors.push('Something went wrong. Please try again')

            console.log(JSON.stringify(error))
          }
        })
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
