import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import {
  fetchChatMessages,
  fetchConversations,
  getOrCreateChat,
  sendChatMessage,
} from './chat'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('social chat api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchConversations calls list endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })
    await fetchConversations()
    expect(axios.get).toHaveBeenCalledWith('/api/social-chat/')
  })

  it('fetchChatMessages calls conversation endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: {} })
    await fetchChatMessages(5)
    expect(axios.get).toHaveBeenCalledWith('/api/social-chat/5/')
  })

  it('getOrCreateChat calls get-or-create endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: {} })
    await getOrCreateChat('john')
    expect(axios.get).toHaveBeenCalledWith('/api/social-chat/john/get-or-create/')
  })

  it('sendChatMessage posts message body', async () => {
    axios.post.mockResolvedValueOnce({ data: {} })
    await sendChatMessage(7, 'hello')
    expect(axios.post).toHaveBeenCalledWith('/api/social-chat/7/send/', {
      body: 'hello',
    })
  })
})
