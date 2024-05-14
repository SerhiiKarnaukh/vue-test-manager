import axios from 'axios'

const state = () => ({
  notifications: [],
})

const mutations = {
  clearNotificationData(state) {
    state.notifications = []
  },
  //   setActiveConversation(state, id) {
  //     state.activeConversation = id
  //   },
}

const actions = {
  //   async getChatMessages({ state, commit }) {
  //     try {
  //       const response = await axios.get(
  //         `/api/social-chat/${state.activeConversation}/`
  //       )
  //       commit('setActiveConversation', response.data)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   },
}

const getters = {
  //   conversations: (state) => state.conversations,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
