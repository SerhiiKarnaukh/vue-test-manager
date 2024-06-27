import axios from 'axios'
import router from '@/router'

const state = () => ({
  notifications: [],
  unreadCount: 0,
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
