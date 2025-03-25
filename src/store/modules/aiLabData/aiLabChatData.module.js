import axios from 'axios'
const state = () => ({
  message: null,
})

const mutations = {
  setChatMessage(state, message) {
    state.message = message
  },
}

const actions = {
  async getChatMessage({ commit }) {
    await axios
      .get('/ai-lab/')
      .then((response) => {
        commit('setChatMessage', response.data.message)
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
