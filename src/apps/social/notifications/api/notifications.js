import axios from 'axios'

const BASE = '/api/social-notifications'

export function fetchNotifications() {
  return axios.get(`${BASE}/`)
}

export function markNotificationRead(notificationId) {
  return axios.post(`${BASE}/read/${notificationId}/`)
}
