import { raceControl as rcApi } from '@/utils/f1/api'
import { getFlagColor } from '@/utils/f1/flagColors'

function toArrayPayload(data) {
  return Array.isArray(data) ? data : data?.results ?? []
}

function normalizeRaceControlMessage(message) {
  if (!message) return null
  if (message.type === 'race_control' && message.data) {
    return { ...message.data, type: message.type }
  }
  return message
}

function sortByNewest(messages) {
  return [...messages].sort((left, right) => {
    const leftTs = new Date(left?.timestamp || 0).getTime()
    const rightTs = new Date(right?.timestamp || 0).getTime()
    return rightTs - leftTs
  })
}

function getLatestFlag(messages) {
  return messages.find((message) => message?.flag)?.flag ?? null
}

export default {
  namespaced: true,

  state: () => ({
    messages: [],
    currentFlag: 'GREEN',
    isSafetyCarActive: false,
    isConnected: false,
    loadError: null
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
    SET_LOAD_ERROR(state, error) { state.loadError = error },
    CLEAR(state) {
      state.messages = []
      state.currentFlag = 'GREEN'
      state.isSafetyCarActive = false
      state.loadError = null
    }
  },

  actions: {
    async fetchMessages({ commit }, sessionKey) {
      if (!sessionKey) return
      commit('SET_LOAD_ERROR', null)
      try {
        const { data } = await rcApi.getMessages(sessionKey)
        const normalized = toArrayPayload(data)
          .map(normalizeRaceControlMessage)
          .filter(Boolean)
        const sorted = sortByNewest(normalized)
        commit('SET_MESSAGES', sorted)
        const latestFlag = getLatestFlag(sorted)
        if (latestFlag) {
          commit('SET_CURRENT_FLAG', latestFlag)
        }
      } catch (err) {
        console.error('[F1] Failed to fetch race control messages:', err)
        commit('SET_LOAD_ERROR', extractLoadError(err, 'Failed to load race control feed.'))
      }
    },

    processIncomingMessage({ commit }, message) {
      const normalized = normalizeRaceControlMessage(message)
      if (!normalized) return
      commit('ADD_MESSAGE', normalized)
      if (normalized.flag) {
        commit('SET_CURRENT_FLAG', normalized.flag)
      }
      if (normalized.category === 'SafetyCar') {
        const ending = normalized.message?.toLowerCase().includes('ending')
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
        commit('SET_LOAD_ERROR', extractLoadError(err, 'Failed to load current race flag.'))
      }
    }
  }
}

function extractLoadError(err, fallbackMessage) {
  const status = err?.response?.status
  if (status === 404) {
    return 'Race control endpoint is unavailable (HTTP 404). Check backend route registration.'
  }
  return fallbackMessage
}
