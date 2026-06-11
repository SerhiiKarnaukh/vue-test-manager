import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import * as tokenApi from '../api/token'
import authTokenModule from './authToken.module'

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    defaults: { headers: { common: {} } },
  },
}))

vi.mock('../api/token', () => ({
  loginWithToken: vi.fn(),
  logoutWithToken: vi.fn(),
  registerUser: vi.fn(),
  resolveRegisterUrl: vi.fn(),
}))

vi.mock('@/utils/error', () => ({
  error: () => ['Registration failed'],
}))

describe('authToken module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('login stores token and clears alert', async () => {
    const commit = vi.fn()
    const dispatch = vi.fn()
    tokenApi.loginWithToken.mockResolvedValueOnce({
      data: { auth_token: 'token-1' },
    })

    await authTokenModule.actions.login(
      { commit, dispatch },
      { email: 'user@example.com', password: 'secret' }
    )

    expect(tokenApi.loginWithToken).toHaveBeenCalled()
    expect(commit).toHaveBeenCalledWith('setToken', 'token-1')
    expect(commit).toHaveBeenCalledWith('alert/clearMessage', null, { root: true })
  })

  it('login dispatches alert on failure', async () => {
    const commit = vi.fn()
    const dispatch = vi.fn()
    tokenApi.loginWithToken.mockRejectedValueOnce({
      response: { data: { detail: ['bad'] } },
    })

    await expect(
      authTokenModule.actions.login({ commit, dispatch }, { email: 'x', password: 'y' })
    ).rejects.toThrow()

    expect(dispatch).toHaveBeenCalledWith(
      'alert/setMessage',
      { value: ['Registration failed'], type: 'error' },
      { root: true }
    )
  })

  it('setToken and removeToken mutations sync localStorage', () => {
    const state = { token: null }
    authTokenModule.mutations.setToken(state, 'token-1')
    expect(state.token).toBe('token-1')
    expect(localStorage.getItem('token')).toBe('token-1')

    authTokenModule.mutations.removeToken(state)
    expect(state.token).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('token getter returns state token', () => {
    expect(authTokenModule.getters.token({ token: 'abc' })).toBe('abc')
  })

  it('logout removes token on success', async () => {
    const commit = vi.fn()
    const dispatch = vi.fn()
    localStorage.setItem('token', 'token-1')
    tokenApi.logoutWithToken.mockResolvedValueOnce({})

    await authTokenModule.actions.logout({
      commit,
      dispatch,
      getters: { token: 'token-1' },
    })

    expect(tokenApi.logoutWithToken).toHaveBeenCalledWith('token-1')
    expect(commit).toHaveBeenCalledWith('removeToken')
    expect(axios.defaults.headers.common.Authorization).toBe('')
  })

  it('logout dispatches alert when API returns error response', async () => {
    const commit = vi.fn()
    const dispatch = vi.fn()
    tokenApi.logoutWithToken.mockRejectedValueOnce({
      response: { data: { detail: ['invalid'] } },
    })

    await authTokenModule.actions.logout({
      commit,
      dispatch,
      getters: { token: 'token-1' },
    })

    expect(dispatch).toHaveBeenCalledWith(
      'alert/setMessage',
      { value: ['Registration failed'], type: 'error' },
      { root: true }
    )
  })

  it('logout dispatches generic alert when request fails without response', async () => {
    const commit = vi.fn()
    const dispatch = vi.fn()
    tokenApi.logoutWithToken.mockRejectedValueOnce(new Error('network'))

    await authTokenModule.actions.logout({
      commit,
      dispatch,
      getters: { token: 'token-1' },
    })

    expect(dispatch).toHaveBeenCalledWith(
      'alert/setMessage',
      {
        value: ['Something went wrong. Please try again'],
        type: 'error',
      },
      { root: true }
    )
  })

  it('register dispatches success message for taberna', async () => {
    const dispatch = vi.fn()
    tokenApi.resolveRegisterUrl.mockReturnValue('/taberna-profiles/api/register/')
    tokenApi.registerUser.mockResolvedValueOnce({ data: {} })

    await authTokenModule.actions.register(
      { dispatch },
      {
        email: 'user@example.com',
        registration_source: 'taberna',
      }
    )

    expect(tokenApi.resolveRegisterUrl).toHaveBeenCalledWith('taberna')
    expect(tokenApi.registerUser).toHaveBeenCalledWith(
      '/taberna-profiles/api/register/',
      expect.objectContaining({ email: 'user@example.com' })
    )
    expect(dispatch).toHaveBeenCalledWith(
      'alert/setMessage',
      expect.objectContaining({ type: 'success' }),
      { root: true }
    )
  })

  it('register uses social profile success message', async () => {
    const dispatch = vi.fn()
    tokenApi.resolveRegisterUrl.mockReturnValue('/api/social-profiles/register/')
    tokenApi.registerUser.mockResolvedValueOnce({
      data: { detail: 'social_profile_created' },
    })

    await authTokenModule.actions.register(
      { dispatch },
      {
        email: 'user@example.com',
        registration_source: 'social_network',
      }
    )

    expect(dispatch).toHaveBeenCalledWith(
      'alert/setMessage',
      {
        value: ['Yor Social Profile created'],
        type: 'success',
      },
      { root: true }
    )
  })

  it('register dispatches alert on failure', async () => {
    const dispatch = vi.fn()
    tokenApi.resolveRegisterUrl.mockReturnValue('/taberna-profiles/api/register/')
    tokenApi.registerUser.mockRejectedValueOnce({
      response: { data: { email: ['already taken'] } },
    })

    await expect(
      authTokenModule.actions.register(
        { dispatch },
        { email: 'user@example.com', registration_source: 'taberna' }
      )
    ).rejects.toThrow()

    expect(dispatch).toHaveBeenCalledWith(
      'alert/setMessage',
      { value: ['Registration failed'], type: 'error' },
      { root: true }
    )
  })

  it('isAuthenticated reflects token presence', () => {
    expect(
      authTokenModule.getters.isAuthenticated(authTokenModule.state, {
        token: null,
      })
    ).toBe(false)
    expect(
      authTokenModule.getters.isAuthenticated(authTokenModule.state, {
        token: 'token-1',
      })
    ).toBe(true)
  })
})
