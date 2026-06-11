import axios from 'axios'
import { error } from '@/utils/error'
import {
  loginWithToken,
  logoutWithToken,
  registerUser,
  resolveRegisterUrl,
} from '../api/token'

const TOKEN_KEY = 'token'

export default {
  namespaced: true,
  state() {
    return {
      token: localStorage.getItem(TOKEN_KEY),
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem(TOKEN_KEY, token)
    },
    removeToken(state) {
      state.token = null
      localStorage.removeItem(TOKEN_KEY)
    },
  },
  actions: {
    async login({ commit, dispatch }, payload) {
      try {
        const { data } = await loginWithToken(payload)
        commit('setToken', data.auth_token)
        commit('alert/clearMessage', null, { root: true })
      } catch (e) {
        dispatch(
          'alert/setMessage',
          {
            value: error(e.response.data),
            type: 'error',
          },
          { root: true }
        )

        throw new Error()
      }
    },
    async logout({ commit, dispatch, getters }) {
      await logoutWithToken(getters.token)
        .then(() => {
          commit('removeToken')
          axios.defaults.headers.common['Authorization'] = ''
        })
        .catch((logoutError) => {
          if (logoutError.response) {
            dispatch(
              'alert/setMessage',
              {
                value: error(logoutError.response.data),
                type: 'error',
              },
              { root: true }
            )
          } else {
            dispatch(
              'alert/setMessage',
              {
                value: ['Something went wrong. Please try again'],
                type: 'error',
              },
              { root: true }
            )
          }
        })
    },
    async register({ dispatch }, payload) {
      try {
        const url = resolveRegisterUrl(payload.registration_source)
        const response = await registerUser(url, payload)

        let responseMessage = `Thank you for registering with us. We have sent you a verification email to your email address [${payload.email}]`
        if (response.data.detail == 'social_profile_created') {
          responseMessage = 'Yor Social Profile created'
        }
        dispatch(
          'alert/setMessage',
          {
            value: [responseMessage],
            type: 'success',
          },
          { root: true }
        )
      } catch (e) {
        dispatch(
          'alert/setMessage',
          {
            value: error(e.response.data),
            type: 'error',
          },
          { root: true }
        )
        throw new Error()
      }
    },
  },
  getters: {
    token(state) {
      return state.token
    },
    isAuthenticated(_, getters) {
      return !!getters.token
    },
  },
}
