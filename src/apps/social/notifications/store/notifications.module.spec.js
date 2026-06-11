import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as notificationsApi from '../api/notifications'
import notificationsModule from './notifications.module'

const { pushMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
}))

vi.mock('../api/notifications', () => ({
  fetchNotifications: vi.fn(),
  markNotificationRead: vi.fn(),
}))

vi.mock('@/utils/domainUtils', () => ({
  extractDomain: vi.fn(() => 'localhost'),
}))

vi.mock('@/router', () => ({
  default: { push: pushMock },
}))

describe('social notifications module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getNotifications commits payload when authenticated', async () => {
    const commit = vi.fn()
    notificationsApi.fetchNotifications.mockResolvedValueOnce({
      data: [{ id: 1 }, { id: 2 }],
    })

    await notificationsModule.actions.getNotifications({
      commit,
      rootGetters: { 'authJWT/isAuthenticated': true },
    })

    expect(commit).toHaveBeenCalledWith('setNotifications', [{ id: 1 }, { id: 2 }])
    expect(commit).toHaveBeenCalledWith('setUnreadCount', 2)
  })

  it('getNotifications skips api when anonymous', async () => {
    const commit = vi.fn()

    await notificationsModule.actions.getNotifications({
      commit,
      rootGetters: { 'authJWT/isAuthenticated': false },
    })

    expect(notificationsApi.fetchNotifications).not.toHaveBeenCalled()
    expect(commit).not.toHaveBeenCalled()
  })

  it('getNotifications logs errors without throwing', async () => {
    const commit = vi.fn()
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    notificationsApi.fetchNotifications.mockRejectedValueOnce(new Error('network'))

    await notificationsModule.actions.getNotifications({
      commit,
      rootGetters: { 'authJWT/isAuthenticated': true },
    })

    expect(consoleSpy).toHaveBeenCalled()
    expect(commit).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('readNotification navigates to post for comment notifications', async () => {
    const commit = vi.fn()
    notificationsApi.markNotificationRead.mockResolvedValueOnce({})
    const state = { unreadCount: 2 }

    await notificationsModule.actions.readNotification(
      {
        commit,
        state,
        rootGetters: { 'socialProfileData/userSlug': 'john' },
      },
      { id: 8, type_of_notification: 'post_comment', post_id: 44 }
    )

    expect(pushMock).toHaveBeenCalledWith({
      name: 'postSocial',
      params: { id: 44 },
    })
  })

  it('readNotification logs errors without throwing', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    notificationsApi.markNotificationRead.mockRejectedValueOnce(new Error('fail'))

    await notificationsModule.actions.readNotification(
      {
        commit: vi.fn(),
        state: { unreadCount: 1 },
        rootGetters: { 'socialProfileData/userSlug': 'john' },
      },
      { id: 9, type_of_notification: 'post_like', post_id: 1 }
    )

    expect(consoleSpy).toHaveBeenCalled()
    expect(pushMock).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('readNotification navigates to post for like notifications', async () => {
    const commit = vi.fn()
    notificationsApi.markNotificationRead.mockResolvedValueOnce({})
    const state = { unreadCount: 3 }

    await notificationsModule.actions.readNotification(
      {
        commit,
        state,
        rootGetters: { 'socialProfileData/userSlug': 'john' },
      },
      { id: 5, type_of_notification: 'post_like', post_id: 99 }
    )

    expect(notificationsApi.markNotificationRead).toHaveBeenCalledWith(5)
    expect(commit).toHaveBeenCalledWith('setUnreadCount', 2)
    expect(pushMock).toHaveBeenCalledWith({
      name: 'postSocial',
      params: { id: 99 },
    })
  })

  it('readNotification navigates to chat for chat notifications', async () => {
    const commit = vi.fn()
    notificationsApi.markNotificationRead.mockResolvedValueOnce({})
    const state = { unreadCount: 1 }

    await notificationsModule.actions.readNotification(
      {
        commit,
        state,
        rootGetters: { 'socialProfileData/userSlug': 'john' },
      },
      { id: 6, type_of_notification: 'chat_message' }
    )

    expect(pushMock).toHaveBeenCalledWith({ name: 'chatSocial' })
  })

  it('readNotification navigates to friends for other notifications', async () => {
    const commit = vi.fn()
    notificationsApi.markNotificationRead.mockResolvedValueOnce({})
    const state = { unreadCount: 1 }

    await notificationsModule.actions.readNotification(
      {
        commit,
        state,
        rootGetters: { 'socialProfileData/userSlug': 'john' },
      },
      { id: 7, type_of_notification: 'friend_request' }
    )

    expect(pushMock).toHaveBeenCalledWith({
      name: 'friendsSocial',
      params: { slug: 'john' },
    })
  })

  it('connectNotificationWebSocket uses wss on https pages', () => {
    const state = { notificationWebSocket: null }
    let lastUrl
    class MockWebSocket {
      constructor(url) {
        lastUrl = url
        this.onopen = null
        this.onmessage = null
        this.onclose = null
      }
    }
    global.WebSocket = MockWebSocket
    const originalProtocol = window.location.protocol
    Object.defineProperty(window, 'location', {
      value: { protocol: 'https:' },
      configurable: true,
    })

    notificationsModule.actions.connectNotificationWebSocket({
      state,
      dispatch: vi.fn(),
      rootGetters: {
        'authJWT/isAuthenticated': true,
        'socialProfileData/user': { id: 7 },
      },
    })

    state.notificationWebSocket.onopen()
    state.notificationWebSocket.onclose()

    expect(lastUrl).toBe('wss://localhost/ws/notification/7/')
    Object.defineProperty(window, 'location', {
      value: { protocol: originalProtocol },
      configurable: true,
    })
  })

  it('connectNotificationWebSocket creates socket for authenticated user', () => {
    const state = { notificationWebSocket: null }
    let lastUrl
    class MockWebSocket {
      constructor(url) {
        lastUrl = url
        this.onopen = null
        this.onmessage = null
        this.onclose = null
      }
    }
    global.WebSocket = MockWebSocket

    notificationsModule.actions.connectNotificationWebSocket({
      state,
      dispatch: vi.fn(),
      rootGetters: {
        'authJWT/isAuthenticated': true,
        'socialProfileData/user': { id: 42 },
      },
    })

    expect(lastUrl).toBe('ws://localhost/ws/notification/42/')
  })

  it('connectNotificationWebSocket ignores empty websocket payloads', async () => {
    const state = { notificationWebSocket: null }
    const dispatch = vi.fn()
    class MockWebSocket {
      constructor() {
        state.notificationWebSocket = this
        this.onmessage = null
      }
    }
    global.WebSocket = MockWebSocket

    notificationsModule.actions.connectNotificationWebSocket({
      state,
      dispatch,
      rootGetters: {
        'authJWT/isAuthenticated': true,
        'socialProfileData/user': { id: 1 },
      },
    })

    await state.notificationWebSocket.onmessage({
      data: JSON.stringify({ message: null }),
    })

    expect(dispatch).not.toHaveBeenCalled()
  })

  it('connectNotificationWebSocket refreshes list on message', async () => {
    const state = { notificationWebSocket: null }
    const dispatch = vi.fn()
    class MockWebSocket {
      constructor() {
        state.notificationWebSocket = this
        this.onmessage = null
      }
    }
    global.WebSocket = MockWebSocket

    notificationsModule.actions.connectNotificationWebSocket({
      state,
      dispatch,
      rootGetters: {
        'authJWT/isAuthenticated': true,
        'socialProfileData/user': { id: 1 },
      },
    })

    await state.notificationWebSocket.onmessage({
      data: JSON.stringify({ message: { id: 1 } }),
    })

    expect(dispatch).toHaveBeenCalledWith('getNotifications')
  })

  it('connectNotificationWebSocket skips when anonymous', () => {
    const state = { notificationWebSocket: null }
    class MockWebSocket {
      constructor() {
        throw new Error('should not connect')
      }
    }
    global.WebSocket = MockWebSocket

    notificationsModule.actions.connectNotificationWebSocket({
      state,
      dispatch: vi.fn(),
      rootGetters: { 'authJWT/isAuthenticated': false },
    })

    expect(state.notificationWebSocket).toBeNull()
  })

  it('disconnectNotificationWebSocket closes open socket', () => {
    class MockWebSocket {}
    MockWebSocket.OPEN = 1
    global.WebSocket = MockWebSocket

    const close = vi.fn()
    const state = {
      notificationWebSocket: { readyState: WebSocket.OPEN, close },
    }

    notificationsModule.actions.disconnectNotificationWebSocket({ state })

    expect(close).toHaveBeenCalled()
  })

  it('exposes notification getters', () => {
    const state = {
      notifications: [{ id: 1 }],
      unreadCount: 1,
    }

    expect(notificationsModule.getters.notifications(state)).toEqual([{ id: 1 }])
    expect(notificationsModule.getters.unreadCount(state)).toBe(1)
  })

  it('clearNotificationData mutation resets notifications list', () => {
    const state = notificationsModule.state()
    state.notifications = [{ id: 1 }]
    state.unreadCount = 2

    notificationsModule.mutations.clearNotificationData(state)

    expect(state.notifications).toEqual([])
  })

  it('setNotifications and setUnreadCount mutations update state', () => {
    const state = notificationsModule.state()

    notificationsModule.mutations.setNotifications(state, [{ id: 3 }])
    notificationsModule.mutations.setUnreadCount(state, 4)

    expect(state.notifications).toEqual([{ id: 3 }])
    expect(state.unreadCount).toBe(4)
  })

  it('disconnectNotificationWebSocket ignores missing or closed socket', () => {
    const close = vi.fn()
    notificationsModule.actions.disconnectNotificationWebSocket({
      state: { notificationWebSocket: null },
    })
    notificationsModule.actions.disconnectNotificationWebSocket({
      state: { notificationWebSocket: { readyState: 3, close } },
    })

    expect(close).not.toHaveBeenCalled()
  })
})
