import { defineStore } from 'pinia'

export const useTeamStore = defineStore('teams', {
  state: () => ({
    staff: [],
    invites: [],
    staffMember: null,
    roles: [],
    role: null,
    loading: false,
    error: null,
    serviceAccount: null,
    serviceAccounts: [],
  }),
  actions: {
    async getStaff() {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const res = await $api.get('/clients/api/business/staff')
        this.staff = res.data
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async getStaffInvites() {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const res = await $api.get('/clients/api/business/invites')
        this.invites = res.data
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async createInvite(payload) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        await $api.post('/clients/api/business/invites', payload)
        await this.getStaffInvites()
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async cancelInvite(inviteId) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        await $api.put(`/clients/api/business/invites/${inviteId}`, {})
        await this.getStaffInvites()
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async acceptInvite(payload) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        await $api.post(`/clients/api/business/invites/accept`, payload)
        await this.getStaffInvites()
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async getStaffMember(id) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const res = await $api.get(`/clients/staff/${id}`)
        this.staffMember = res.data
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async updateStaff(id, payload) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        await $api.put(`/clients/staff/${id}`, payload)
        await this.getStaff()
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async deleteStaff(id) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        await $api.delete(`/clients/staff/${id}`)
        await this.getStaff()
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async getRoles() {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const res = await $api.get('/clients/api/business/roles')
        this.roles = res.data
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async getRole(id) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const res = await $api.get(`/clients/api/business/roles/${id}`)
        this.role = res
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async getServiceAccounts() {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const res = await $api.get('/clients/api/business/staff?type=service_account')
        this.serviceAccounts = res.data
        return res.data
      } catch (err) {
        this.error = err
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
