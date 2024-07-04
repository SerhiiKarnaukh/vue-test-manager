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
  currentProfile: {},
  friendshipRequests: [],
  currentProfileFriends: [],
  friendSuggestions: [],
  defaultAvatar:
    'https://doodleipsum.com/700/avatar-4?i=be176fd7d38de78c85dbfba873eb723a',
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
      state.currentProfile = {}
      state.friendshipRequests = []
      state.currentProfileFriends = []

      Object.keys(state.user).forEach((key) =>
        localStorage.removeItem(`user.${key}`)
      )
    }
  },
  setCurrentProfileFriendsData(state, payload) {
    const { requests, friends, user } = payload
    state.friendshipRequests = requests
    state.currentProfileFriends = friends
    state.currentProfile = user
  },
  setFriendSuggestions(state, suggestions) {
    state.friendSuggestions = suggestions
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
  async getCurrentProfileFriendsData({ commit }, userSlug) {
    try {
      const response = await axios.get(
        `/api/social-profiles/friends/${userSlug}/`
      )
      commit('setCurrentProfileFriendsData', response.data)
    } catch (error) {
      console.log('error', error)
    }
  },
  async handleFriendshipRequest({ state, dispatch }, payload) {
    try {
      const { status, slug } = payload
      const response = await axios.post(
        `/api/social-profiles/friends/${slug}/${status}/`
      )
      console.log('data', response.data)
      dispatch('getCurrentProfileFriendsData', state.user.slug)
    } catch (error) {
      console.log('error', error)
    }
  },
  async editPassword({ state, dispatch }, payload) {
    try {
      const response = await axios.post(
        '/api/social-profiles/editpassword/',
        payload
      )
      if (response.data.message === 'success') {
        dispatch(
          'alert/setMessage',
          {
            value: ['The information was saved'],
            type: 'success',
          },
          { root: true }
        )
        router.push({
          name: 'profileSocial',
          params: {
            slug: state.user.slug,
          },
        })
      } else {
        let errorMessages = []
        const data = JSON.parse(response.data.message)
        for (const key in data) {
          errorMessages.push(data[key][0].message)
        }
        dispatch(
          'alert/setMessage',
          {
            value: errorMessages,
            type: 'error',
          },
          { root: true }
        )
      }
    } catch (error) {
      console.log('error', error)
    }
  },
  async getFriendSuggestions({ commit, rootGetters }) {
    const isAuthenticated = rootGetters['authJWT/isAuthenticated']
    if (isAuthenticated) {
      try {
        const response = await axios.get(
          '/api/social-profiles/friends/suggested/'
        )
        commit('setFriendSuggestions', response.data)
      } catch (error) {
        console.log('error', error)
      }
    }
  },
}

const getters = {
  userSlug: (state) => state.user.slug,
  userId: (state) => state.user.id,
  user: (state) => state.user,
  currentProfile: (state) => state.currentProfile,
  friendshipRequests: (state) => state.friendshipRequests,
  currentProfileFriends: (state) => state.currentProfileFriends,
  defaultAvatar: (state) => state.defaultAvatar,
  friendSuggestions: (state) => state.friendSuggestions,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
