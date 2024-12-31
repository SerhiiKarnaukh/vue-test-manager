import axios from 'axios'
const state = () => ({
  //   cart: {
  //     items: [],
  //   },
  cart: {},
})

const mutations = {
  initializeStore(state) {
    // if (localStorage.getItem('cart')) {
    //   state.cart = JSON.parse(localStorage.getItem('cart'))
    // } else {
    //   localStorage.setItem('cart', JSON.stringify(state.cart))
    // }
  },
  addToCart(state, cartItem) {
    console.log('cartItem', cartItem)
    // const exists = state.cart.items.filter(
    //   (i) => i.product.id === item.product.id
    // )
    // if (exists.length) {
    //   exists[0].quantity =
    //     parseInt(exists[0].quantity) + parseInt(item.quantity)
    // } else {
    //   state.cart.items.push(item)
    // }
    // localStorage.setItem('cart', JSON.stringify(state.cart))
  },
  clearCart(state) {
    // state.cart = { items: [] }
    // localStorage.setItem('cart', JSON.stringify(state.cart))
  },
  setCart(state, cart) {
    state.cart = cart
  },
}

const actions = {
  async getCart({ commit }) {
    await axios
      .get('/taberna-cart/api/cart/')
      .then((response) => {
        commit('setCart', response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  },
}

const getters = {
  cart: (state) => state.cart,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
