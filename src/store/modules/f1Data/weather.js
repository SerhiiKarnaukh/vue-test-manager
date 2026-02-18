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
    async fetchCurrentWeather() { /* TODO: implement */ },
    async fetchWeatherTimeline() { /* TODO: implement */ },
    async fetchRainForecast() { /* TODO: implement */ }
  }
}
