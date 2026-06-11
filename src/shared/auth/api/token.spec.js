import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import {
  DEFAULT_REGISTER_URL,
  JWT_REFRESH_URL,
  TOKEN_LOGIN_URL,
  TOKEN_LOGOUT_URL,
  loginWithToken,
  logoutWithToken,
  refreshJwtToken,
  registerUser,
  resolveRegisterUrl,
} from './token'

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}))

describe('auth token api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('resolveRegisterUrl maps registration sources', () => {
    expect(resolveRegisterUrl('taberna')).toBe('/taberna-profiles/api/register/')
    expect(resolveRegisterUrl('social_network')).toBe(
      '/api/social-profiles/register/'
    )
    expect(resolveRegisterUrl('other')).toBe(DEFAULT_REGISTER_URL)
  })

  it('loginWithToken posts credentials', async () => {
    axios.post.mockResolvedValueOnce({ data: {} })
    await loginWithToken({ email: 'a@b.c', password: 'x' })
    expect(axios.post).toHaveBeenCalledWith(TOKEN_LOGIN_URL, {
      email: 'a@b.c',
      password: 'x',
    })
  })

  it('logoutWithToken sends token header', async () => {
    axios.post.mockResolvedValueOnce({})
    await logoutWithToken('tok-1')
    expect(axios.post).toHaveBeenCalledWith(TOKEN_LOGOUT_URL, null, {
      headers: { Authorization: 'Token tok-1' },
    })
  })

  it('registerUser posts to provided url', async () => {
    axios.post.mockResolvedValueOnce({ data: {} })
    await registerUser('/taberna-profiles/api/register/', { email: 'a@b.c' })
    expect(axios.post).toHaveBeenCalledWith('/taberna-profiles/api/register/', {
      email: 'a@b.c',
    })
  })

  it('refreshJwtToken posts refresh token', async () => {
    axios.post.mockResolvedValueOnce({ data: {} })
    await refreshJwtToken('refresh-1')
    expect(axios.post).toHaveBeenCalledWith(JWT_REFRESH_URL, {
      refresh: 'refresh-1',
    })
  })
})
