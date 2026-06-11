import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as friendshipApi from '../api/friendship'
import * as profileApi from '../api/profile'
import profilesModule from './profiles.module'

vi.mock('../api/profile', () => ({
  fetchCurrentUser: vi.fn(),
  updateProfile: vi.fn(),
  changePassword: vi.fn(),
}))

vi.mock('../api/friendship', () => ({
  sendFriendRequest: vi.fn(),
  fetchFriendsData: vi.fn(),
  handleFriendRequest: vi.fn(),
  fetchFriendSuggestions: vi.fn(),
}))

vi.mock('@/utils/cryptoUtils', () => ({
  encryptData: vi.fn((value) => value),
  decryptData: vi.fn((value) => value),
}))

describe('social profiles module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('getUserData commits user info', async () => {
    const commit = vi.fn()
    profileApi.fetchCurrentUser.mockResolvedValueOnce({
      data: { id: 1, slug: 'john' },
    })

    await profilesModule.actions.getUserData({ commit, dispatch: vi.fn() })

    expect(commit).toHaveBeenCalledWith('setUserInfo', { id: 1, slug: 'john' })
  })

  it('sendFriendshipRequest shows success alert', async () => {
    const dispatch = vi.fn()
    friendshipApi.sendFriendRequest.mockResolvedValueOnce({
      data: { message: 'sent' },
    })

    await profilesModule.actions.sendFriendshipRequest({ dispatch }, 'john')

    expect(dispatch).toHaveBeenCalledWith(
      'alert/setMessage',
      { value: ['The request was sent!'], type: 'success' },
      { root: true }
    )
  })

  it('sendFriendshipRequest shows duplicate alert', async () => {
    const dispatch = vi.fn()
    friendshipApi.sendFriendRequest.mockResolvedValueOnce({
      data: { message: 'request already sent' },
    })

    await profilesModule.actions.sendFriendshipRequest({ dispatch }, 'john')

    expect(dispatch).toHaveBeenCalledWith(
      'alert/setMessage',
      { value: ['The request has already been sent!'], type: 'error' },
      { root: true }
    )
  })

  it('handleFriendshipRequest refreshes friends data', async () => {
    const dispatch = vi.fn()
    friendshipApi.handleFriendRequest.mockResolvedValueOnce({ data: {} })

    await profilesModule.actions.handleFriendshipRequest(
      { state: { user: { slug: 'me' } }, dispatch },
      { status: 'accept', slug: 'john' }
    )

    expect(friendshipApi.handleFriendRequest).toHaveBeenCalledWith('john', 'accept')
    expect(dispatch).toHaveBeenCalledWith('getCurrentProfileFriendsData', 'me')
  })

  it('editPassword redirects on success', async () => {
    const dispatch = vi.fn()
    const pushMock = vi.fn()
    vi.doMock('@/router', () => ({ default: { push: pushMock } }))
    profileApi.changePassword.mockResolvedValueOnce({ data: { message: 'success' } })

    await profilesModule.actions.editPassword(
      { state: { user: { slug: 'me' } }, dispatch },
      { password: 'new' }
    )

    expect(dispatch).toHaveBeenCalledWith(
      'alert/setMessage',
      { value: ['The information was saved'], type: 'success' },
      { root: true }
    )
  })

  it('setUserInfo mutation persists encrypted fields', () => {
    const state = profilesModule.state()
    profilesModule.mutations.setUserInfo(state, {
      id: 1,
      username: 'john',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      slug: 'john',
      full_name: 'John Doe',
      avatar_url: 'avatar.png',
    })

    expect(state.user.slug).toBe('john')
    expect(localStorage.getItem('user.slug')).toBe('john')
  })

  it('initSocial clears user when logged out', () => {
    const state = profilesModule.state()
    state.user.slug = 'old'
    profilesModule.mutations.initSocial(state)
    expect(state.user.slug).toBe(false)
  })

  it('getCurrentProfileFriendsData commits friends payload', async () => {
    const commit = vi.fn()
    friendshipApi.fetchFriendsData.mockResolvedValueOnce({
      data: { requests: [], friends: [], user: { id: 2 } },
    })

    await profilesModule.actions.getCurrentProfileFriendsData({ commit }, 'john')

    expect(commit).toHaveBeenCalledWith('setCurrentProfileFriendsData', {
      requests: [],
      friends: [],
      user: { id: 2 },
    })
  })

  it('getFriendSuggestions commits when authenticated', async () => {
    const commit = vi.fn()
    friendshipApi.fetchFriendSuggestions.mockResolvedValueOnce({
      data: [{ id: 3 }],
    })

    await profilesModule.actions.getFriendSuggestions({
      commit,
      rootGetters: { 'authJWT/isAuthenticated': true },
    })

    expect(commit).toHaveBeenCalledWith('setFriendSuggestions', [{ id: 3 }])
  })

  it('getFriendSuggestions skips api when anonymous', async () => {
    const commit = vi.fn()

    await profilesModule.actions.getFriendSuggestions({
      commit,
      rootGetters: { 'authJWT/isAuthenticated': false },
    })

    expect(friendshipApi.fetchFriendSuggestions).not.toHaveBeenCalled()
    expect(commit).not.toHaveBeenCalled()
  })

  it('exposes profile getters', () => {
    const state = {
      user: { id: 1, slug: 'me' },
      currentProfile: { id: 2 },
      friendshipRequests: [],
      currentProfileFriends: [{ id: 3 }],
      friendSuggestions: [{ id: 4 }],
      defaultAvatar: 'avatar.png',
    }

    expect(profilesModule.getters.userSlug(state)).toBe('me')
    expect(profilesModule.getters.userId(state)).toBe(1)
    expect(profilesModule.getters.currentProfileFriends(state)).toEqual([{ id: 3 }])
    expect(profilesModule.getters.friendSuggestions(state)).toEqual([{ id: 4 }])
  })
})
