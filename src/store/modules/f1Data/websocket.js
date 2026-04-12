import { WS_RECONNECT_DELAY, WS_MAX_RETRIES } from '@/constants/f1'
import { createManagedWebSocket } from '@/composables/f1/useWebSocket'

// Module-level clients (not in reactive state to avoid proxy overhead)
let telemetryClient = null
let raceControlClient = null
let telemetryReconnectTimer = null
let raceControlReconnectTimer = null
let dataRateCounter = 0
let dataRateInterval = null
let lastTelemetryParseErrorAt = 0
let telemetryParseErrorCount = 0
let telemetryParseFailureStreak = 0
let telemetryDisabledDueToParseErrors = false

const MAX_TELEMETRY_MESSAGE_CHARS = 120000
const MAX_TELEMETRY_JSON_DEPTH = 80

function getWsBaseUrl() {
  const env = import.meta.env.VITE_F1_WS_BASE
  if (env) return env
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${proto}//${window.location.host}`
}

function getToken(rootGetters) {
  return rootGetters['authJWT/accessToken']
}

function parseJwtExpiry(token) {
  if (!token) return null
  try {
    const [, payload] = token.split('.')
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(atob(base64))
    return typeof decoded.exp === 'number' ? decoded.exp : null
  } catch {
    return null
  }
}

function isTokenExpired(token) {
  const exp = parseJwtExpiry(token)
  if (!exp) return true
  const now = Math.floor(Date.now() / 1000)
  // Refresh a bit earlier to avoid reconnect loops near expiry.
  return exp <= now + 10
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
    async connectTelemetry({ commit, dispatch, rootGetters }, sessionKey) {
      dispatch('disconnectTelemetry')

      let token = getToken(rootGetters)
      if (!token || isTokenExpired(token)) {
        try {
          await dispatch('authJWT/refreshToken', null, { root: true })
          token = getToken(rootGetters)
        } catch {
          token = null
        }
      }
      if (!token || !sessionKey) return

      const url = `${getWsBaseUrl()}/ws/f1/telemetry/${sessionKey}/?token=${token}`
      commit('SET_TELEMETRY_STATUS', 'connecting')

      telemetryClient = createManagedWebSocket({
        autoReconnect: false,
        buildUrl: () => url,
        debugLabel: 'telemetry',
        onOpen: () => {
          commit('SET_TELEMETRY_STATUS', 'connected')
          commit('SET_RECONNECT_ATTEMPTS', 0)
          telemetryParseFailureStreak = 0
          telemetryDisabledDueToParseErrors = false
          startDataRateTracking(commit)
        },
        onMessage: (event) => {
          if (telemetryDisabledDueToParseErrors) return
          let message
          try {
            message = parseTelemetryMessage(event.data)
          } catch (err) {
            logTelemetryParseError(err, 'parse')
            telemetryParseFailureStreak += 1
            if (telemetryParseFailureStreak >= 3) {
              telemetryDisabledDueToParseErrors = true
              dispatch('disconnectTelemetry')
              commit('SET_TELEMETRY_STATUS', 'error')
            }
            return
          }
          if (!message) return
          telemetryParseFailureStreak = 0
          try {
            commit('SET_LAST_MESSAGE_TIMESTAMP', new Date().toISOString())
            dataRateCounter++

            if (message.type === 'telemetry' || message.type === 'replay') {
              dispatch('f1Data/telemetry/processIncomingData', message, { root: true })
            }
          } catch (err) {
            logTelemetryParseError(err, 'handle')
            telemetryParseFailureStreak += 1
            if (telemetryParseFailureStreak >= 3) {
              telemetryDisabledDueToParseErrors = true
              dispatch('disconnectTelemetry')
              commit('SET_TELEMETRY_STATUS', 'error')
            }
          }
        },
        onClose: () => {
          commit('SET_TELEMETRY_STATUS', 'disconnected')
          telemetryClient = null
          stopDataRateTracking(commit)
          dispatch('handleReconnect', { channel: 'telemetry', sessionKey })
        },
        onError: () => {
          commit('SET_TELEMETRY_STATUS', 'error')
        }
      })
      telemetryClient.connect()
    },

    disconnectTelemetry({ commit }) {
      clearTimeout(telemetryReconnectTimer)
      telemetryReconnectTimer = null
      stopDataRateTracking(commit)

      if (telemetryClient) {
        telemetryClient.disconnect()
        telemetryClient = null
      }
      commit('SET_TELEMETRY_STATUS', 'disconnected')
    },

    async connectRaceControl({ commit, dispatch, rootGetters }) {
      dispatch('disconnectRaceControl')

      let token = getToken(rootGetters)
      if (!token || isTokenExpired(token)) {
        try {
          await dispatch('authJWT/refreshToken', null, { root: true })
          token = getToken(rootGetters)
        } catch {
          token = null
        }
      }
      if (!token) return

      const url = `${getWsBaseUrl()}/ws/f1/race-control/?token=${token}`
      commit('SET_RACE_CONTROL_STATUS', 'connecting')

      raceControlClient = createManagedWebSocket({
        autoReconnect: false,
        buildUrl: () => url,
        debugLabel: 'race-control',
        onOpen: () => {
          commit('SET_RACE_CONTROL_STATUS', 'connected')
          commit('f1Data/raceControl/SET_CONNECTED', true, { root: true })
        },
        onMessage: (event) => {
          try {
            const message = JSON.parse(event.data)
            dispatch('f1Data/raceControl/processIncomingMessage', message, { root: true })
          } catch (err) {
            console.error('[F1 WS] Failed to parse race control message:', err)
          }
        },
        onClose: () => {
          commit('SET_RACE_CONTROL_STATUS', 'disconnected')
          raceControlClient = null
          commit('f1Data/raceControl/SET_CONNECTED', false, { root: true })
          dispatch('handleReconnect', { channel: 'raceControl' })
        },
        onError: () => {
          commit('SET_RACE_CONTROL_STATUS', 'error')
        }
      })
      raceControlClient.connect()
    },

    disconnectRaceControl({ commit }) {
      clearTimeout(raceControlReconnectTimer)
      raceControlReconnectTimer = null

      if (raceControlClient) {
        raceControlClient.disconnect()
        raceControlClient = null
      }
      commit('SET_RACE_CONTROL_STATUS', 'disconnected')
    },

    sendTelemetryCommand(_, payload) {
      telemetryClient?.send(payload)
    },

    async handleReconnect({ state, commit, dispatch, rootGetters }, { channel, sessionKey }) {
      if (state.reconnectAttempts >= WS_MAX_RETRIES) {
        console.warn(`[F1 WS] Max reconnect attempts reached for ${channel}`)
        if (channel === 'telemetry') {
          commit('SET_TELEMETRY_STATUS', 'error')
        } else {
          commit('SET_RACE_CONTROL_STATUS', 'error')
        }
        return
      }

      let token = getToken(rootGetters)
      if (!token || isTokenExpired(token)) {
        try {
          await dispatch('authJWT/refreshToken', null, { root: true })
          token = getToken(rootGetters)
        } catch {
          token = null
        }
      }
      if (!token) return

      const nextAttempt = state.reconnectAttempts + 1
      commit('SET_RECONNECT_ATTEMPTS', nextAttempt)
      const delay = WS_RECONNECT_DELAY * Math.min(nextAttempt, 5)

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

function logTelemetryParseError(err, phase) {
  telemetryParseErrorCount += 1
  const now = Date.now()
  if (now - lastTelemetryParseErrorAt < 2000) return
  lastTelemetryParseErrorAt = now
  const label = phase === 'parse' ? 'parse JSON' : 'handle message'
  console.error(`[F1 WS] Failed to ${label}:`, err, `(count=${telemetryParseErrorCount})`)
}

function parseTelemetryMessage(rawData) {
  if (typeof rawData !== 'string') return null
  if (rawData.length > MAX_TELEMETRY_MESSAGE_CHARS) {
    throw new RangeError('Telemetry message exceeds safe parse limit.')
  }
  if (exceedsSafeJsonDepth(rawData, MAX_TELEMETRY_JSON_DEPTH)) {
    throw new RangeError('Telemetry message exceeds safe JSON depth limit.')
  }
  return JSON.parse(rawData)
}

function exceedsSafeJsonDepth(rawJson, maxDepth) {
  let depth = 0
  let inString = false
  let escaping = false

  for (let index = 0; index < rawJson.length; index += 1) {
    const char = rawJson[index]

    if (escaping) {
      escaping = false
      continue
    }
    if (char === '\\') {
      escaping = inString
      continue
    }
    if (char === '"') {
      inString = !inString
      continue
    }
    if (inString) continue

    if (char === '{' || char === '[') {
      depth += 1
      if (depth > maxDepth) return true
      continue
    }
    if ((char === '}' || char === ']') && depth > 0) {
      depth -= 1
    }
  }

  return false
}
