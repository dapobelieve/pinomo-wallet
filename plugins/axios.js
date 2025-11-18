import axios from 'axios'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const AUTH_TOKEN_KEY = 'iam.token'
  const REFRESH_TOKEN_KEY = 'iam.refresh'
  const PUBLIC_ENDPOINTS = ['/auth/signup', '/auth/login', '/auth/forgot-password', 'clients/api/business/invites/accept']

  const createApiInstance = (baseURL) => {
    const instance = axios.create({
      baseURL,
      timeout: 30000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    configureInterceptors(instance)
    return instance
  }

  const configureInterceptors = (instance) => {
    instance.interceptors.request.use(
      (config) => {
        if (!PUBLIC_ENDPOINTS.some((endpoint) => config.url.includes(endpoint))) {
          const token = localStorage.getItem(AUTH_TOKEN_KEY)
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    instance.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        const originalRequest = error.config
        const status = error.response?.status
        const authStore = useAuthStore()

        if (status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

            if (!refreshToken) {
              // No refresh token available - logout user
              await authStore.logout()
              return
            }

            // Attempt to refresh the access token
            const response = await instance.post('/auth/refresh-token', {
              refresh_token: refreshToken,
            })

            if (response.access_token) {
              localStorage.setItem(AUTH_TOKEN_KEY, response.access_token)
              localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token)

              originalRequest.headers.Authorization = `Bearer ${response.access_token}`
              return axios(originalRequest)
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError)
            // Force logout on refresh token failure
            await authStore.logout()
            return
          }
        }

        // Handle 401 without retry (already attempted refresh)
        if (status === 401 && originalRequest._retry) {
          await authStore.logout()
        }

        if (status === 403) {
          const { mb_error_code } = error.response.data
          // if (mb_error_code && mb_error_code === 'permission_error') {
          // } else {
          //   await authStore.logout()
          // }
        }

        if (!error.response) {
          console.error('Network error:', error)
        }

        return Promise.reject(error.response.data || error.data)
      },
    )
  }

  const api = createApiInstance(config.public.baseUrl)
  const collectionsApi = createApiInstance(config.public.collectionsBaseUrl)

  return {
    provide: {
      api,
      collectionsApi,
    },
  }
})
