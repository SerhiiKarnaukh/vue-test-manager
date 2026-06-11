import axios from 'axios'

const BASE = '/api/social-posts'

export function fetchFeed() {
  return axios.get(`${BASE}/`)
}

export function fetchPaginated(pathAndSearch) {
  return axios.get(pathAndSearch)
}

export function fetchProfilePosts(profileSlug) {
  return axios.get(`${BASE}/profile/${profileSlug}/`)
}

export function fetchTrendPosts(trendId) {
  return axios.get(`${BASE}/?trend=${trendId}`)
}
