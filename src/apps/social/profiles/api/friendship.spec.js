import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import {
  fetchFriendSuggestions,
  fetchFriendsData,
  handleFriendRequest,
  sendFriendRequest,
} from './friendship'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('social friendship api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sendFriendRequest posts request endpoint', async () => {
    axios.post.mockResolvedValueOnce({ data: {} })
    await sendFriendRequest('john')
    expect(axios.post).toHaveBeenCalledWith(
      '/api/social-profiles/friends/john/request/'
    )
  })

  it('fetchFriendsData gets friends endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: {} })
    await fetchFriendsData('john')
    expect(axios.get).toHaveBeenCalledWith('/api/social-profiles/friends/john/')
  })

  it('handleFriendRequest posts status endpoint', async () => {
    axios.post.mockResolvedValueOnce({ data: {} })
    await handleFriendRequest('john', 'accept')
    expect(axios.post).toHaveBeenCalledWith(
      '/api/social-profiles/friends/john/accept/'
    )
  })

  it('fetchFriendSuggestions gets suggested endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })
    await fetchFriendSuggestions()
    expect(axios.get).toHaveBeenCalledWith('/api/social-profiles/friends/suggested/')
  })
})
