import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as ordersApi from '../api/orders'
import { orderActions } from './orderActions'

const { pushMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
}))

vi.mock('../api/orders', () => ({
  placeStripeOrder: vi.fn(),
  reportOrderPaymentStatus: vi.fn(),
}))

vi.mock('@/router', () => ({
  default: { push: pushMock },
}))

describe('taberna order actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete window.location
    window.location = { href: '' }
  })

  it('placeOrderStripe redirects to checkout url for session flow', async () => {
    ordersApi.placeStripeOrder.mockResolvedValueOnce({
      data: { checkout_url: 'https://checkout.stripe.test' },
    })

    await orderActions.placeOrderStripe(
      { dispatch: vi.fn() },
      { payload: { cart_id: '1' }, type: 'session' }
    )

    expect(window.location.href).toBe('https://checkout.stripe.test')
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('placeOrderStripe refreshes cart and navigates on charge flow', async () => {
    const dispatch = vi.fn()
    ordersApi.placeStripeOrder.mockResolvedValueOnce({ data: {} })

    await orderActions.placeOrderStripe(
      { dispatch },
      { payload: { cart_id: '1' }, type: 'charge' }
    )

    expect(dispatch).toHaveBeenCalledWith('tabernaCartData/getCart', null, {
      root: true,
    })
    expect(pushMock).toHaveBeenCalledWith({ name: 'successTaberna' })
  })

  it('placeOrderStatus reports payment and refreshes cart', async () => {
    const dispatch = vi.fn()
    ordersApi.reportOrderPaymentStatus.mockResolvedValueOnce({})

    await orderActions.placeOrderStatus(
      { dispatch },
      { status: 'success', stripeSessionId: 'sess_1' }
    )

    expect(ordersApi.reportOrderPaymentStatus).toHaveBeenCalledWith(
      'success',
      'sess_1'
    )
    expect(dispatch).toHaveBeenCalledWith('tabernaCartData/getCart', null, {
      root: true,
    })
  })
})
