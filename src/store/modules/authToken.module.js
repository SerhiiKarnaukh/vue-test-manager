import axios from 'axios'
import { error } from '@/utils/error'
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
        const url = '/auth/token/login/'
        const { data } = await axios.post(url, {
          ...payload,
        })
        commit('setToken', data.auth_token)
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
    async logout({ commit, dispatch, getters }) {
      await axios
        .post('/auth/token/logout/', null, {
          headers: {
            Authorization: `Token ${getters.token}`,
          },
        })
        .then(() => {
          commit('removeToken')
          axios.defaults.headers.common['Authorization'] = ''
        })
        .catch((error) => {
          if (error.response) {
            dispatch(
              'setMessage',
              {
                value: error(error.response.data),
                type: 'error',
              },
              { root: true }
            )
          } else {
            dispatch(
              'setMessage',
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
        const url = '/api/v1/authusers/'
        const socialProfileUrl = '/api/social-profiles/register/'
        if (payload.registration_source) {
          await axios.post(socialProfileUrl, { ...payload })
        } else {
          await axios.post(url, { ...payload })
        }
        dispatch(
          'setMessage',
          {
            value: [
              `Thank you for registering with us. We have sent you a verification email to your email address [${payload.email}]`,
            ],
            type: 'success',
          },
          { root: true }
        )
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
