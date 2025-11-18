import { useNuxtApp } from '#app'
import { defineStore } from 'pinia'

export const useIpWhitelistStore = defineStore('ipWhitelist', {
  state: () => ({
    ipAddresses: [],
  }),
  persist: {},
  getters: {},
  actions: {
    async getIpAddresses() {
      const { $api } = useNuxtApp()
      const response = await $api.get('/clients/api/business/ip-whitelist')
      this.ipAddresses = response.data
      return response.data
    },
    async createIpAddress(data) {
      const { $api } = useNuxtApp()
      const response = await $api.post('/clients/api/business/ip-whitelist', data)
      return response.data
    },
    async updateIpAddress(id, data) {
      const { $api } = useNuxtApp()
      const response = await $api.patch(`/clients/api/business/ip-whitelist/${id}`, data)
      return response.data
    },
    async deleteIpAddress(id) {
      const { $api } = useNuxtApp()
      const response = await $api.delete(`/clients/api/business/ip-whitelist/${id}`)
      return response.data
    },
    async toggleIpAddress(id, isActive) {
      const { $api } = useNuxtApp()
      const response = await $api.patch(`/clients/api/business/ip-whitelist/${id}`, {
        is_active: isActive,
      })
      return response.data
    },
  },
})
