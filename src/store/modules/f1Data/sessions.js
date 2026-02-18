export default {
  namespaced: true,

  state: () => ({
    sessions: [],
    sessionsLoading: false,
    drivers: [],
    driversLoading: false,
    activeSession: null,
    liveSession: null,
    selectedYear: new Date().getFullYear(),
    selectedSessionType: null
  }),

  getters: {
    sessionsByDate: (state) => [...state.sessions].sort((a, b) => new Date(b.date_start) - new Date(a.date_start)),
    raceSessionsOnly: (state) => state.sessions.filter((s) => s.session_type === 'race'),
    isLiveSession: (state) => state.activeSession?.is_live ?? false,
    activeSessionKey: (state) => state.activeSession?.session_key ?? null
  },

  mutations: {
    SET_SESSIONS(state, sessions) { state.sessions = sessions },
    SET_SESSIONS_LOADING(state, val) { state.sessionsLoading = val },
    SET_DRIVERS(state, drivers) { state.drivers = drivers },
    SET_DRIVERS_LOADING(state, val) { state.driversLoading = val },
    SET_ACTIVE_SESSION(state, session) { state.activeSession = session },
    SET_LIVE_SESSION(state, session) { state.liveSession = session },
    SET_SELECTED_YEAR(state, year) { state.selectedYear = year },
    SET_SELECTED_SESSION_TYPE(state, type) { state.selectedSessionType = type }
  },

  actions: {
    async fetchSessions() { /* TODO: implement */ },
    async fetchDrivers() { /* TODO: implement */ },
    selectSession({ commit }, session) { commit('SET_ACTIVE_SESSION', session) },
    async detectLiveSession() { /* TODO: implement */ }
  }
}
