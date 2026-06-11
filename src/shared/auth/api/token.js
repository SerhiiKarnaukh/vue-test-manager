import axios from 'axios'

const REGISTER_BY_SOURCE = {
  social_network: '/api/social-profiles/register/',
  taberna: '/taberna-profiles/api/register/',
}

export const DEFAULT_REGISTER_URL = '/api/v1/authusers/'
export const TOKEN_LOGIN_URL = '/auth/token/login/'
export const TOKEN_LOGOUT_URL = '/auth/token/logout/'
export const JWT_REFRESH_URL = '/api/v1/token/refresh/'

export function resolveRegisterUrl(registrationSource) {
  return REGISTER_BY_SOURCE[registrationSource] || DEFAULT_REGISTER_URL
}

export function loginWithToken(payload) {
  return axios.post(TOKEN_LOGIN_URL, { ...payload })
}

export function logoutWithToken(token) {
  return axios.post(TOKEN_LOGOUT_URL, null, {
    headers: { Authorization: `Token ${token}` },
  })
}

export function registerUser(url, payload) {
  return axios.post(url, { ...payload })
}

export function refreshJwtToken(refresh) {
  return axios.post(JWT_REFRESH_URL, { refresh })
}
