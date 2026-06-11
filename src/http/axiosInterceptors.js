import { isJwtObtainOrRefreshUrl } from '@/shared/auth/api/jwt'

export function attachAccessTokenToRequest(config, accessToken) {
  if (accessToken) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
}

export async function retryRequestAfterRefresh(error, deps) {
  const {
    originalRequest,
    refreshToken,
    retryRequest,
    isObtainOrRefreshUrl = isJwtObtainOrRefreshUrl,
  } = deps

  if (
    !error.response ||
    error.response.status !== 401 ||
    originalRequest._retry ||
    isObtainOrRefreshUrl(originalRequest.url)
  ) {
    return Promise.reject(error)
  }

  originalRequest._retry = true
  const refreshResult = await refreshToken()

  if (!refreshResult) {
    return Promise.reject(error)
  }

  return retryRequest(originalRequest)
}

export function setupAxiosInterceptors(axiosInstance, store) {
  axiosInstance.interceptors.request.use(
    (config) =>
      attachAccessTokenToRequest(
        config,
        store.getters['authJWT/accessToken']
      ),
    (error) => Promise.reject(error)
  )

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) =>
      retryRequestAfterRefresh(error, {
        originalRequest: error.config,
        refreshToken: () => store.dispatch('authJWT/refreshToken'),
        retryRequest: (request) => axiosInstance.request(request),
      })
  )
}
