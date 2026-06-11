import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import {
  addProductToCart,
  fetchCart,
  removeCartLine,
  removeCartLineFully,
} from './cart'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('taberna cart api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchCart calls cart endpoint without cart_id when anonymous', async () => {
    axios.get.mockResolvedValueOnce({ data: { cart_items: [] } })

    await fetchCart(null)

    expect(axios.get).toHaveBeenCalledWith('/taberna-cart/api/cart/', { params: {} })
  })

  it('fetchCart passes cart_id when present', async () => {
    axios.get.mockResolvedValueOnce({ data: {} })

    await fetchCart('cart-42')

    expect(axios.get).toHaveBeenCalledWith('/taberna-cart/api/cart/', {
      params: { cart_id: 'cart-42' },
    })
  })

  it('addProductToCart posts variation payload', async () => {
    axios.post.mockResolvedValueOnce({ data: { cart_id: 'cart-99' } })

    await addProductToCart(7, {
      selectedColor: 'red',
      selectedSize: 'M',
      cartId: 'cart-1',
    })

    expect(axios.post).toHaveBeenCalledWith('/taberna-cart/api/add-to-cart/7/', {
      color: 'red',
      size: 'M',
      cart_id: 'cart-1',
    })
  })

  it('removeCartLine deletes one quantity', async () => {
    axios.delete.mockResolvedValueOnce({})

    await removeCartLine(3, 11, 'cart-1')

    expect(axios.delete).toHaveBeenCalledWith(
      '/taberna-cart/api/cart-remove/3/11/',
      { params: { cart_id: 'cart-1' } }
    )
  })

  it('removeCartLine works without cart_id', async () => {
    axios.delete.mockResolvedValueOnce({})

    await removeCartLine(3, 11, null)

    expect(axios.delete).toHaveBeenCalledWith(
      '/taberna-cart/api/cart-remove/3/11/',
      { params: {} }
    )
  })

  it('removeCartLineFully deletes entire line', async () => {
    axios.delete.mockResolvedValueOnce({})

    await removeCartLineFully(3, 11, null)

    expect(axios.delete).toHaveBeenCalledWith(
      '/taberna-cart/api/cart-item-remove/3/11/',
      { params: {} }
    )
  })

  it('removeCartLineFully passes cart_id when present', async () => {
    axios.delete.mockResolvedValueOnce({})

    await removeCartLineFully(3, 11, 'cart-2')

    expect(axios.delete).toHaveBeenCalledWith(
      '/taberna-cart/api/cart-item-remove/3/11/',
      { params: { cart_id: 'cart-2' } }
    )
  })
})
