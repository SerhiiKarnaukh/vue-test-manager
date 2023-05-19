import axios from 'axios'

const state = () => ({
  user: {
    id: null,
    username: null,
    email: null,
    slug: null,
    fullName: null,
  },
})

const mutations = {
  setUserInfo(state, data) {
    const fullName = data.first_name + ' ' + data.last_name
    state.user = {
      id: data.id,
      username: data.username,
      email: data.email,
      slug: data.slug,
      fullName: fullName,
    }
    Object.keys(state.user).forEach((key) =>
      localStorage.setItem(`user.${key}`, data[key])
    )
    localStorage.setItem('user.fullName', fullName)
  },
  initSocial(state) {
    if (localStorage.getItem('access')) {
      Object.keys(state.user).forEach((key) => {
        state.user[key] = localStorage.getItem(`user.${key}`)
      })
      state.user.fullName = localStorage.getItem('user.fullName')
    } else {
      state.user = {
        id: false,
        username: false,
        email: false,
        slug: false,
        fullName: false,
      }
      Object.keys(state.user).forEach((key) =>
        localStorage.setItem(`user.${key}`, '')
      )
    }
  },
}

const actions = {
  async getUserData({ commit }) {
    try {
      const response = await axios.get('accounts/api/me/')
      commit('setUserInfo', response.data)
    } catch (error) {
      console.error('error', error)
    }
  },
}

const getters = {
  userSlug: (state) => state.user.slug,
  userId: (state) => state.user.id,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
