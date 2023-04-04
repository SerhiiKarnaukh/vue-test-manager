import axios from 'axios'
import {error} from '@/utils/error'
const TOKEN_KEY = 'jwt-token'

export default {
  namespaced: true,
  state() {
    return {
      token: localStorage.getItem(TOKEN_KEY)
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem(TOKEN_KEY, token)
    },
    logout(state) {
      state.token = null
      localStorage.removeItem(TOKEN_KEY)
    }
  },
  actions: {
    async login({ commit, dispatch }, payload) {
        try {
            const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${import.meta.env.VITE_FB_KEY}`
            const {data} = await axios.post(url, {...payload, returnSecureToken: true})
            commit('setToken', data.idToken)
            commit('clearMessage', null, {root: true})
        } catch(e) {
            dispatch('setMessage', {
                value: error(e.response.data.error.message),
                type: 'error'
            }, {root: true})
            throw new Error()
        }
    },
    async register({dispatch }, payload) {
        try {
            const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${import.meta.env.VITE_FB_KEY}`
            await axios.post(url, {...payload, returnSecureToken: true})
            dispatch('setMessage', {
                value: 'Account successfully registered. You can login',
                type: 'success'
            }, {root: true})
        } catch(e) {
            dispatch('setMessage', {
                value: error(e.response.data.error.message),
                type: 'error'
            }, {root: true})
            throw new Error()
        }
    }
  },
  getters: {
    token(state) {
      return state.token
    },
    isAuthenticated(_, getters) {
      return !!getters.token
    }
  }
}
