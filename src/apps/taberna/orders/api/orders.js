import axios from 'axios'

const ORDERS_BASE = '/taberna-orders/api/v1'

export function placeStripeOrder(payload, type) {
  const url =
    type === 'session'
      ? `${ORDERS_BASE}/place_order_stripe_session/`
      : `${ORDERS_BASE}/place_order_stripe_charge/`

  return axios.post(url, payload)
}

export function reportOrderPaymentStatus(status, stripeSessionId) {
  const url =
    status === 'success'
      ? `${ORDERS_BASE}/order_payment_success/`
      : `${ORDERS_BASE}/order_payment_failed/`

  return axios.post(url, { stripe_session_id: stripeSessionId })
}
