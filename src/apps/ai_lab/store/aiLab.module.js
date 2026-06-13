import * as chatApi from '../api/chat'
import * as imageApi from '../api/image'
import * as realtimeApi from '../api/realtime'
import * as voiceApi from '../api/voice'

function formatApiErrorMessage(error) {
  const data = error.response?.data
  if (!data?.message) return null

  const isQuotaExceeded =
    error.response?.status === 402 ||
    data.error_code === 'openai_quota_exceeded'

  return isQuotaExceeded
    ? data.message
    : `${data.message} Please contact the site administrator if the issue persists.`
}

const state = () => ({
  message: null,
  imageURL: null,
  voiceMessage: null,
  errorMessage: null,
  promptImages: [],
  realtimeChatWebSocket: null,
  realtimeSessionReady: false,
  realtimeChatMessages: [],
})

const mutations = {
  setChatMessage(state, message) {
    state.message = message
  },
  setImageURL(state, message) {
    state.imageURL = message
  },
  setVoiceMessage(state, message) {
    state.voiceMessage = message
  },
  setPromptImages(state, images) {
    state.promptImages = [...state.promptImages, ...images]
  },
  removePromptImage(state, index) {
    state.promptImages.splice(index, 1)
  },
  setErrorMessage(state, error) {
    const message = formatApiErrorMessage(error)
    if (message) {
      state.errorMessage = message
    }
  },
  clearErrorMessage(state) {
    state.errorMessage = null
  },
  setRealtimeChatMessages(state, payload) {
    const { sender, message } = payload
    state.realtimeChatMessages.push({ sender, message })
  },
}

const actions = {
  reportApiError({ commit, dispatch }, error) {
    const message = formatApiErrorMessage(error)
    if (!message) return

    commit('setErrorMessage', error)
    dispatch(
      'alert/setMessage',
      { value: [message], type: 'error' },
      { root: true }
    )
  },
  async getChatMessage({ commit, dispatch, state }, question) {
    try {
      const response = await chatApi.sendChatMessage(question, state.promptImages)
      commit('setChatMessage', response.data.message)
    } catch (error) {
      console.log(error)
      dispatch('reportApiError', error)
    }
  },
  async connectRealtimeChatSocket({ state, commit, dispatch }) {
    return new Promise(async (resolve, reject) => {
      let resolved = false
      try {
        const response = await realtimeApi.fetchRealtimeToken()
        const ephemeralKey = response.data.client_secret.value
        const ws = new WebSocket(realtimeApi.REALTIME_WS_URL, [
          'realtime',
          'openai-insecure-api-key.' + ephemeralKey,
        ])

        ws.onopen = () => {
          console.log('✅ WebSocket connected')
          state.realtimeChatWebSocket = ws
        }

        ws.onerror = (e) => {
          console.error('❌ WebSocket error:', e)
          if (!resolved) {
            resolved = true
            reject(e)
          }
        }

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data)

          if (data.type === 'session.created' || data.type === 'session.updated') {
            state.realtimeSessionReady = true
            if (!resolved) {
              resolved = true
              resolve()
            }
            return
          }

          if (data.type === 'error') {
            console.error('Realtime error:', data)
            return
          }

          if (data.type === 'response.done') {
            const content = data.response?.output?.[0]?.content?.[0]
            const message = content?.transcript || content?.text
            if (message) {
              commit('setRealtimeChatMessages', {
                sender: 'chat',
                message,
              })
              commit('setIsLoading', false, { root: true })
            }
          }
        }

        ws.onclose = (event) => {
          console.warn('⚠️ WebSocket closed', event.code, event.reason)
          state.realtimeChatWebSocket = null
          state.realtimeSessionReady = false
        }
      } catch (error) {
        console.error('❌ Connection failed:', error)
        dispatch('reportApiError', error)
        reject(error)
      }
    })
  },
  async getRealtimeChatMessage({ state, dispatch, commit }, question) {
    if (!state.realtimeChatWebSocket || state.realtimeChatWebSocket.readyState !== 1) {
      await dispatch('connectRealtimeChatSocket')
    }

    const ws = state.realtimeChatWebSocket
    if (!ws || ws.readyState !== 1) {
      console.warn('WebSocket is not ready')
      return
    }

    commit('setRealtimeChatMessages', { sender: 'me', message: question })
    commit('setIsLoading', true, { root: true })

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{ type: 'input_text', text: question }],
      },
    }

    ws.send(JSON.stringify(event))
    ws.send(JSON.stringify({ type: 'response.create' }))
  },

  async getImageMessage({ commit, dispatch }, question) {
    try {
      const response = await imageApi.generateImage(question)
      commit('setImageURL', response.data.message)
    } catch (error) {
      console.log(error)
      dispatch('reportApiError', error)
    }
  },
  async downloadImage({}, imageUrl) {
    try {
      const encodedFilename = imageUrl.split('/').pop()
      const filename = decodeURIComponent(encodedFilename)
      const response = await imageApi.downloadImage(filename)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error while downloading the image:', error)
    }
  },
  async getVoiceMessage({ commit, dispatch }, question) {
    try {
      const response = await voiceApi.generateVoice(question)
      commit('setVoiceMessage', response.data.message)
    } catch (error) {
      console.log(error)
      dispatch('reportApiError', error)
    }
  },
  async deletePromptImage({ commit, state }, index) {
    const imageUrl = state.promptImages[index]
    const filename = imageUrl.split('/').pop()

    try {
      await imageApi.deleteVisionImage(filename)
      commit('removePromptImage', index)
    } catch (error) {
      console.error('Error while deleting image:', error)
    }
  },
  async uploadPromptImages({ commit, dispatch }, images) {
    const formData = new FormData()
    if (images.length != 0) {
      images.forEach((object) => {
        formData.append('images[]', object.file)
      })
    }

    try {
      const response = await imageApi.uploadVisionImages(formData)
      commit('setPromptImages', response.data.uploaded_images)
    } catch (error) {
      console.error('Error while uploading images:', error)
      dispatch('reportApiError', error)
    }
  },
}

const getters = {
  message: (state) => state.message,
  imageURL: (state) => state.imageURL,
  voiceMessage: (state) => state.voiceMessage,
  errorMessage: (state) => state.errorMessage,
  promptImages: (state) => state.promptImages,
  realtimeChatMessages: (state) => state.realtimeChatMessages,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
