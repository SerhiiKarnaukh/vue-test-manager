import axios from 'axios'

const BASE = '/api/social-profiles'

export function fetchCurrentUser() {
  return axios.get(`${BASE}/me/`)
}

export function updateProfile(formData) {
  return axios.post(`${BASE}/editprofile/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function changePassword(payload) {
  return axios.post(`${BASE}/editpassword/`, payload)
}
