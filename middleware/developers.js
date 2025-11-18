import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp()
  const authStore = useAuthStore(nuxtApp.$pinia)

  if (authStore.business?.tier !== 3) {
    return navigateTo('/developers')
  }
})
