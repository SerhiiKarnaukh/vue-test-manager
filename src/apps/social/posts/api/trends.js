import axios from 'axios'

const BASE = '/api/social-posts'

export function fetchTrends() {
  return axios.get(`${BASE}/trends/`)
}
