export default {
  namespaced: true,

  state: () => ({
    strategies: [],
    strategiesLoading: false,
    stints: {},
    stintsLoading: false,
    calculationInput: {
      currentLap: 1,
      totalLaps: 57,
      currentCompound: 'MEDIUM',
      tyreAge: 0,
      baseLapTime: 90.0,
      rainProbability: 0,
      gapAhead: 0,
      gapBehind: 0
    }
  }),

  getters: {
    bestStrategy: (state) => state.strategies.length ? state.strategies[0] : null,
    sortedStrategies: (state) => [...state.strategies].sort((a, b) => a.predicted_time - b.predicted_time),
    stintsByDriver: (state) => (driverNumber) => state.stints[driverNumber] ?? [],
    currentCompoundForDriver: (state) => (driverNumber) => {
      const driverStints = state.stints[driverNumber] ?? []
      const activeStint = driverStints.find((s) => !s.lap_end)
      return activeStint?.compound ?? null
    }
  },

  mutations: {
    SET_STRATEGIES(state, strategies) { state.strategies = strategies },
    SET_STRATEGIES_LOADING(state, val) { state.strategiesLoading = val },
    SET_STINTS(state, stints) { state.stints = stints },
    SET_STINTS_LOADING(state, val) { state.stintsLoading = val },
    SET_CALCULATION_INPUT(state, input) { Object.assign(state.calculationInput, input) },
    RESET_CALCULATION_INPUT(state) {
      state.calculationInput = {
        currentLap: 1, totalLaps: 57, currentCompound: 'MEDIUM',
        tyreAge: 0, baseLapTime: 90.0, rainProbability: 0,
        gapAhead: 0, gapBehind: 0
      }
    }
  },

  actions: {
    async calculateStrategies() { /* TODO: implement */ },
    async fetchStints() { /* TODO: implement */ },
    updateInput({ commit }, input) { commit('SET_CALCULATION_INPUT', input) },
    resetInput({ commit }) { commit('RESET_CALCULATION_INPUT') }
  }
}
