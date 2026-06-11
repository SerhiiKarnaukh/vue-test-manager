import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { changePassword, fetchCurrentUser, updateProfile } from './profile'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('social profiles api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchCurrentUser calls me endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: {} })
    await fetchCurrentUser()
    expect(axios.get).toHaveBeenCalledWith('/api/social-profiles/me/')
  })

  it('updateProfile posts multipart form', async () => {
    const formData = new FormData()
    axios.post.mockResolvedValueOnce({ data: {} })
    await updateProfile(formData)
    expect(axios.post).toHaveBeenCalledWith(
      '/api/social-profiles/editprofile/',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  })

  it('changePassword posts payload', async () => {
    axios.post.mockResolvedValueOnce({ data: {} })
    await changePassword({ password: 'secret' })
    expect(axios.post).toHaveBeenCalledWith('/api/social-profiles/editpassword/', {
      password: 'secret',
    })
  })
})
