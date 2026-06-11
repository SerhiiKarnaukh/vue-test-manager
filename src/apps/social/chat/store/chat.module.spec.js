import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as chatApi from '../api/chat'
import chatModule from './chat.module'

vi.mock('../api/chat', () => ({
  fetchConversations: vi.fn(),
  fetchChatMessages: vi.fn(),
  getOrCreateChat: vi.fn(),
  sendChatMessage: vi.fn(),
}))

vi.mock('@/utils/domainUtils', () => ({
  extractDomain: vi.fn(() => 'localhost'),
}))

describe('social chat module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getConversations skips active thread when list is empty', async () => {
    const state = chatModule.state()
    const commit = (type, payload) => chatModule.mutations[type](state, payload)
    const dispatch = vi.fn()
    chatApi.fetchConversations.mockResolvedValueOnce({ data: [] })

    await chatModule.actions.getConversations({ state, commit, dispatch })

    expect(state.conversations).toEqual([])
    expect(dispatch).not.toHaveBeenCalledWith('connectWebSocket', expect.anything())
    expect(dispatch).toHaveBeenCalledWith('getChatMessages')
  })

  it('getConversations commits list and selects first thread', async () => {
    const state = chatModule.state()
    const commit = (type, payload) => chatModule.mutations[type](state, payload)
    const dispatch = vi.fn()
    chatApi.fetchConversations.mockResolvedValueOnce({
      data: [{ id: 1, users: [] }],
    })

    await chatModule.actions.getConversations({ state, commit, dispatch })

    expect(state.conversations).toEqual([{ id: 1, users: [] }])
    expect(state.activeConversation).toBe(1)
    expect(dispatch).toHaveBeenCalledWith('disconnectWebSocket')
    expect(dispatch).toHaveBeenCalledWith('connectWebSocket', 1)
    expect(dispatch).toHaveBeenCalledWith('getChatMessages')
  })

  it('getChatMessages commits conversation payload', async () => {
    const commit = vi.fn()
    const state = { activeConversation: 3 }
    chatApi.fetchChatMessages.mockResolvedValueOnce({
      data: { id: 3, messages: [] },
    })

    await chatModule.actions.getChatMessages({ state, commit })

    expect(chatApi.fetchChatMessages).toHaveBeenCalledWith(3)
    expect(commit).toHaveBeenCalledWith('setActiveConversation', {
      id: 3,
      messages: [],
    })
  })

  it('getOrCreateChat calls api on success', async () => {
    chatApi.getOrCreateChat.mockResolvedValueOnce({ data: {} })

    await chatModule.actions.getOrCreateChat({ dispatch: vi.fn() }, 'john')

    expect(chatApi.getOrCreateChat).toHaveBeenCalledWith('john')
  })

  it('getOrCreateChat shows alert on failure', async () => {
    const dispatch = vi.fn()
    const error = new Error('unauthorized')
    chatApi.getOrCreateChat.mockRejectedValueOnce(error)

    await expect(
      chatModule.actions.getOrCreateChat({ dispatch }, 'john')
    ).rejects.toBe(error)

    expect(dispatch).toHaveBeenCalledWith(
      'alert/setMessage',
      { value: ['You must be logged in!'], type: 'error' },
      { root: true }
    )
  })

  it('submitChatForm delegates to api', async () => {
    chatApi.sendChatMessage.mockResolvedValueOnce({})
    const state = { activeConversation: { id: 9 } }

    await chatModule.actions.submitChatForm({ state }, 'hello')

    expect(chatApi.sendChatMessage).toHaveBeenCalledWith(9, 'hello')
  })

  it('submitChatForm rejects on api error', async () => {
    const error = new Error('failed')
    chatApi.sendChatMessage.mockRejectedValueOnce(error)
    const state = { activeConversation: { id: 9 } }

    await expect(
      chatModule.actions.submitChatForm({ state }, 'hello')
    ).rejects.toBe(error)
  })

  it('disconnectWebSocket closes open socket', () => {
    const close = vi.fn()
    const state = {
      chatWebSocket: { readyState: 1, close },
    }

    chatModule.actions.disconnectWebSocket({ state })

    expect(close).toHaveBeenCalled()
  })

  it('disconnectWebSocket ignores missing or closed socket', () => {
    const close = vi.fn()
    chatModule.actions.disconnectWebSocket({ state: { chatWebSocket: null } })
    chatModule.actions.disconnectWebSocket({
      state: { chatWebSocket: { readyState: 3, close } },
    })

    expect(close).not.toHaveBeenCalled()
  })

  it('getChatMessages logs errors without throwing', async () => {
    const commit = vi.fn()
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    chatApi.fetchChatMessages.mockRejectedValueOnce(new Error('network'))

    await chatModule.actions.getChatMessages({
      state: { activeConversation: 2 },
      commit,
    })

    expect(consoleSpy).toHaveBeenCalled()
    expect(commit).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('getConversations logs errors without throwing', async () => {
    const commit = vi.fn()
    const dispatch = vi.fn()
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    chatApi.fetchConversations.mockRejectedValueOnce(new Error('network'))

    await chatModule.actions.getConversations({
      state: chatModule.state(),
      commit,
      dispatch,
    })

    expect(consoleSpy).toHaveBeenCalled()
    expect(commit).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('connectWebSocket skips when conversation id is missing', () => {
    const state = { chatWebSocket: null, activeConversation: { messages: [] } }
    class MockWebSocket {
      constructor(url) {
        this.url = url
      }
    }
    global.WebSocket = MockWebSocket

    chatModule.actions.connectWebSocket(
      {
        state,
        rootGetters: { 'socialProfileData/userId': 1 },
      },
      null
    )

    expect(state.chatWebSocket).toBeNull()
  })

  it('connectWebSocket creates socket for conversation', () => {
    const state = { chatWebSocket: null, activeConversation: { messages: [] } }
    let lastUrl
    class MockWebSocket {
      constructor(url) {
        lastUrl = url
        this.onopen = null
        this.onmessage = null
        this.onclose = null
      }
    }
    MockWebSocket.OPEN = 1
    global.WebSocket = MockWebSocket

    chatModule.actions.connectWebSocket(
      {
        state,
        rootGetters: { 'socialProfileData/userId': 42 },
      },
      5
    )

    expect(lastUrl).toBe('ws://localhost/ws/social-chat/5/42/')
  })

  it('connectWebSocket appends incoming messages', () => {
    const state = {
      chatWebSocket: null,
      activeConversation: { messages: [] },
    }
    class MockWebSocket {
      constructor() {
        state.chatWebSocket = this
        this.onopen = null
        this.onmessage = null
        this.onclose = null
      }
    }
    global.WebSocket = MockWebSocket

    chatModule.actions.connectWebSocket(
      {
        state,
        rootGetters: { 'socialProfileData/userId': 1 },
      },
      2
    )

    state.chatWebSocket.onmessage({
      data: JSON.stringify({ message: { id: 10, body: 'hi' } }),
    })

    expect(state.activeConversation.messages).toEqual([{ id: 10, body: 'hi' }])
  })

  it('connectWebSocket ignores empty websocket payloads', () => {
    const state = {
      chatWebSocket: null,
      activeConversation: { messages: [] },
    }
    class MockWebSocket {
      constructor() {
        state.chatWebSocket = this
        this.onmessage = null
      }
    }
    global.WebSocket = MockWebSocket

    chatModule.actions.connectWebSocket(
      {
        state,
        rootGetters: { 'socialProfileData/userId': 1 },
      },
      2
    )

    state.chatWebSocket.onmessage({ data: JSON.stringify({ message: null }) })

    expect(state.activeConversation.messages).toEqual([])
  })

  it('exposes chat getters', () => {
    const state = {
      conversations: [{ id: 1 }],
      activeConversation: { id: 1 },
    }

    expect(chatModule.getters.conversations(state)).toEqual([{ id: 1 }])
    expect(chatModule.getters.activeConversation(state)).toEqual({ id: 1 })
  })

  it('clearChatData mutation resets state', () => {
    const state = chatModule.state()
    state.conversations = [{ id: 1 }]
    state.activeConversation = { id: 1 }
    state.chatWebSocket = {}

    chatModule.mutations.clearChatData(state)

    expect(state.conversations).toEqual([])
    expect(state.activeConversation).toEqual({})
    expect(state.chatWebSocket).toBeNull()
  })
})
