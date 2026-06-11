import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { fetchNotifications, markNotificationRead } from './notifications'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('social notifications api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchNotifications calls list endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })
    await fetchNotifications()
    expect(axios.get).toHaveBeenCalledWith('/api/social-notifications/')
  })

  it('markNotificationRead calls read endpoint', async () => {
    axios.post.mockResolvedValueOnce({ data: {} })
    await markNotificationRead(12)
    expect(axios.post).toHaveBeenCalledWith('/api/social-notifications/read/12/')
  })
})
