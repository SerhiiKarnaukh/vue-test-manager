import axios from 'axios'

export default {
  namespaced: true,
  state() {
    return {
      user: {
        id: null,
        username: null,
        email: null,
      },
    }
  },
  mutations: {
    setUserInfo(state, data) {
      state.user.id = data.id
      state.user.username = data.username
      state.user.email = data.email
      localStorage.setItem('user.id', data.id)
      localStorage.setItem('user.username', data.username)
      localStorage.setItem('user.email', data.email)
    },
    initSocial(state) {
      if (localStorage.getItem('access')) {
        state.user.id = localStorage.getItem('user.id')
        state.user.username = localStorage.getItem('user.username')
        state.user.email = localStorage.getItem('user.email')
      } else {
        this.removeUserData(state)
      }
    },
    removeUserData(state) {
      state.user.id = false
      state.user.username = false
      state.user.email = false
      localStorage.setItem('user.id', '')
      localStorage.setItem('user.username', '')
      localStorage.setItem('user.email', '')
    },
  },
  actions: {
    async getUserData({ commit }) {
      await axios
        .get('accounts/api/me/')
        .then((response) => {
          console.log(response.data)
          commit('setUserInfo', response.data)
        })
        .catch((error) => {
          console.log('error', error)
        })
    },
  },
  getters: {},
}
