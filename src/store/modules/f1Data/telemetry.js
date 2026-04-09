import { telemetry as telemetryApi, laps as lapsApi } from '@/utils/f1/api'

export default {
  namespaced: true,

  state: () => ({
    selectedDrivers: [],
    latestData: {},
    chartBuffers: {},
    bufferSize: 60,
    laps: {},
    fastestLaps: {},
    isStreaming: false,
    replayLap: null
  }),

  getters: {
    speedChartData: () => ({}),
    throttleBrakeData: () => ({}),
    rpmChartData: () => ({}),
    latestForDriver: (state) => (driverNumber) => state.latestData[driverNumber] ?? null,
    isDriverSelected: (state) => (driverNumber) => state.selectedDrivers.includes(driverNumber)
  },

  mutations: {
    SET_SELECTED_DRIVERS(state, drivers) { state.selectedDrivers = drivers },
    SET_LATEST_DATA(state, { driverNumber, data }) {
      state.latestData = { ...state.latestData, [driverNumber]: data }
    },
    SET_LAPS(state, laps) { state.laps = laps },
    SET_FASTEST_LAPS(state, fastestLaps) { state.fastestLaps = fastestLaps },
    SET_STREAMING(state, val) { state.isStreaming = val },
    SET_REPLAY_LAP(state, lap) { state.replayLap = lap },
    PUSH_TO_BUFFER(state, { driverNumber, field, value }) {
      if (!state.chartBuffers[driverNumber]) {
        state.chartBuffers = {
          ...state.chartBuffers,
          [driverNumber]: { speed: [], rpm: [], throttle: [], brake: [] }
        }
      }
      const buf = state.chartBuffers[driverNumber][field]
      buf.push(value)
      // Keep only the last `bufferSize * 4` points (~4 Hz × bufferSize seconds)
      const maxLen = state.bufferSize * 4
      if (buf.length > maxLen) buf.splice(0, buf.length - maxLen)
    },
    CLEAR_BUFFERS(state) {
      state.chartBuffers = {}
      state.latestData = {}
      state.laps = {}
      state.fastestLaps = {}
    }
  },

  actions: {
    selectDrivers({ commit, dispatch }, driverNumbers) {
      commit('SET_SELECTED_DRIVERS', driverNumbers)
      commit('SET_STREAMING', driverNumbers.length > 0)
      dispatch(
        'f1Data/websocket/sendTelemetryCommand',
        { action: 'subscribe', drivers: driverNumbers },
        { root: true }
      )
    },

    removeDriver({ state, dispatch }, driverNumber) {
      const updated = state.selectedDrivers.filter((d) => d !== driverNumber)
      dispatch('selectDrivers', updated)
    },

    clearDrivers({ commit, dispatch }) {
      commit('SET_SELECTED_DRIVERS', [])
      commit('SET_STREAMING', false)
      dispatch(
        'f1Data/websocket/sendTelemetryCommand',
        { action: 'unsubscribe' },
        { root: true }
      )
    },

    processIncomingData({ commit }, message) {
      if (message.type === 'telemetry' && message.driver && message.data) {
        const dn = message.driver
        const normalized = normalizeTelemetryData(message.data)
        commit('SET_LATEST_DATA', { driverNumber: dn, data: normalized })
        for (const field of ['speed', 'rpm', 'throttle', 'brake']) {
          if (normalized[field] != null) {
            commit('PUSH_TO_BUFFER', { driverNumber: dn, field, value: normalized[field] })
          }
        }
      }
    },

    async fetchLaps({ commit }, sessionKey) {
      if (!sessionKey) return
      try {
        const { data } = await lapsApi.getAll(sessionKey)
        const results = Array.isArray(data) ? data : data.results ?? []
        // Group laps by driver number
        const grouped = {}
        for (const lap of results) {
          const dn = lap.driver_number ?? lap.driver
          if (!grouped[dn]) grouped[dn] = []
          grouped[dn].push(lap)
        }
        commit('SET_LAPS', grouped)
      } catch (err) {
        console.error('[F1] Failed to fetch laps:', err)
      }
    },

    async fetchFastestLaps({ commit }, sessionKey) {
      if (!sessionKey) return
      try {
        const { data } = await lapsApi.getFastest(sessionKey)
        const results = Array.isArray(data) ? data : data.results ?? []
        const map = {}
        for (const lap of results) {
          const dn = lap.driver_number ?? lap.driver
          map[dn] = lap
        }
        commit('SET_FASTEST_LAPS', map)
      } catch (err) {
        console.error('[F1] Failed to fetch fastest laps:', err)
      }
    },

    async fetchLatest({ commit }, sessionKey) {
      if (!sessionKey) return
      try {
        const { data } = await telemetryApi.getLatest(sessionKey)
        const results = Array.isArray(data) ? data : data.results ?? []
        for (const row of results) {
          const driverNumber = row.driver_number ?? row.driver
          if (driverNumber == null) continue
          const normalized = normalizeTelemetryData(row)
          commit('SET_LATEST_DATA', { driverNumber, data: normalized })
          seedBufferPoint(commit, driverNumber, normalized)
        }
      } catch (err) {
        console.error('[F1] Failed to fetch latest telemetry:', err)
      }
    },

    requestReplay({ commit, dispatch }, lapNumber) {
      commit('SET_REPLAY_LAP', lapNumber)
      dispatch(
        'f1Data/websocket/sendTelemetryCommand',
        { action: 'replay', lap: lapNumber },
        { root: true }
      )
    }
  }
}

function seedBufferPoint(commit, driverNumber, row) {
  for (const field of ['speed', 'rpm', 'throttle', 'brake']) {
    if (row[field] == null) continue
    commit('PUSH_TO_BUFFER', { driverNumber, field, value: row[field] })
  }
}

function normalizeTelemetryData(row) {
  return {
    speed: toNumberOrNull(row?.speed),
    rpm: toNumberOrNull(row?.rpm),
    throttle: toNumberOrNull(row?.throttle),
    brake: toNumberOrNull(row?.brake),
    gear: toNumberOrNull(row?.gear),
    n_gear: toNumberOrNull(row?.n_gear),
    drs: toNumberOrNull(row?.drs),
    timestamp: row?.timestamp ?? null,
    data_source: row?.data_source ?? null,
    is_fallback: row?.is_fallback === true
  }
}

function toNumberOrNull(value) {
  if (value == null || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}
