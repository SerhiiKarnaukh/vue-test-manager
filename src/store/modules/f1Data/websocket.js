export default {
  namespaced: true,

  state: () => ({
    telemetryStatus: 'disconnected',
    raceControlStatus: 'disconnected',
    telemetryWs: null,
    raceControlWs: null,
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
    SET_TELEMETRY_WS(state, ws) { state.telemetryWs = ws },
    SET_RACE_CONTROL_WS(state, ws) { state.raceControlWs = ws },
    SET_RECONNECT_ATTEMPTS(state, count) { state.reconnectAttempts = count },
    SET_LAST_MESSAGE_TIMESTAMP(state, ts) { state.lastMessageTimestamp = ts },
    SET_DATA_RATE(state, rate) { state.dataRate = rate }
  },

  actions: {
    async connectTelemetry() { /* TODO: implement */ },
    disconnectTelemetry() { /* TODO: implement */ },
    async connectRaceControl() { /* TODO: implement */ },
    disconnectRaceControl() { /* TODO: implement */ },
    sendTelemetryCommand() { /* TODO: implement */ },
    handleReconnect() { /* TODO: implement */ }
  }
}
