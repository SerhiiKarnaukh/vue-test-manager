import axios from 'axios'

const BASE = '/api/social-posts'

export function fetchPost(postId) {
  return axios.get(`${BASE}/${postId}/`)
}

export function createPost(formData) {
  return axios.post(`${BASE}/create/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function addComment(postId, body) {
  return axios.post(`${BASE}/${postId}/comment/`, { body })
}
