import * as cartApi from '../api/cart'

const state = () => ({
  cart: {},
  cartId: localStorage.getItem('cartId') || null,
})

const mutations = {
  setCart(state, cart) {
    state.cart = cart
  },
  clearCart(state) {
    state.cart = {}
  },
  setCartId(state, cartId) {
    state.cartId = cartId
    localStorage.setItem('cartId', cartId)
  },
  clearCartId(state) {
    state.cartId = null
    localStorage.removeItem('cartId')
  },
}

const actions = {
  async getCart({ commit, state }) {
    try {
      const response = await cartApi.fetchCart(state.cartId)
      commit('setCart', response.data)
    } catch (error) {
      console.log(error)
    }
  },
  async addToCart({ commit, state }, payload) {
    try {
      const response = await cartApi.addProductToCart(payload.productId, {
        selectedColor: payload.selectedColor,
        selectedSize: payload.selectedSize,
        cartId: state.cartId,
      })
      if (response.data.cart_id) {
        commit('setCartId', response.data.cart_id)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  },
  async removeFromCart({ state }, { productId, cartItemId }) {
    await cartApi.removeCartLine(productId, cartItemId, state.cartId)
  },
  async removeCartItemFully({ state }, { productId, cartItemId }) {
    await cartApi.removeCartLineFully(productId, cartItemId, state.cartId)
  },
}

const getters = {
  cart: (state) => state.cart,
  cartId: (state) => state.cartId,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
