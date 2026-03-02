import { WS_RECONNECT_DELAY, WS_MAX_RETRIES } from '@/constants/f1'

// Module-level WS instances (not in reactive state to avoid proxy overhead)
let telemetrySocket = null
let raceControlSocket = null
let telemetryReconnectTimer = null
let raceControlReconnectTimer = null
let dataRateCounter = 0
let dataRateInterval = null

function getWsBaseUrl() {
  const env = import.meta.env.VITE_F1_WS_BASE
  if (env) return env
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${proto}//${window.location.host}`
}

function getToken(rootGetters) {
  return rootGetters['authJWT/accessToken']
}

export default {
  namespaced: true,

  state: () => ({
    telemetryStatus: 'disconnected',
    raceControlStatus: 'disconnected',
    reconnectAttempts: 0,
    lastMessageTimestamp: null,
    dataRate: 0
  }),

  getters: {
    isTelemetryConnected: (state) => state.telemetryStatus === 'connected',
    isRaceControlConnected: (state) => state.raceControlStatus === 'connected'
  },

  mutations: {
    SET_TELEMETRY_STATUS(state, status) { state.telemetryStatus = status },
    SET_RACE_CONTROL_STATUS(state, status) { state.raceControlStatus = status },
    SET_RECONNECT_ATTEMPTS(state, count) { state.reconnectAttempts = count },
    SET_LAST_MESSAGE_TIMESTAMP(state, ts) { state.lastMessageTimestamp = ts },
    SET_DATA_RATE(state, rate) { state.dataRate = rate }
  },

  actions: {
    connectTelemetry({ commit, dispatch, rootGetters }, sessionKey) {
      dispatch('disconnectTelemetry')

      const token = getToken(rootGetters)
      if (!token || !sessionKey) return

      const url = `${getWsBaseUrl()}/ws/f1/telemetry/${sessionKey}/?token=${token}`
      commit('SET_TELEMETRY_STATUS', 'connecting')

      const ws = new WebSocket(url)
      telemetrySocket = ws

      ws.onopen = () => {
        commit('SET_TELEMETRY_STATUS', 'connected')
        commit('SET_RECONNECT_ATTEMPTS', 0)
        startDataRateTracking(commit)
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          commit('SET_LAST_MESSAGE_TIMESTAMP', new Date().toISOString())
          dataRateCounter++

          if (message.type === 'telemetry' || message.type === 'replay') {
            dispatch('f1Data/telemetry/processIncomingData', message, { root: true })
          }
        } catch (err) {
          console.error('[F1 WS] Failed to parse telemetry message:', err)
        }
      }

      ws.onclose = () => {
        commit('SET_TELEMETRY_STATUS', 'disconnected')
        telemetrySocket = null
        stopDataRateTracking(commit)
        dispatch('handleReconnect', { channel: 'telemetry', sessionKey })
      }

      ws.onerror = () => {
        commit('SET_TELEMETRY_STATUS', 'error')
      }
    },

    disconnectTelemetry({ commit }) {
      clearTimeout(telemetryReconnectTimer)
      telemetryReconnectTimer = null
      stopDataRateTracking(commit)

      if (telemetrySocket) {
        telemetrySocket.onclose = null
        telemetrySocket.close()
        telemetrySocket = null
      }
      commit('SET_TELEMETRY_STATUS', 'disconnected')
    },

    connectRaceControl({ commit, dispatch, rootGetters }) {
      dispatch('disconnectRaceControl')

      const token = getToken(rootGetters)
      if (!token) return

      const url = `${getWsBaseUrl()}/ws/f1/race-control/?token=${token}`
      commit('SET_RACE_CONTROL_STATUS', 'connecting')

      const ws = new WebSocket(url)
      raceControlSocket = ws

      ws.onopen = () => {
        commit('SET_RACE_CONTROL_STATUS', 'connected')
        commit('f1Data/raceControl/SET_CONNECTED', true, { root: true })
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          dispatch('f1Data/raceControl/processIncomingMessage', message, { root: true })
        } catch (err) {
          console.error('[F1 WS] Failed to parse race control message:', err)
        }
      }

      ws.onclose = () => {
        commit('SET_RACE_CONTROL_STATUS', 'disconnected')
        raceControlSocket = null
        commit('f1Data/raceControl/SET_CONNECTED', false, { root: true })
        dispatch('handleReconnect', { channel: 'raceControl' })
      }

      ws.onerror = () => {
        commit('SET_RACE_CONTROL_STATUS', 'error')
      }
    },

    disconnectRaceControl({ commit }) {
      clearTimeout(raceControlReconnectTimer)
      raceControlReconnectTimer = null

      if (raceControlSocket) {
        raceControlSocket.onclose = null
        raceControlSocket.close()
        raceControlSocket = null
      }
      commit('SET_RACE_CONTROL_STATUS', 'disconnected')
    },

    sendTelemetryCommand(_, payload) {
      if (telemetrySocket && telemetrySocket.readyState === WebSocket.OPEN) {
        telemetrySocket.send(JSON.stringify(payload))
      }
    },

    handleReconnect({ state, commit, dispatch, rootGetters }, { channel, sessionKey }) {
      if (state.reconnectAttempts >= WS_MAX_RETRIES) {
        console.warn(`[F1 WS] Max reconnect attempts reached for ${channel}`)
        return
      }

      const token = getToken(rootGetters)
      if (!token) return

      commit('SET_RECONNECT_ATTEMPTS', state.reconnectAttempts + 1)
      const delay = WS_RECONNECT_DELAY * Math.min(state.reconnectAttempts, 5)

      if (channel === 'telemetry' && sessionKey) {
        telemetryReconnectTimer = setTimeout(() => {
          dispatch('connectTelemetry', sessionKey)
        }, delay)
      } else if (channel === 'raceControl') {
        raceControlReconnectTimer = setTimeout(() => {
          dispatch('connectRaceControl')
        }, delay)
      }
    }
  }
}

function startDataRateTracking(commit) {
  stopDataRateTracking(commit)
  dataRateCounter = 0
  dataRateInterval = setInterval(() => {
    commit('SET_DATA_RATE', dataRateCounter)
    dataRateCounter = 0
  }, 1000)
}

function stopDataRateTracking(commit) {
  if (dataRateInterval) {
    clearInterval(dataRateInterval)
    dataRateInterval = null
  }
  commit('SET_DATA_RATE', 0)
}
