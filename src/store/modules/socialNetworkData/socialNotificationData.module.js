import axios from 'axios'
import router from '@/router'
import { extractDomain } from '@/utils/domainUtils'

const state = () => ({
  notifications: [],
  unreadCount: 0,
  notificationWebSocket: null,
})

const mutations = {
  clearNotificationData(state) {
    state.notifications = []
  },
  setNotifications(state, notifications) {
    state.notifications = notifications
  },
  setUnreadCount(state, unreadCount) {
    state.unreadCount = unreadCount
  },
}

const actions = {
  async getNotifications({ commit }) {
    try {
      const response = await axios.get('/api/social-notifications/')
      const responseData = response.data
      commit('setNotifications', responseData)
      commit('setUnreadCount', responseData.length)
    } catch (error) {
      console.error(error)
    }
  },

  async readNotification({ rootGetters, commit, state }, notification) {
    try {
      await axios.post(`/api/social-notifications/read/${notification.id}/`)
      commit('setUnreadCount', state.unreadCount - 1)
      const userSlug = rootGetters['socialProfileData/userSlug']
      if (
        notification.type_of_notification == 'post_like' ||
        notification.type_of_notification == 'post_comment'
      ) {
        router.push({
          name: 'postSocial',
          params: { id: notification.post_id },
        })
      } else {
        router.push({
          name: 'friendsSocial',
          params: { slug: userSlug },
        })
      }
    } catch (error) {
      console.error(error)
    }
  },
  connectNotificationWebSocket({ state, rootGetters, dispatch }) {
    const url = extractDomain(import.meta.env.VITE_REMOTE_HOST)
    let protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const userId = rootGetters['socialProfileData/user'].id
    state.notificationWebSocket = new WebSocket(
      `${protocol}//${url}/ws/notification/${userId}/`
    )
    state.notificationWebSocket.onopen = () => {
      //   console.log('Notification WebSocket connected')
    }
    state.notificationWebSocket.onmessage = async (event) => {
      const message = JSON.parse(event.data).message
      if (message) {
        await dispatch('getNotifications')
      }
    }
    state.notificationWebSocket.onclose = () => {
      //   console.log('Notification WebSocket disabled')
    }
  },
  disconnectNotificationWebSocket({ state }) {
    const socket = state.notificationWebSocket
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close()
    }
  },
}

const getters = {
  notifications: (state) => state.notifications,
  unreadCount: (state) => state.unreadCount,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
