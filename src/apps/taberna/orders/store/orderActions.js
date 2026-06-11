import * as ordersApi from '../api/orders'

function refreshCart(dispatch) {
  return dispatch('tabernaCartData/getCart', null, { root: true })
}

export const orderActions = {
  async placeOrderStripe({ dispatch }, { payload, type }) {
    const response = await ordersApi.placeStripeOrder(payload, type)

    if (type === 'session' && response.data.checkout_url) {
      window.location.href = response.data.checkout_url
      return
    }

    await refreshCart(dispatch)
    const { default: router } = await import('@/router')
    router.push({ name: 'successTaberna' })
  },

  async placeOrderStatus({ dispatch }, { status, stripeSessionId }) {
    await ordersApi.reportOrderPaymentStatus(status, stripeSessionId)
    await refreshCart(dispatch)
  },
}
