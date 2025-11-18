import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp()
  const authStore = useAuthStore(nuxtApp.$pinia)

  if (to.query.accessToken && to.query.refreshToken) return

  if (!authStore.token) {
    if (process.client) {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('accessToken')
      authStore.token = localStorage.getItem('iam.token') ?? token
    }
  }

  const unprotectedRoutes = ['/login', '/register', '/setter', '/start-verification', '/verify-phone', '/verify-email', '/verification-complete', '/new-password', '/forgot-password', '/set-password']

  const unprotectedPatterns = [/^\/accept-invite\/[\w-]+$/, /^\/reset-password\/[\w-]+$/]

  const isUnprotectedRoute = unprotectedRoutes.includes(to.path) || unprotectedPatterns.some((pattern) => pattern.test(to.path))

  if (!authStore.token && !isUnprotectedRoute) {
    return navigateTo('/login')
  }

  // Redirect authenticated users away from auth pages
  if (authStore.token && isUnprotectedRoute) {
    if (to.path.startsWith('/accept-invite/')) return

    return navigateTo('/')
  }
})
