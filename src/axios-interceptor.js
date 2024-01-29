import axios from 'axios'
import store from '@/store'

axios.interceptors.request.use(
  (config) => {
    const accessToken = store.getters['authJWT/accessToken']
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url != '/api/v1/token/' &&
      originalRequest.url != '/api/v1/token/refresh/'
    ) {
      originalRequest._retry = true
      const newAccessToken = await store.dispatch('authJWT/refreshToken')
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return axios(originalRequest)
      }
    }
    return Promise.reject(error)
  }
)
