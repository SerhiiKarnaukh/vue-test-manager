import axios from 'axios'
import { extractDomain } from '@/utils/domainUtils'

const state = () => ({
  conversations: [],
  activeConversation: {},
  chatWebSocket: null,
})

const mutations = {
  clearChatData(state) {
    state.conversations = []
    state.activeConversation = {}
    state.chatWebSocket = null
  },
  setActiveConversation(state, id) {
    state.activeConversation = id
  },
  setConversations(state, items) {
    state.conversations = items
  },
}

const actions = {
  connectWebSocket({ state, rootGetters, dispatch }, conversationId) {
    const url = extractDomain(import.meta.env.VITE_REMOTE_HOST)
    let protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const userId = rootGetters['socialProfileData/userId']
    if (conversationId) {
      state.chatWebSocket = new WebSocket(
        `${protocol}//${url}/ws/social-chat/${conversationId}/${userId}/`
      )
      state.chatWebSocket.onopen = () => {
        console.log('Chat WebSocket connected')
      }

      state.chatWebSocket.onmessage = (event) => {
        const message = JSON.parse(event.data).message
        if (message) {
          console.log(message)
          //   dispatch('getSelectedTicketComments', conversationId)
        }
      }

      state.chatWebSocket.onclose = () => {
        console.log('Chat WebSocket disabled')
      }
    }
  },
  disconnectWebSocket({ state }) {
    const chatWebSocket = state.chatWebSocket
    if (chatWebSocket && chatWebSocket.readyState === WebSocket.OPEN) {
      chatWebSocket.close()
    }
  },
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
        await dispatch('disconnectWebSocket')
        await dispatch('connectWebSocket', state.conversations[0].id)
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
