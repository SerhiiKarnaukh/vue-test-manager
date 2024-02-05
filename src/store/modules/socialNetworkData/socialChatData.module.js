import axios from 'axios'

const state = () => ({})

const mutations = {}

const actions = {
  async getOrCreateChat({ dispatch }, userSlug) {
    try {
      await axios.get(`/api/social-chat/${userSlug}/get-or-create/`)
    } catch (error) {
      dispatch(
        'alert/setMessage',
        {
          value: ['You must be logged in!'],
          type: 'error',
        },
        { root: true }
      )
      return Promise.reject(error)
    }
  },
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
