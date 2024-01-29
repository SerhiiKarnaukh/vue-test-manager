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
  setMessage({ commit }, message) {
    commit('setMessage', message)
    setTimeout(() => {
      commit('clearMessage')
    }, 5000)
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
