import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { fetchUserOrders } from './orders'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}))

describe('taberna profiles orders api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchUserOrders calls profiles orders endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })

    await fetchUserOrders()

    expect(axios.get).toHaveBeenCalledWith('taberna-profiles/api/v1/orders/')
  })
})
