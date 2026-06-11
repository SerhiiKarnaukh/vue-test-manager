import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { sendChatMessage } from './chat'

vi.mock('axios', () => ({
  default: { post: vi.fn() },
}))

describe('ai-lab chat api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sendChatMessage posts question and prompt images', async () => {
    axios.post.mockResolvedValueOnce({ data: {} })
    await sendChatMessage('hello', ['img.png'])
    expect(axios.post).toHaveBeenCalledWith('/ai-lab/', {
      question: 'hello',
      prompt_images: ['img.png'],
    })
  })
})
