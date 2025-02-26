import axios from 'axios'
import router from '@/router'

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
    const params = state.cartId ? { cart_id: state.cartId } : {}
    await axios
      .get('/taberna-cart/api/cart/', { params })
      .then((response) => {
        commit('setCart', response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  },
  async addToCart({ commit, state }, payload) {
    try {
      const response = await axios.post(
        `/taberna-cart/api/add-to-cart/${payload.productId}/`,
        {
          color: payload.selectedColor,
          size: payload.selectedSize,
          cart_id: state.cartId,
        }
      )
      if (response.data.cart_id) {
        commit('setCartId', response.data.cart_id)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  },
  async removeFromCart({ state }, { productId, cartItemId }) {
    const url = `/taberna-cart/api/cart-remove/${productId}/${cartItemId}/`
    const params = state.cartId ? { cart_id: state.cartId } : {}
    await axios.delete(url, { params })
  },
  async removeCartItemFully({ state }, { productId, cartItemId }) {
    const url = `/taberna-cart/api/cart-item-remove/${productId}/${cartItemId}/`
    const params = state.cartId ? { cart_id: state.cartId } : {}
    await axios.delete(url, { params })
  },
  async placeOrderStripe({ _, dispatch }, { payload, type }) {
    const url =
      type === 'session'
        ? '/taberna-orders/api/v1/place_order_stripe_session/'
        : '/taberna-orders/api/v1/place_order_stripe_charge/'

    const response = await axios.post(url, payload)

    if (type === 'session' && response.data.checkout_url) {
      window.location.href = response.data.checkout_url
    } else {
      await dispatch('getCart')
      router.push({ name: 'successTaberna' })
    }
  },

  async placeOrderStatus({ _, dispatch }, { status, stripeSessionId }) {
    const url =
      status === 'success'
        ? '/taberna-orders/api/v1/order_payment_success/'
        : '/taberna-orders/api/v1/order_payment_failed/'
    await axios.post(url, { stripe_session_id: stripeSessionId })
    await dispatch('getCart')
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
