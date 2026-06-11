import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { fetchProductCategories } from './categories'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}))

describe('taberna categories api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchProductCategories calls categories endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })

    await fetchProductCategories()

    expect(axios.get).toHaveBeenCalledWith(
      '/taberna-store/api/v1/product-categories/'
    )
  })
})
