import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as cartApi from '../api/cart'
import cartModule from './cart.module'

vi.mock('../api/cart', () => ({
  fetchCart: vi.fn(),
  addProductToCart: vi.fn(),
  removeCartLine: vi.fn(),
  removeCartLineFully: vi.fn(),
}))

describe('taberna cart module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('getCart commits cart payload', async () => {
    const commit = vi.fn()
    cartApi.fetchCart.mockResolvedValueOnce({ data: { total: 10 } })

    await cartModule.actions.getCart({
      commit,
      state: { cartId: 'cart-1' },
    })

    expect(cartApi.fetchCart).toHaveBeenCalledWith('cart-1')
    expect(commit).toHaveBeenCalledWith('setCart', { total: 10 })
  })

  it('initializes cartId from localStorage', () => {
    localStorage.setItem('cartId', 'stored-cart')

    expect(cartModule.state().cartId).toBe('stored-cart')
  })

  it('addToCart skips setCartId when response has no cart_id', async () => {
    const commit = vi.fn()
    cartApi.addProductToCart.mockResolvedValueOnce({ data: {} })

    await cartModule.actions.addToCart(
      { commit, state: { cartId: 'existing' } },
      { productId: 5, selectedColor: 'blue', selectedSize: 'L' }
    )

    expect(commit).not.toHaveBeenCalled()
  })

  it('addToCart stores returned cart_id', async () => {
    const commit = vi.fn()
    cartApi.addProductToCart.mockResolvedValueOnce({ data: { cart_id: 'new-cart' } })

    await cartModule.actions.addToCart(
      { commit, state: { cartId: null } },
      { productId: 5, selectedColor: 'blue', selectedSize: 'L' }
    )

    expect(cartApi.addProductToCart).toHaveBeenCalledWith(5, {
      selectedColor: 'blue',
      selectedSize: 'L',
      cartId: null,
    })
    expect(commit).toHaveBeenCalledWith('setCartId', 'new-cart')
  })

  it('removeFromCart delegates to api', async () => {
    cartApi.removeCartLine.mockResolvedValueOnce({})

    await cartModule.actions.removeFromCart(
      { state: { cartId: 'cart-7' } },
      { productId: 2, cartItemId: 9 }
    )

    expect(cartApi.removeCartLine).toHaveBeenCalledWith(2, 9, 'cart-7')
  })

  it('removeCartItemFully delegates to api', async () => {
    cartApi.removeCartLineFully.mockResolvedValueOnce({})

    await cartModule.actions.removeCartItemFully(
      { state: { cartId: 'cart-7' } },
      { productId: 2, cartItemId: 9 }
    )

    expect(cartApi.removeCartLineFully).toHaveBeenCalledWith(2, 9, 'cart-7')
  })

  it('getCart logs errors without throwing', async () => {
    const commit = vi.fn()
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    cartApi.fetchCart.mockRejectedValueOnce(new Error('network'))

    await cartModule.actions.getCart({
      commit,
      state: { cartId: null },
    })

    expect(consoleSpy).toHaveBeenCalled()
    expect(commit).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('addToCart logs errors without throwing', async () => {
    const commit = vi.fn()
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    cartApi.addProductToCart.mockRejectedValueOnce(new Error('bad request'))

    await cartModule.actions.addToCart(
      { commit, state: { cartId: null } },
      { productId: 1, selectedColor: 'x', selectedSize: 'y' }
    )

    expect(consoleSpy).toHaveBeenCalled()
    expect(commit).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('exposes cart getters', () => {
    const state = { cart: { total: 5 }, cartId: 'cart-1' }

    expect(cartModule.getters.cart(state)).toEqual({ total: 5 })
    expect(cartModule.getters.cartId(state)).toBe('cart-1')
  })

  it('setCart mutation updates cart payload', () => {
    const state = cartModule.state()
    cartModule.mutations.setCart(state, { total: 42 })

    expect(state.cart).toEqual({ total: 42 })
  })

  it('clearCart mutation resets cart object', () => {
    const state = cartModule.state()
    state.cart = { total: 99 }
    cartModule.mutations.clearCart(state)
    expect(state.cart).toEqual({})
  })

  it('setCartId persists cart id in localStorage', () => {
    const state = cartModule.state()
    cartModule.mutations.setCartId(state, 'persisted-cart')

    expect(state.cartId).toBe('persisted-cart')
    expect(localStorage.getItem('cartId')).toBe('persisted-cart')
  })

  it('clearCartId removes cart id from localStorage', () => {
    const state = cartModule.state()
    localStorage.setItem('cartId', 'gone')
    cartModule.mutations.clearCartId(state)

    expect(state.cartId).toBeNull()
    expect(localStorage.getItem('cartId')).toBeNull()
  })
})
