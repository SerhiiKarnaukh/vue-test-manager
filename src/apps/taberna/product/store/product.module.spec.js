import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as productsApi from '../api/products'
import productModule from './product.module'

vi.mock('../api/products', () => ({
  fetchLatestProducts: vi.fn(),
  fetchProductDetail: vi.fn(),
}))

describe('taberna product module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getLatestProducts commits products payload', async () => {
    const commit = vi.fn()
    productsApi.fetchLatestProducts.mockResolvedValueOnce({
      data: [{ id: 1, name: 'Hat' }],
    })

    await productModule.actions.getLatestProducts({ commit })

    expect(commit).toHaveBeenCalledWith('setLatestProducts', [{ id: 1, name: 'Hat' }])
  })

  it('getProductDetail commits detail payload', async () => {
    const commit = vi.fn()
    productsApi.fetchProductDetail.mockResolvedValueOnce({
      data: { product: { id: 2 }, variations: {} },
    })

    await productModule.actions.getProductDetail(
      { commit },
      { categorySlug: 'hats', productSlug: 'fedora' }
    )

    expect(productsApi.fetchProductDetail).toHaveBeenCalledWith('hats', 'fedora')
    expect(commit).toHaveBeenCalledWith('setProductDetail', {
      product: { id: 2 },
      variations: {},
    })
  })

  it('getLatestProducts logs errors without throwing', async () => {
    const commit = vi.fn()
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    productsApi.fetchLatestProducts.mockRejectedValueOnce(new Error('network'))

    await productModule.actions.getLatestProducts({ commit })

    expect(consoleSpy).toHaveBeenCalled()
    expect(commit).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('getProductDetail logs errors without throwing', async () => {
    const commit = vi.fn()
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    productsApi.fetchProductDetail.mockRejectedValueOnce(new Error('not found'))

    await productModule.actions.getProductDetail(
      { commit },
      { categorySlug: 'x', productSlug: 'y' }
    )

    expect(consoleSpy).toHaveBeenCalled()
    expect(commit).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('exposes product getters', () => {
    const state = {
      latestProducts: [{ id: 1 }],
      productDetail: { product: { id: 2 }, variations: { colors: [] } },
    }

    expect(productModule.getters.latestProducts(state)).toEqual([{ id: 1 }])
    expect(productModule.getters.productDetail(state)).toEqual({
      product: { id: 2 },
      variations: { colors: [] },
    })
  })

  it('setLatestProducts mutation updates list', () => {
    const state = productModule.state()
    productModule.mutations.setLatestProducts(state, [{ id: 3 }])
    expect(state.latestProducts).toEqual([{ id: 3 }])
  })

  it('setProductDetail mutation updates detail', () => {
    const state = productModule.state()
    const detail = { product: { id: 4 }, variations: {} }
    productModule.mutations.setProductDetail(state, detail)
    expect(state.productDetail).toEqual(detail)
  })

  it('clearProductDetail mutation resets detail', () => {
    const state = productModule.state()
    state.productDetail = { product: { id: 5 }, variations: { sizes: [] } }
    productModule.mutations.clearProductDetail(state)
    expect(state.productDetail).toEqual({ product: {}, variations: {} })
  })
})
