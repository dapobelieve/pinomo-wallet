import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    user: '',
    business: '',
    verificationPhone: '',
    verificationEmail: '',
    verificationId: '',
  }),
  persist: {},
  getters: {},
  actions: {
    setUser(user) {
      this.user = user
      sessionStorage.setItem('user', JSON.stringify(user))
    },
    setBusiness(business) {
      this.business = business
      sessionStorage.setItem('business', JSON.stringify(business))
    },
    setVerificationPhone(phone) {
      this.verificationPhone = phone
    },
    clearVerificationPhone() {
      this.verificationPhone = ''
    },
    setVerificationEmail(email) {
      this.verificationEmail = email
    },
    clearVerificationEmail() {
      this.verificationEmail = ''
    },
    setVerificationId(id) {
      this.verificationId = id
    },
    clearVerificationId() {
      this.verificationId = ''
    },
    async login(data) {
      const { $api } = useNuxtApp()
      return await $api.post(`/api/v1/login`, data)
    },
    async register(data) {
      const { $api } = useNuxtApp()
      return await $api.post(`/api/v1/register`, data)
    },
    async setPassword(data) {
      const { $api } = useNuxtApp()
      return await $api.post(`/clients/auth/business-reset-password`, data)
    },
    async setToken(token, refreshToken) {
      localStorage.setItem('iam.token', token)
      localStorage.setItem('iam.refresh', refreshToken)
      this.token = token
    },
    async logout() {
      localStorage.clear()
      this.$patch({
        token: '',
        user: '',
      })
      await navigateTo({
        path: '/login',
      })
    },
  },
})

export const useBusinessStore = defineStore('business', {
  state: () => ({}),
  persist: {},
  getters: {},
  actions: {
    async createBusinessProfile(data) {
      const { $api } = useNuxtApp()
      const res = await $api.post(`/clients/api/business/register`, data)
      return res
    },
  },
})
