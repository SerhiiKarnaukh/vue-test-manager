import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { placeStripeOrder, reportOrderPaymentStatus } from './orders'

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}))

describe('taberna orders api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('placeStripeOrder uses session endpoint', async () => {
    axios.post.mockResolvedValueOnce({ data: { checkout_url: 'https://stripe' } })

    await placeStripeOrder({ amount: 10 }, 'session')

    expect(axios.post).toHaveBeenCalledWith(
      '/taberna-orders/api/v1/place_order_stripe_session/',
      { amount: 10 }
    )
  })

  it('placeStripeOrder uses charge endpoint', async () => {
    axios.post.mockResolvedValueOnce({ data: {} })

    await placeStripeOrder({ amount: 10 }, 'charge')

    expect(axios.post).toHaveBeenCalledWith(
      '/taberna-orders/api/v1/place_order_stripe_charge/',
      { amount: 10 }
    )
  })

  it('reportOrderPaymentStatus posts stripe session id', async () => {
    axios.post.mockResolvedValueOnce({})

    await reportOrderPaymentStatus('success', 'sess_123')

    expect(axios.post).toHaveBeenCalledWith(
      '/taberna-orders/api/v1/order_payment_success/',
      { stripe_session_id: 'sess_123' }
    )
  })

  it('reportOrderPaymentStatus uses failed endpoint', async () => {
    axios.post.mockResolvedValueOnce({})

    await reportOrderPaymentStatus('failed', 'sess_456')

    expect(axios.post).toHaveBeenCalledWith(
      '/taberna-orders/api/v1/order_payment_failed/',
      { stripe_session_id: 'sess_456' }
    )
  })
})
