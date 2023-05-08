import axios from 'axios'
import { error } from '@/utils/error'
const state = {
  accessToken: localStorage.getItem('access') || null,
  refreshToken: localStorage.getItem('refresh') || null,
}

const mutations = {
  authSuccess(state, token) {
    state.accessToken = token
  },
  authLogout(state) {
    state.accessToken = null
    state.refreshToken = null
  },
  updateRefreshToken(state, token) {
    state.refreshToken = token
  },
}

const actions = {
  login({ commit, dispatch }, credentials) {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/v1/token/', { ...credentials })
        .then((response) => {
          const token = response.data.access
          const refreshToken = response.data.refresh
          localStorage.setItem('access', token)
          localStorage.setItem('refresh', refreshToken)
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          commit('authSuccess', token)
          commit('updateRefreshToken', refreshToken)
          commit('clearMessage', null, { root: true })
          resolve(response)
        })
        .catch(async (e) => {
          dispatch(
            'setMessage',
            {
              value: error(e.response.data),
              type: 'error',
            },
            { root: true }
          )
          localStorage.removeItem('access')
          localStorage.removeItem('refresh')
          reject(error)
        })
    })
  },
  logout({ commit }) {
    return new Promise((resolve) => {
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      commit('authLogout')
      delete axios.defaults.headers.common['Authorization']
      resolve()
    })
  },
  refreshToken({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/v1/token/refresh/', {
          refresh: localStorage.getItem('refresh'),
        })
        .then((response) => {
          const token = response.data.access
          localStorage.setItem('access', token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          commit('authSuccess', token)
          resolve(response)
        })
        .catch((error) => {
          localStorage.removeItem('access')
          localStorage.removeItem('refresh')
          commit('authLogout')
          delete axios.defaults.headers.common['Authorization']
          reject(error)
        })
    })
  },
}

const getters = {
  isAuthenticated: (state) => !!state.accessToken,
  accessToken: (state) => state.accessToken,
  refreshToken: (state) => state.refreshToken,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
