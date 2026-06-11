import axios from 'axios'

const BASE = '/api/v1/vue-apps'

export function fetchVueApps() {
  return axios.get(`${BASE}/`)
}

export function searchVueApps(query) {
  return axios.post(`${BASE}/search/`, { query })
}
