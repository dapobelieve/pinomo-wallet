import { useNuxtApp } from '#app'
import { defineStore } from 'pinia'

export const useApiKeysStore = defineStore('apiKeys', {
  state: () => ({
    apiKeys: [],
  }),
  persist: {},
  getters: {},
  actions: {
    async getApiKeys() {
      const { $api } = useNuxtApp()
      const response = await $api.get('/clients/api/business/api-authentication-keys')
      this.apiKeys = response.data
      return response.data
    },
    async createApiKey(data) {
      const { $api } = useNuxtApp()
      const response = await $api.post('/clients/api/business/api-authentication-keys', data)
      return response.data
    },
    async regenerateApiKey(id) {
      const { $api } = useNuxtApp()
      const response = await $api.post(`/clients/api/business/api-authentication-keys/${id}/regenerate`, { id })
      return response.data
    },
    async toggleApiKey(id, isActive) {
      const { $api } = useNuxtApp()
      const response = await $api.patch(`/clients/api/business/api-authentication-keys/${id}/enable-disable`, {
        is_active: isActive,
      })
      return response.data
    },
  },
})
