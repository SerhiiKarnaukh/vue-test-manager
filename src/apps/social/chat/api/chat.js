import axios from 'axios'

const BASE = '/api/social-chat'

export function fetchConversations() {
  return axios.get(`${BASE}/`)
}

export function fetchChatMessages(conversationId) {
  return axios.get(`${BASE}/${conversationId}/`)
}

export function getOrCreateChat(userSlug) {
  return axios.get(`${BASE}/${userSlug}/get-or-create/`)
}

export function sendChatMessage(conversationId, body) {
  return axios.post(`${BASE}/${conversationId}/send/`, { body })
}
