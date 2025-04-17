import axios from 'axios'
const state = () => ({
  message: null,
  imageURL: null,
  voiceMessage: null,
  errorMessage: null,
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
  setErrorMessage(state, error) {
    const errorMessage = error.response?.data?.message
    if (errorMessage) {
      state.errorMessage = `${errorMessage} Please contact the site administrator if the issue persists.`
    }
  },
  clearErrorMessage(state) {
    state.errorMessage = null
  },
}

const actions = {
  async getChatMessage({ commit }, question) {
    await axios
      .post('/ai-lab/', { question })
      .then((response) => {
        commit('setChatMessage', response.data.message)
      })
      .catch((error) => {
        console.log(error)
        commit('setErrorMessage', error)
      })
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
}

const getters = {
  message: (state) => state.message,
  imageURL: (state) => state.imageURL,
  voiceMessage: (state) => state.voiceMessage,
  errorMessage: (state) => state.errorMessage,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
