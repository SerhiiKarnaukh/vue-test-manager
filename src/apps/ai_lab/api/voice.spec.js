import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { generateVoice } from './voice'

vi.mock('axios', () => ({
  default: { post: vi.fn() },
}))

describe('ai-lab voice api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('generateVoice posts question', async () => {
    axios.post.mockResolvedValueOnce({ data: {} })
    await generateVoice('say hello')
    expect(axios.post).toHaveBeenCalledWith('/ai-lab/voice-generator/', {
      question: 'say hello',
    })
  })
})
