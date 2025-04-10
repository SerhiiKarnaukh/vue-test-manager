import axios from 'axios'
const state = () => ({
  message: null,
})

const mutations = {
  setMessage(state, message) {
    state.message = message
  },
  clearMessage(state) {
    state.message = null
  },
}

const actions = {
  async getChatMessage({ commit }, question) {
    await axios
      .post('/ai-lab/', { question })
      .then((response) => {
        commit('setMessage', response.data.message)
      })
      .catch((error) => {
        console.log(error)
      })
  },
  async getImageMessage({ commit }, question) {
    await axios
      .post('/ai-lab/image-generator/', { question })
      .then((response) => {
        commit('setMessage', response.data.message)
      })
      .catch((error) => {
        console.log(error)
      })
  },
}

const getters = {
  message: (state) => state.message,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
