import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { deletePost, likePost, reportPost } from './actions'

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('social posts actions api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('likePost posts to like endpoint', async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'like created' } })
    await likePost(7)
    expect(axios.post).toHaveBeenCalledWith('/api/social-posts/7/like/')
  })

  it('reportPost posts to report endpoint', async () => {
    axios.post.mockResolvedValueOnce({})
    await reportPost(8)
    expect(axios.post).toHaveBeenCalledWith('/api/social-posts/8/report/')
  })

  it('deletePost deletes post endpoint', async () => {
    axios.delete.mockResolvedValueOnce({})
    await deletePost(9)
    expect(axios.delete).toHaveBeenCalledWith('/api/social-posts/9/delete/')
  })
})
