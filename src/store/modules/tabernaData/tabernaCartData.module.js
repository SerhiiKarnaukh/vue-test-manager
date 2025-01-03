import axios from 'axios'
const state = () => ({
  cart: {},
})

const mutations = {
  setCart(state, cart) {
    state.cart = cart
  },
  clearCart(state) {
    state.cart = {}
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
  async addToCart(_, payload) {
    try {
      const response = await axios.post(
        `/taberna-cart/api/add-to-cart/${payload.productId}/`,
        {
          color: payload.selectedColor,
          size: payload.selectedSize,
        }
      )

      console.log(response.data.message)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  },
  async removeFromCart(_, { productId, cartItemId }) {
    const url = `/taberna-cart/api/cart-remove/${productId}/${cartItemId}/`
    await axios.delete(url)
  },
  async removeCartItemFully(_, { productId, cartItemId }) {
    const url = `/taberna-cart/api/cart-item-remove/${productId}/${cartItemId}/`
    await axios.delete(url)
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
