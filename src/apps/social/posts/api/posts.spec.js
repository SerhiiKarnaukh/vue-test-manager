import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { addComment, createPost, fetchPost } from './posts'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('social posts api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchPost calls post detail endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: {} })
    await fetchPost(42)
    expect(axios.get).toHaveBeenCalledWith('/api/social-posts/42/')
  })

  it('createPost sends multipart form data', async () => {
    const formData = new FormData()
    axios.post.mockResolvedValueOnce({ data: {} })
    await createPost(formData)
    expect(axios.post).toHaveBeenCalledWith('/api/social-posts/create/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  })

  it('addComment posts comment body', async () => {
    axios.post.mockResolvedValueOnce({ data: {} })
    await addComment(42, 'hello')
    expect(axios.post).toHaveBeenCalledWith('/api/social-posts/42/comment/', {
      body: 'hello',
    })
  })
})
