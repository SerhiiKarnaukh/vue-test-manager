import axios from 'axios'

const BASE = '/api/social-posts'

export function searchPosts(query) {
  return axios.post(`${BASE}/search/`, { query })
}

export function fetchSearchPage(pathname, searchParams) {
  return axios.get(`${pathname}?${searchParams.toString()}`)
}
