import { useNuxtApp } from '#app'
import { defineStore } from 'pinia'

export const useWebhooksStore = defineStore('webhooks', {
  state: () => ({
    webhooks: [],
  }),
  persist: {},
  getters: {},
  actions: {
    async getWebhooks() {
      const { $api } = useNuxtApp()
      const response = await $api.get('/clients/api/webhook-subscriptions')
      this.webhooks = response
      return response.data
    },
    async createWebhook(data) {
      const { $api } = useNuxtApp()
      const response = await $api.post('/clients/api/webhook-subscriptions', data)
      return response.data
    },
    async updateWebhook(id, data) {
      const { $api } = useNuxtApp()
      const response = await $api.patch(`/clients/api/webhook-subscriptions/${id}`, data)
      return response.data
    },
    async deleteWebhook(id) {
      const { $api } = useNuxtApp()
      const response = await $api.delete(`/clients/api/webhook-subscriptions/${id}`)
      return response.data
    },
  },
})
