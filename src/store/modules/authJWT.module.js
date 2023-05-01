import axios from 'axios'
import { error } from '@/utils/error'
const ACCESS = 'access'
const REFRESH = 'refresh'

export default {
  namespaced: true,
  state() {
    return {
      access: localStorage.getItem(ACCESS),
      refresh: localStorage.getItem(REFRESH),
    }
  },
  mutations: {
    setToken(state, data) {
      state.access = data.access
      state.refresh = data.refresh
      localStorage.setItem(ACCESS, data.access)
      localStorage.setItem(REFRESH, data.refresh)
    },
    removeToken(state) {
      state.access = null
      state.refresh = null
      localStorage.removeItem(ACCESS)
      localStorage.removeItem(REFRESH)
    },
  },
  actions: {
    async login({ commit, dispatch }, payload) {
      try {
        const url = '/api/v1/token/'
        const { data } = await axios.post(url, {
          ...payload,
        })
        commit('setToken', data)
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.access
        commit('clearMessage', null, { root: true })
      } catch (e) {
        dispatch(
          'setMessage',
          {
            value: error(e.response.data),
            type: 'error',
          },
          { root: true }
        )

        throw new Error()
      }
    },
    async refreshToken({ state, commit }) {
      await axios
        .post('/api/v1/token/refresh/', {
          refresh: state.refresh,
        })
        .then((response) => {
          state.access = response.data.access

          localStorage.setItem(ACCESS, response.data.access)

          axios.defaults.headers.common['Authorization'] =
            'Bearer ' + response.data.access
        })
        .catch((error) => {
          console.log(error)
          commit('removeToken')
        })
    },
    async initJWT({ state, dispatch, getters }) {
      if (getters.token) {
        state.access = localStorage.getItem(ACCESS)
        state.refresh = localStorage.getItem(REFRESH)
        await dispatch('refreshToken')
      }
    },
  },
  getters: {
    token(state) {
      return state.access
    },
    isAuthenticated(_, getters) {
      return !!getters.token
    },
  },
}
