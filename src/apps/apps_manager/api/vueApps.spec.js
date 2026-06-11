import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { fetchVueApps, searchVueApps } from './vueApps'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('apps manager vue apps api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchVueApps calls list endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })
    await fetchVueApps()
    expect(axios.get).toHaveBeenCalledWith('/api/v1/vue-apps/')
  })

  it('searchVueApps posts query to search endpoint', async () => {
    axios.post.mockResolvedValueOnce({ data: [] })
    await searchVueApps('taberna')
    expect(axios.post).toHaveBeenCalledWith('/api/v1/vue-apps/search/', {
      query: 'taberna',
    })
  })
})
