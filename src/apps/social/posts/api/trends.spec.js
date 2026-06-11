import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { fetchTrends } from './trends'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}))

describe('social posts trends api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchTrends calls trends endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: {} })
    await fetchTrends()
    expect(axios.get).toHaveBeenCalledWith('/api/social-posts/trends/')
  })
})
