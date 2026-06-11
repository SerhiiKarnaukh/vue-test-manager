import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import authJwtModule from './authJWT.module'

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    defaults: { headers: { common: {} } },
  },
}))

vi.mock('@/utils/error', () => ({
  error: () => ['Invalid credentials'],
}))

describe('authJWT module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    authJwtModule.state.accessToken = null
    authJwtModule.state.refreshToken = null
    authJwtModule.state.activeApp = null
  })

  it('login stores tokens and commits success', async () => {
    const commit = vi.fn()
    const dispatch = vi.fn()
    axios.post.mockResolvedValueOnce({
      data: { access: 'access-1', refresh: 'refresh-1' },
    })

    await authJwtModule.actions.login(
      { commit, dispatch },
      {
        email: 'user@example.com',
        password: 'secret',
        login_source: 'taberna',
        activeApp: 'taberna',
      }
    )

    expect(axios.post).toHaveBeenCalledWith(
      '/taberna-profiles/api/v1/token/',
      expect.objectContaining({ email: 'user@example.com' })
    )
    expect(localStorage.getItem('access')).toBe('access-1')
    expect(localStorage.getItem('refresh')).toBe('refresh-1')
    expect(commit).toHaveBeenCalledWith('authSuccess', 'access-1')
    expect(commit).toHaveBeenCalledWith('setActiveApp', 'taberna')
    expect(commit).toHaveBeenCalledWith('alert/clearMessage', null, { root: true })
  })

  it('login dispatches alert on failure', async () => {
    const commit = vi.fn()
    const dispatch = vi.fn()
    const apiError = { response: { data: { detail: ['bad'] } } }
    axios.post.mockRejectedValueOnce(apiError)

    await expect(
      authJwtModule.actions.login({ commit, dispatch }, { email: 'x', password: 'y' })
    ).rejects.toBe(apiError)

    expect(dispatch).toHaveBeenCalledWith(
      'alert/setMessage',
      { value: ['Invalid credentials'], type: 'error' },
      { root: true }
    )
    expect(localStorage.getItem('access')).toBeNull()
  })

  it('logout clears storage and auth state', async () => {
    const commit = vi.fn()
    localStorage.setItem('access', 'a')
    axios.defaults.headers.common.Authorization = 'Bearer a'

    await authJwtModule.actions.logout({ commit })

    expect(localStorage.getItem('access')).toBeNull()
    expect(commit).toHaveBeenCalledWith('authLogout')
    expect(axios.defaults.headers.common.Authorization).toBeUndefined()
  })

  it('refreshToken updates access token on success', async () => {
    const commit = vi.fn()
    localStorage.setItem('refresh', 'refresh-1')
    axios.post.mockResolvedValueOnce({ data: { access: 'access-2' } })

    const response = await authJwtModule.actions.refreshToken({ commit })

    expect(response.data.access).toBe('access-2')
    expect(localStorage.getItem('access')).toBe('access-2')
    expect(commit).toHaveBeenCalledWith('authSuccess', 'access-2')
  })

  it('refreshToken clears auth on failure', async () => {
    const commit = vi.fn()
    localStorage.setItem('refresh', 'refresh-1')
    axios.post.mockRejectedValueOnce(new Error('expired'))

    await expect(authJwtModule.actions.refreshToken({ commit })).rejects.toThrow(
      'expired'
    )

    expect(localStorage.getItem('access')).toBeNull()
    expect(commit).toHaveBeenCalledWith('authLogout')
  })

  it('checkActiveApp logs out when app changes', async () => {
    const dispatch = vi.fn()
    authJwtModule.state.activeApp = 'taberna'

    await authJwtModule.actions.checkActiveApp(
      { commit: vi.fn(), dispatch },
      'social'
    )

    expect(dispatch).toHaveBeenCalledWith('logout')
  })

  it('checkActiveApp does nothing when app matches', async () => {
    const dispatch = vi.fn()
    authJwtModule.state.activeApp = 'taberna'

    await authJwtModule.actions.checkActiveApp(
      { commit: vi.fn(), dispatch },
      'taberna'
    )

    expect(dispatch).not.toHaveBeenCalled()
  })

  it('isAuthenticated reflects access token presence', () => {
    authJwtModule.state.accessToken = null
    expect(authJwtModule.getters.isAuthenticated(authJwtModule.state)).toBe(false)

    authJwtModule.state.accessToken = 'token'
    expect(authJwtModule.getters.isAuthenticated(authJwtModule.state)).toBe(true)
  })
})
