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
    SET_LATEST_DATA(state, { driverNumber, data }) { state.latestData[driverNumber] = data },
    SET_LAPS(state, { driverNumber, laps }) { state.laps[driverNumber] = laps },
    SET_FASTEST_LAPS(state, fastestLaps) { state.fastestLaps = fastestLaps },
    SET_STREAMING(state, val) { state.isStreaming = val },
    SET_REPLAY_LAP(state, lap) { state.replayLap = lap },
    CLEAR_BUFFERS(state) {
      state.chartBuffers = {}
      state.latestData = {}
    }
  },

  actions: {
    async selectDrivers() { /* TODO: implement */ },
    async removeDriver() { /* TODO: implement */ },
    async clearDrivers() { /* TODO: implement */ },
    processIncomingData() { /* TODO: implement */ },
    async fetchLaps() { /* TODO: implement */ },
    async fetchFastestLaps() { /* TODO: implement */ },
    async requestReplay() { /* TODO: implement */ }
  }
}
