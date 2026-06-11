import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as chatApi from '../api/chat'
import * as imageApi from '../api/image'
import * as realtimeApi from '../api/realtime'
import * as voiceApi from '../api/voice'
import aiLabModule from './aiLab.module'

vi.mock('../api/chat', () => ({
  sendChatMessage: vi.fn(),
}))

vi.mock('../api/image', () => ({
  generateImage: vi.fn(),
  downloadImage: vi.fn(),
  deleteVisionImage: vi.fn(),
  uploadVisionImages: vi.fn(),
}))

vi.mock('../api/voice', () => ({
  generateVoice: vi.fn(),
}))

vi.mock('../api/realtime', () => ({
  fetchRealtimeToken: vi.fn(),
  REALTIME_WS_URL: 'wss://api.openai.com/v1/realtime?model=test',
}))

describe('ai-lab module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getChatMessage commits response message', async () => {
    const commit = vi.fn()
    chatApi.sendChatMessage.mockResolvedValueOnce({ data: { message: 'hi' } })

    await aiLabModule.actions.getChatMessage(
      { commit, state: { promptImages: [] } },
      'hello'
    )

    expect(chatApi.sendChatMessage).toHaveBeenCalledWith('hello', [])
    expect(commit).toHaveBeenCalledWith('setChatMessage', 'hi')
  })

  it('getChatMessage sets error message on failure', async () => {
    const commit = vi.fn()
    const error = { response: { data: { message: 'rate limit' } } }
    chatApi.sendChatMessage.mockRejectedValueOnce(error)

    await aiLabModule.actions.getChatMessage(
      { commit, state: { promptImages: [] } },
      'hello'
    )

    expect(commit).toHaveBeenCalledWith('setErrorMessage', error)
  })

  it('getImageMessage sets error on failure', async () => {
    const commit = vi.fn()
    const error = { response: { data: { message: 'bad prompt' } } }
    imageApi.generateImage.mockRejectedValueOnce(error)

    await aiLabModule.actions.getImageMessage({ commit }, 'draw cat')

    expect(commit).toHaveBeenCalledWith('setErrorMessage', error)
  })

  it('getImageMessage commits image url', async () => {
    const commit = vi.fn()
    imageApi.generateImage.mockResolvedValueOnce({
      data: { message: 'https://img.test/a.png' },
    })

    await aiLabModule.actions.getImageMessage({ commit }, 'draw cat')

    expect(commit).toHaveBeenCalledWith('setImageURL', 'https://img.test/a.png')
  })

  it('getVoiceMessage sets error on failure', async () => {
    const commit = vi.fn()
    const error = { response: { data: { message: 'voice failed' } } }
    voiceApi.generateVoice.mockRejectedValueOnce(error)

    await aiLabModule.actions.getVoiceMessage({ commit }, 'say hi')

    expect(commit).toHaveBeenCalledWith('setErrorMessage', error)
  })

  it('getVoiceMessage commits audio url', async () => {
    const commit = vi.fn()
    voiceApi.generateVoice.mockResolvedValueOnce({
      data: { message: 'https://audio.test/a.mp3' },
    })

    await aiLabModule.actions.getVoiceMessage({ commit }, 'say hi')

    expect(commit).toHaveBeenCalledWith('setVoiceMessage', 'https://audio.test/a.mp3')
  })

  it('deletePromptImage removes image after api call', async () => {
    const state = aiLabModule.state()
    state.promptImages = ['https://cdn.test/cat.png']
    const commit = (type, payload) => aiLabModule.mutations[type](state, payload)
    imageApi.deleteVisionImage.mockResolvedValueOnce({})

    await aiLabModule.actions.deletePromptImage({ commit, state }, 0)

    expect(imageApi.deleteVisionImage).toHaveBeenCalledWith('cat.png')
    expect(state.promptImages).toEqual([])
  })

  it('deletePromptImage logs errors without throwing', async () => {
    const state = aiLabModule.state()
    state.promptImages = ['https://cdn.test/cat.png']
    const commit = (type, payload) => aiLabModule.mutations[type](state, payload)
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    imageApi.deleteVisionImage.mockRejectedValueOnce(new Error('delete failed'))

    await aiLabModule.actions.deletePromptImage({ commit, state }, 0)

    expect(consoleSpy).toHaveBeenCalled()
    expect(state.promptImages).toHaveLength(1)
    consoleSpy.mockRestore()
  })

  it('uploadPromptImages commits uploaded urls', async () => {
    const commit = vi.fn()
    imageApi.uploadVisionImages.mockResolvedValueOnce({
      data: { uploaded_images: ['https://cdn.test/new.png'] },
    })

    await aiLabModule.actions.uploadPromptImages(
      { commit },
      [{ file: new Blob(['x']) }]
    )

    expect(commit).toHaveBeenCalledWith('setPromptImages', [
      'https://cdn.test/new.png',
    ])
  })

  it('getRealtimeChatMessage warns when socket is not ready', () => {
    const commit = vi.fn()
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const state = { realtimeChatWebSocket: null }

    aiLabModule.actions.getRealtimeChatMessage({ state, commit }, 'hello')

    expect(consoleSpy).toHaveBeenCalledWith('WebSocket is not ready')
    expect(commit).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('getRealtimeChatMessage sends events when socket is open', () => {
    const commit = vi.fn()
    const send = vi.fn()
    const state = {
      realtimeChatWebSocket: { readyState: 1, send },
    }

    aiLabModule.actions.getRealtimeChatMessage({ state, commit }, 'hello')

    expect(commit).toHaveBeenCalledWith('setRealtimeChatMessages', {
      sender: 'me',
      message: 'hello',
    })
    expect(commit).toHaveBeenCalledWith('setIsLoading', true, { root: true })
    expect(send).toHaveBeenCalledTimes(2)
  })

  it('connectRealtimeChatSocket handles assistant transcript messages', async () => {
    const state = { realtimeChatWebSocket: null }
    const commit = vi.fn()
    realtimeApi.fetchRealtimeToken.mockResolvedValueOnce({
      data: { client_secret: { value: 'ephemeral-key' } },
    })

    class MockWebSocket {
      constructor() {
        this.onopen = null
        this.onmessage = null
        queueMicrotask(() => this.onopen?.())
      }
    }
    global.WebSocket = MockWebSocket

    await aiLabModule.actions.connectRealtimeChatSocket({ state, commit })
    state.realtimeChatWebSocket.onmessage({
      data: JSON.stringify({
        type: 'response.done',
        response: { output: [{ content: [{ transcript: 'hello back' }] }] },
      }),
    })

    expect(commit).toHaveBeenCalledWith('setRealtimeChatMessages', {
      sender: 'chat',
      message: 'hello back',
    })
    expect(commit).toHaveBeenCalledWith('setIsLoading', false, { root: true })
  })

  it('connectRealtimeChatSocket resolves when websocket opens', async () => {
    const state = { realtimeChatWebSocket: null }
    const commit = vi.fn()
    realtimeApi.fetchRealtimeToken.mockResolvedValueOnce({
      data: { client_secret: { value: 'ephemeral-key' } },
    })

    class MockWebSocket {
      constructor(url, protocols) {
        this.url = url
        this.protocols = protocols
        this.onopen = null
        this.onerror = null
        this.onmessage = null
        this.onclose = null
        queueMicrotask(() => this.onopen?.())
      }
    }
    global.WebSocket = MockWebSocket

    await aiLabModule.actions.connectRealtimeChatSocket({ state, commit })

    expect(state.realtimeChatWebSocket).toBeTruthy()
    expect(state.realtimeChatWebSocket.url).toBe(realtimeApi.REALTIME_WS_URL)
  })

  it('clearErrorMessage mutation resets error state', () => {
    const state = aiLabModule.state()
    state.errorMessage = 'oops'
    aiLabModule.mutations.clearErrorMessage(state)
    expect(state.errorMessage).toBeNull()
  })

  it('setErrorMessage mutation formats api error', () => {
    const state = aiLabModule.state()
    aiLabModule.mutations.setErrorMessage(state, {
      response: { data: { message: 'Quota exceeded' } },
    })

    expect(state.errorMessage).toContain('Quota exceeded')
  })

  it('exposes ai-lab getters', () => {
    const state = {
      message: 'hi',
      imageURL: 'img',
      voiceMessage: 'voice',
      errorMessage: null,
      promptImages: ['a'],
      realtimeChatMessages: [{ sender: 'me', message: 'x' }],
    }

    expect(aiLabModule.getters.message(state)).toBe('hi')
    expect(aiLabModule.getters.imageURL(state)).toBe('img')
    expect(aiLabModule.getters.voiceMessage(state)).toBe('voice')
    expect(aiLabModule.getters.promptImages(state)).toEqual(['a'])
    expect(aiLabModule.getters.realtimeChatMessages(state)).toEqual([
      { sender: 'me', message: 'x' },
    ])
  })
})
