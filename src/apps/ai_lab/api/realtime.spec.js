import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { REALTIME_WS_URL, fetchRealtimeToken } from './realtime'

vi.mock('axios', () => ({
  default: { post: vi.fn() },
}))

describe('ai-lab realtime api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchRealtimeToken posts to realtime-token endpoint', async () => {
    axios.post.mockResolvedValueOnce({ data: {} })
    await fetchRealtimeToken()
    expect(axios.post).toHaveBeenCalledWith('/ai-lab/realtime-token/')
  })

  it('exposes realtime websocket url constant', () => {
    expect(REALTIME_WS_URL).toContain('wss://api.openai.com/v1/realtime')
  })
})
