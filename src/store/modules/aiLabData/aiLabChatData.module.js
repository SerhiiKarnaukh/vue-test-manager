import axios from 'axios'
const state = () => ({
  message: null,
  imageURL: null,
  voiceMessage: null,
  errorMessage: null,
  promptImages: [],
  realtimeChatWebSocket: null,
  realtimeChatMessages: [
    { sender: 'chat', message: 'Hello!' },
    { sender: 'me', message: 'How are you?' },
  ],
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
  setErrorMessage(state, error) {
    const errorMessage = error.response?.data?.message
    if (errorMessage) {
      state.errorMessage = `${errorMessage} Please contact the site administrator if the issue persists.`
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
  async getChatMessage({ commit, state }, question) {
    await axios
      .post('/ai-lab/', { question, prompt_images: state.promptImages })
      .then((response) => {
        commit('setChatMessage', response.data.message)
      })
      .catch((error) => {
        console.log(error)
        commit('setErrorMessage', error)
      })
  },
  async connectRealtimeChatSocket({ state, commit }) {
    return new Promise((resolve, reject) => {
      const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
      const ws = new WebSocket(
        'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17',
        [
          'realtime',
          'openai-insecure-api-key.' + OPENAI_API_KEY,
          'openai-beta.realtime-v1',
        ]
      )

      ws.onopen = () => {
        console.log('✅ WebSocket connection established')
        state.realtimeChatWebSocket = ws
        resolve()
      }

      ws.onerror = (e) => {
        console.error('WebSocket error:', e)
        reject(e)
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'response.done') {
          const transcript = data.response.output?.[0]?.content?.[0]?.transcript
          commit('setRealtimeChatMessages', {
            sender: 'chat',
            message: transcript,
          })
          commit('setIsLoading', false, { root: true })
        }
      }

      ws.onclose = () => console.warn('WebSocket closed')
    })
  },
  getRealtimeChatMessage({ state, commit }, question) {
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

  async getImageMessage({ commit }, question) {
    await axios
      .post('/ai-lab/image-generator/', { question })
      .then((response) => {
        commit('setImageURL', response.data.message)
      })
      .catch((error) => {
        console.log(error)
        commit('setErrorMessage', error)
      })
  },
  async downloadImage({}, imageUrl) {
    try {
      const encodedFilename = imageUrl.split('/').pop()
      const filename = decodeURIComponent(encodedFilename)

      const response = await axios.post(
        '/ai-lab/download-image/',
        { filename },
        {
          responseType: 'blob',
        }
      )

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
  async getVoiceMessage({ commit }, question) {
    await axios
      .post('/ai-lab/voice-generator/', { question })
      .then((response) => {
        commit('setVoiceMessage', response.data.message)
      })
      .catch((error) => {
        console.log(error)
        commit('setErrorMessage', error)
      })
  },
  async uploadPromptImages({ commit }, images) {
    let formData = new FormData()
    if (images.length != 0) {
      images.forEach((object, index) => {
        formData.append(`images[]`, object.file)
      })
    }

    try {
      const response = await axios.post(
        '/ai-lab/upload-vision-images/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      const uploadedImages = response.data.uploaded_images
      commit('setPromptImages', uploadedImages)
    } catch (error) {
      console.error('Error while uploading images:', error)
      commit('setErrorMessage', error)
    }
  },
}

const getters = {
  message: (state) => state.message,
  imageURL: (state) => state.imageURL,
  voiceMessage: (state) => state.voiceMessage,
  errorMessage: (state) => state.errorMessage,
  promptImages: (state) => state.promptImages,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
