import axios from 'axios'

const state = () => ({
  conversations: [],
  activeConversation: {},
})

const mutations = {
  clearChatData(state) {
    state.conversations = []
    state.activeConversation = {}
  },
  setActiveConversation(state, id) {
    state.activeConversation = id
  },
  setConversations(state, items) {
    state.conversations = items
  },
}

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
  async getChatMessages({ state, commit }) {
    try {
      const response = await axios.get(
        `/api/social-chat/${state.activeConversation}/`
      )
      commit('setActiveConversation', response.data)
    } catch (error) {
      console.log(error)
    }
  },
  async getConversations({ state, commit, dispatch }) {
    try {
      const response = await axios.get('/api/social-chat/')
      commit('setConversations', response.data)
      if (state.conversations.length) {
        commit('setActiveConversation', state.conversations[0].id)
      }
      dispatch('getChatMessages')
    } catch (error) {
      console.log(error)
    }
  },
  async submitChatForm({ state }, message) {
    try {
      const response = await axios.post(
        `/api/social-chat/${state.activeConversation.id}/send/`,
        {
          body: message,
        }
      )
      state.activeConversation.messages.push(response.data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
}

const getters = {
  conversations: (state) => state.conversations,
  activeConversation: (state) => state.activeConversation,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
