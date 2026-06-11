import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { fetchSearchPage, searchPosts } from './search'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('social posts search api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('searchPosts posts query', async () => {
    axios.post.mockResolvedValueOnce({ data: {} })
    await searchPosts('vue')
    expect(axios.post).toHaveBeenCalledWith('/api/social-posts/search/', {
      query: 'vue',
    })
  })

  it('fetchSearchPage calls pathname with search params', async () => {
    axios.get.mockResolvedValueOnce({ data: {} })
    const params = new URLSearchParams({ q: 'vue', page: '2' })
    await fetchSearchPage('/api/social-posts/search/', params)
    expect(axios.get).toHaveBeenCalledWith('/api/social-posts/search/?q=vue&page=2')
  })
})
