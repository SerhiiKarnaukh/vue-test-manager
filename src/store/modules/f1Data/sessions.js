import { sessions as sessionsApi, drivers as driversApi, auth as authApi } from '@/utils/f1/api'

const STORAGE_KEY = 'f1_active_session'
const FILTERS_STORAGE_KEY = 'f1_session_filters'

function resolveSessionKey(session) {
  return session?.session_key ?? session?.sessionKey ?? session?.key ?? null
}

function loadSavedSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persistSession(session) {
  if (session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

function loadSavedFilters() {
  const fallback = { selectedYear: new Date().getFullYear(), selectedSessionType: null }
  try {
    const raw = localStorage.getItem(FILTERS_STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    const selectedYear = Number(parsed?.selectedYear)
    return {
      selectedYear: Number.isFinite(selectedYear) ? selectedYear : fallback.selectedYear,
      selectedSessionType: parsed?.selectedSessionType ?? null
    }
  } catch {
    return fallback
  }
}

function persistFilters(selectedYear, selectedSessionType) {
  localStorage.setItem(
    FILTERS_STORAGE_KEY,
    JSON.stringify({
      selectedYear,
      selectedSessionType: selectedSessionType ?? null
    })
  )
}

const savedFilters = loadSavedFilters()

export default {
  namespaced: true,

  state: () => ({
    sessions: [],
    sessionsLoading: false,
    drivers: [],
    driversLoading: false,
    activeSession: loadSavedSession(),
    liveSession: null,
    currentUser: null,
    selectedYear: savedFilters.selectedYear,
    selectedSessionType: savedFilters.selectedSessionType,
    userIsAdmin: false
  }),

  getters: {
    sessionsByDate: (state) =>
      [...state.sessions].sort((a, b) => new Date(b.date_start) - new Date(a.date_start)),

    raceSessionsOnly: (state) =>
      state.sessions.filter((s) => s.session_type === 'race'),

    isLiveSession: (state) =>
      state.activeSession?.is_live ?? false,

    activeSessionKey: (state) =>
      resolveSessionKey(state.activeSession),

    currentUserRole: (state) => state.currentUser?.role ?? 'viewer',

    isAdmin: (state) => state.userIsAdmin
  },

  mutations: {
    SET_SESSIONS(state, sessions) { state.sessions = sessions },
    SET_SESSIONS_LOADING(state, val) { state.sessionsLoading = val },
    SET_DRIVERS(state, drivers) { state.drivers = drivers },
    SET_DRIVERS_LOADING(state, val) { state.driversLoading = val },
    SET_ACTIVE_SESSION(state, session) {
      state.activeSession = session
      persistSession(session)
    },
    SET_LIVE_SESSION(state, session) { state.liveSession = session },
    SET_CURRENT_USER(state, user) { state.currentUser = user },
    SET_SELECTED_YEAR(state, year) {
      state.selectedYear = year
      persistFilters(state.selectedYear, state.selectedSessionType)
    },
    SET_SELECTED_SESSION_TYPE(state, type) {
      state.selectedSessionType = type
      persistFilters(state.selectedYear, state.selectedSessionType)
    },
    SET_USER_IS_ADMIN(state, val) { state.userIsAdmin = val }
  },

  actions: {
    async fetchSessions({ commit, state }) {
      commit('SET_SESSIONS_LOADING', true)
      try {
        const params = { year: state.selectedYear }
        if (state.selectedSessionType) {
          params.type = state.selectedSessionType
        }
        const { data } = await sessionsApi.getAll(params.year, params.type)
        commit('SET_SESSIONS', Array.isArray(data) ? data : data.results ?? [])
      } catch (err) {
        console.error('[F1] Failed to fetch sessions:', err)
        commit('SET_SESSIONS', [])
      } finally {
        commit('SET_SESSIONS_LOADING', false)
      }
    },

    async fetchDrivers({ commit }) {
      commit('SET_DRIVERS_LOADING', true)
      try {
        const { data } = await driversApi.getAll()
        commit('SET_DRIVERS', Array.isArray(data) ? data : data.results ?? [])
      } catch (err) {
        console.error('[F1] Failed to fetch drivers:', err)
        commit('SET_DRIVERS', [])
      } finally {
        commit('SET_DRIVERS_LOADING', false)
      }
    },

    async fetchCurrentUser({ commit, dispatch }) {
      try {
        const { data } = await authApi.getMe()
        commit('SET_CURRENT_USER', data)
        commit('SET_USER_IS_ADMIN', data?.role === 'admin')
        return data
      } catch (err) {
        commit('SET_CURRENT_USER', null)
        commit('SET_USER_IS_ADMIN', false)
        if (err?.response?.status === 401) {
          await dispatch('authJWT/logout', null, { root: true })
        }
        return null
      }
    },

    async selectSession({ commit, dispatch }, session) {
      commit('SET_ACTIVE_SESSION', session)

      if (!session) {
        dispatch('f1Data/websocket/disconnectTelemetry', null, { root: true })
        dispatch('f1Data/websocket/disconnectRaceControl', null, { root: true })
        return
      }

      // Cascade: load all session-dependent data in parallel
      const sessionKey = resolveSessionKey(session)
      if (!sessionKey) return
      await Promise.allSettled([
        dispatch('fetchDrivers'),
        dispatch('f1Data/telemetry/fetchLaps', sessionKey, { root: true }),
        dispatch('f1Data/weather/fetchCurrentWeather', sessionKey, { root: true }),
        dispatch('f1Data/raceControl/fetchMessages', sessionKey, { root: true })
      ])

      // Connect WebSockets for this session
      dispatch('f1Data/websocket/connectTelemetry', sessionKey, { root: true })
      dispatch('f1Data/websocket/connectRaceControl', null, { root: true })
    },

    async detectLiveSession({ commit, state, dispatch }) {
      try {
        const { data } = await sessionsApi.getLive()
        if (data && data.session_key) {
          commit('SET_LIVE_SESSION', data)
          // Auto-select live session if nothing is selected
          if (!state.activeSession) {
            dispatch('selectSession', data)
          }
        }
      } catch {
        commit('SET_LIVE_SESSION', null)
      }
    },

    restoreSession({ state, dispatch }) {
      if (state.activeSession) {
        dispatch('selectSession', state.activeSession)
      }
    }
  }
}
