import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import {
  fetchCategoryProducts,
  fetchLatestProducts,
  fetchProductDetail,
  searchProducts,
} from './products'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('taberna products api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchLatestProducts calls latest-products endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })

    await fetchLatestProducts()

    expect(axios.get).toHaveBeenCalledWith('/taberna-store/api/v1/latest-products/')
  })

  it('fetchProductDetail calls product detail endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: {} })

    await fetchProductDetail('shoes', 'runner-x')

    expect(axios.get).toHaveBeenCalledWith(
      '/taberna-store/api/v1/products/shoes/runner-x'
    )
  })

  it('fetchCategoryProducts calls category listing endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: { products: [] } })

    await fetchCategoryProducts('shoes')

    expect(axios.get).toHaveBeenCalledWith('/taberna-store/api/v1/products/shoes/')
  })

  it('searchProducts posts query payload', async () => {
    axios.post.mockResolvedValueOnce({ data: [] })

    await searchProducts('boots')

    expect(axios.post).toHaveBeenCalledWith(
      '/taberna-store/api/v1/products/search/',
      { query: 'boots' }
    )
  })
})
