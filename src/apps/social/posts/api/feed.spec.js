import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import {
  fetchFeed,
  fetchPaginated,
  fetchProfilePosts,
  fetchTrendPosts,
} from './feed'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}))

describe('social posts feed api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchFeed calls feed endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: {} })
    await fetchFeed()
    expect(axios.get).toHaveBeenCalledWith('/api/social-posts/')
  })

  it('fetchPaginated calls provided path', async () => {
    axios.get.mockResolvedValueOnce({ data: {} })
    await fetchPaginated('/api/social-posts/?page=2')
    expect(axios.get).toHaveBeenCalledWith('/api/social-posts/?page=2')
  })

  it('fetchProfilePosts calls profile endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: {} })
    await fetchProfilePosts('john')
    expect(axios.get).toHaveBeenCalledWith('/api/social-posts/profile/john/')
  })

  it('fetchTrendPosts calls trend filter endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: {} })
    await fetchTrendPosts(42)
    expect(axios.get).toHaveBeenCalledWith('/api/social-posts/?trend=42')
  })
})
