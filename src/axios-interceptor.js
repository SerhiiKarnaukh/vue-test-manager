import axios from 'axios'
import store from '@/store'
import { isJwtObtainOrRefreshUrl } from '@/utils/authJwtEndpoints'

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
      !isJwtObtainOrRefreshUrl(originalRequest.url)
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
