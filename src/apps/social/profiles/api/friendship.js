import axios from 'axios'

const BASE = '/api/social-profiles/friends'

export function sendFriendRequest(userSlug) {
  return axios.post(`${BASE}/${userSlug}/request/`)
}

export function fetchFriendsData(userSlug) {
  return axios.get(`${BASE}/${userSlug}/`)
}

export function handleFriendRequest(slug, status) {
  return axios.post(`${BASE}/${slug}/${status}/`)
}

export function fetchFriendSuggestions() {
  return axios.get(`${BASE}/suggested/`)
}
