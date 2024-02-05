import axios from 'axios'
import { encryptData, decryptData } from '@/utils/cryptoUtils'
import router from '@/router'

const state = () => ({
  user: {
    id: null,
    username: null,
    first_name: null,
    last_name: null,
    email: null,
    slug: null,
    full_name: null,
    avatar_url: null,
  },
})

const mutations = {
  setUserInfo(state, data) {
    state.user = {
      id: data.id,
      username: data.username,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      slug: data.slug,
      full_name: data.full_name,
      avatar_url: data.avatar_url,
    }
    Object.keys(state.user).forEach((key) =>
      localStorage.setItem(`user.${key}`, encryptData(data[key]))
    )
  },
  initSocial(state) {
    if (localStorage.getItem('access')) {
      Object.keys(state.user).forEach((key) => {
        state.user[key] = decryptData(localStorage.getItem(`user.${key}`))
      })
    } else {
      state.user = {
        id: false,
        username: false,
        first_name: false,
        last_name: false,
        email: false,
        slug: false,
        full_name: false,
        avatar_url: false,
      }
      Object.keys(state.user).forEach((key) =>
        localStorage.removeItem(`user.${key}`)
      )
    }
  },
}

const actions = {
  async getUserData({ commit, dispatch }) {
    try {
      const response = await axios.get('/api/social-profiles/me/')
      commit('setUserInfo', response.data)
    } catch (error) {
      if (error.response && error.response.status === 404) {
        router.push({ name: 'loginSocial' })
        dispatch('authJWT/logout', null, { root: true })
        dispatch(
          'alert/setMessage',
          {
            value: [error.response.data.message],
            type: 'error',
          },
          { root: true }
        )
        return Promise.reject(error)
      }
    }
  },
  async sendFriendshipRequest({ dispatch }, userSlug) {
    try {
      const response = await axios.post(
        `/api/social-profiles/friends/${userSlug}/request/`
      )
      if (response.data.message == 'request already sent') {
        dispatch(
          'alert/setMessage',
          {
            value: ['The request has already been sent!'],
            type: 'error',
          },
          { root: true }
        )
      } else {
        dispatch(
          'alert/setMessage',
          {
            value: ['The request was sent!'],
            type: 'success',
          },
          { root: true }
        )
      }
    } catch (error) {
      console.log('error', error)
      dispatch(
        'alert/setMessage',
        {
          value: ['You must be logged in!'],
          type: 'error',
        },
        { root: true }
      )
    }
  },
}

const getters = {
  userSlug: (state) => state.user.slug,
  userId: (state) => state.user.id,
  user: (state) => state.user,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
