import { weather as weatherApi } from '@/utils/f1/api'

export default {
  namespaced: true,

  state: () => ({
    currentWeather: null,
    weatherTimeline: [],
    rainForecast: {
      probability: 0,
      etaLaps: null
    },
    weatherLoading: false
  }),

  getters: {},

  mutations: {
    SET_CURRENT_WEATHER(state, weather) { state.currentWeather = weather },
    SET_WEATHER_TIMELINE(state, timeline) { state.weatherTimeline = timeline },
    SET_RAIN_FORECAST(state, forecast) { state.rainForecast = forecast },
    SET_WEATHER_LOADING(state, val) { state.weatherLoading = val }
  },

  actions: {
    async fetchCurrentWeather({ commit }, sessionKey) {
      if (!sessionKey) return
      commit('SET_WEATHER_LOADING', true)
      try {
        const { data } = await weatherApi.getCurrent(sessionKey)
        commit('SET_CURRENT_WEATHER', data)
      } catch (err) {
        console.error('[F1] Failed to fetch current weather:', err)
      } finally {
        commit('SET_WEATHER_LOADING', false)
      }
    },

    async fetchWeatherTimeline({ commit }, sessionKey) {
      if (!sessionKey) return
      try {
        const { data } = await weatherApi.getTimeline(sessionKey)
        commit('SET_WEATHER_TIMELINE', Array.isArray(data) ? data : data.results ?? [])
      } catch (err) {
        console.error('[F1] Failed to fetch weather timeline:', err)
      }
    },

    async fetchRainForecast({ commit }, sessionKey) {
      if (!sessionKey) return
      try {
        const { data } = await weatherApi.getForecast(sessionKey)
        commit('SET_RAIN_FORECAST', {
          probability: data.probability ?? 0,
          etaLaps: data.eta_laps ?? null
        })
      } catch (err) {
        console.error('[F1] Failed to fetch rain forecast:', err)
      }
    }
  }
}
