import { raceControl as rcApi } from '@/utils/f1/api'
import { getFlagColor } from '@/utils/f1/flagColors'

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
    flagColor: (state) => getFlagColor(state.currentFlag)
  },

  mutations: {
    SET_MESSAGES(state, messages) { state.messages = messages },
    ADD_MESSAGE(state, message) { state.messages.unshift(message) },
    SET_CURRENT_FLAG(state, flag) { state.currentFlag = flag },
    SET_SAFETY_CAR(state, val) { state.isSafetyCarActive = val },
    SET_CONNECTED(state, val) { state.isConnected = val },
    CLEAR(state) {
      state.messages = []
      state.currentFlag = 'GREEN'
      state.isSafetyCarActive = false
    }
  },

  actions: {
    async fetchMessages({ commit }, sessionKey) {
      if (!sessionKey) return
      try {
        const { data } = await rcApi.getMessages(sessionKey)
        const results = Array.isArray(data) ? data : data.results ?? []
        commit('SET_MESSAGES', results)
        // Derive current flag from latest flag message
        const latestFlag = results.find((m) => m.flag)
        if (latestFlag) {
          commit('SET_CURRENT_FLAG', latestFlag.flag)
        }
      } catch (err) {
        console.error('[F1] Failed to fetch race control messages:', err)
      }
    },

    processIncomingMessage({ commit }, message) {
      commit('ADD_MESSAGE', message)
      if (message.flag) {
        commit('SET_CURRENT_FLAG', message.flag)
      }
      if (message.category === 'SafetyCar') {
        const ending = message.message?.toLowerCase().includes('ending')
        commit('SET_SAFETY_CAR', !ending)
      }
    },

    async fetchCurrentFlag({ commit }, sessionKey) {
      if (!sessionKey) return
      try {
        const { data } = await rcApi.getFlags(sessionKey)
        if (data?.flag) {
          commit('SET_CURRENT_FLAG', data.flag)
        }
      } catch (err) {
        console.error('[F1] Failed to fetch current flag:', err)
      }
    }
  }
}
