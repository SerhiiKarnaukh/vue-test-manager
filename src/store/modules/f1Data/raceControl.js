export default {
  namespaced: true,

  state: () => ({
    messages: [],
    currentFlag: 'GREEN',
    isSafetyCarActive: false,
    isConnected: false
  }),

  getters: {
    latestMessages: (state) => state.messages.slice(0, 50),
    flagMessages: (state) => state.messages.filter((m) => m.category === 'Flag'),
    penaltyMessages: (state) => state.messages.filter((m) => m.category === 'Penalty'),
    flagColor: (state) => {
      const flagColorMap = {
        GREEN: '#3FB950', YELLOW: '#D29922', DOUBLE_YELLOW: '#D29922',
        RED: '#F85149', BLUE: '#58A6FF', CHEQUERED: '#E6EDF3'
      }
      return flagColorMap[state.currentFlag] ?? '#8B949E'
    }
  },

  mutations: {
    SET_MESSAGES(state, messages) { state.messages = messages },
    ADD_MESSAGE(state, message) { state.messages.unshift(message) },
    SET_CURRENT_FLAG(state, flag) { state.currentFlag = flag },
    SET_SAFETY_CAR(state, val) { state.isSafetyCarActive = val },
    SET_CONNECTED(state, val) { state.isConnected = val }
  },

  actions: {
    async fetchMessages() { /* TODO: implement */ },
    processIncomingMessage({ commit }, message) {
      commit('ADD_MESSAGE', message)
      if (message.flag) {
        commit('SET_CURRENT_FLAG', message.flag)
      }
    },
    async fetchCurrentFlag() { /* TODO: implement */ }
  }
}
