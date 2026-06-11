import axios from 'axios'

const BASE = '/api/social-posts'

export function likePost(postId) {
  return axios.post(`${BASE}/${postId}/like/`)
}

export function reportPost(postId) {
  return axios.post(`${BASE}/${postId}/report/`)
}

export function deletePost(postId) {
  return axios.delete(`${BASE}/${postId}/delete/`)
}
