import { reactive, toRefs } from 'vue'
import { useTeamStore } from '~/stores/team'

const state = reactive({
  staff: [],
  invites: [],
  staffMember: null,
  roles: [],
  role: null,
  loading: false,
  error: null,
  serviceAccounts: [],
})

export const useTeam = () => {
  const teamStore = useTeamStore()

  const fetchStaff = async () => {
    state.loading = true
    state.error = null
    try {
      await teamStore.getStaff()
      state.staff = teamStore.staff.filter((member) => member.type !== 'service_account')
      state.error = teamStore.error
    } catch (err) {
      state.error = err
    } finally {
      state.loading = false
    }
  }

  const fetchServiceAccounts = async () => {
    state.loading = true
    state.error = null
    try {
      const data = await teamStore.getServiceAccounts()
      state.serviceAccounts = data || []
      state.error = teamStore.error
    } catch (err) {
      state.error = err
    } finally {
      state.loading = false
    }
  }

  const fetchStaffInvites = async () => {
    state.loading = true
    state.error = null
    try {
      await teamStore.getStaffInvites()
      state.invites = teamStore.invites
      state.error = teamStore.error
    } catch (err) {
      state.error = err
    } finally {
      state.loading = false
    }
  }

  const createInvite = async (payload) => {
    state.loading = true
    state.error = null
    try {
      await teamStore.createInvite(payload)
      state.invites = teamStore.invites
      state.error = teamStore.error
    } catch (err) {
      state.error = err
    } finally {
      state.loading = false
    }
  }

  const cancelInvite = async (inviteId) => {
    state.loading = true
    state.error = null
    try {
      await teamStore.cancelInvite(inviteId)
      state.invites = teamStore.invites
      state.error = teamStore.error
    } catch (err) {
      state.error = err
    } finally {
      state.loading = false
    }
  }

  const acceptInvite = async (inviteId) => {
    state.loading = true
    state.error = null
    try {
      await teamStore.acceptInvite(inviteId)
      state.invites = teamStore.invites
      state.error = teamStore.error
    } catch (err) {
      state.error = err
    } finally {
      state.loading = false
    }
  }

  const fetchStaffMember = async (id) => {
    state.loading = true
    state.error = null
    try {
      await teamStore.getStaffMember(id)
      state.staffMember = teamStore.staffMember
      state.error = teamStore.error
    } catch (err) {
      state.error = err
    } finally {
      state.loading = false
    }
  }

  const updateStaff = async (id, payload) => {
    state.loading = true
    state.error = null
    try {
      await teamStore.updateStaff(id, payload)
      state.staff = teamStore.staff
      state.error = teamStore.error
    } catch (err) {
      state.error = err
    } finally {
      state.loading = false
    }
  }

  const deleteStaff = async (id) => {
    state.loading = true
    state.error = null
    try {
      await teamStore.deleteStaff(id)
      state.staff = teamStore.staff
      state.error = teamStore.error
    } catch (err) {
      state.error = err
    } finally {
      state.loading = false
    }
  }

  const fetchRoles = async () => {
    // state.loading = true
    state.error = null
    try {
      await teamStore.getRoles()
      state.roles = teamStore.roles
      state.error = teamStore.error
    } catch (err) {
      state.error = err
    } finally {
      // state.loading = false
    }
  }

  const fetchRole = async (id) => {
    state.loading = true
    state.error = null
    try {
      await teamStore.getRole(id)
      state.role = teamStore.role
      state.error = teamStore.error
    } catch (err) {
      state.error = err
    } finally {
      state.loading = false
    }
  }

  const createServiceAccount = async (payload) => {
    state.loading = true
    state.error = null
    try {
      const { $api } = useNuxtApp()
      const res = await $api.post('/clients/api/business/service-account', payload)
      state.serviceAccount = res.data
      // Update service accounts list after creation
      await fetchServiceAccounts()
      return res.data || null
    } catch (err) {
      throw err
      state.error = err
    } finally {
      state.loading = false
    }
  }

  const enableDisableServiceAccount = async (id, payload) => {
    state.loading = true
    state.error = null
    try {
      const { $api } = useNuxtApp()
      await $api.patch(`/clients/api/business/service-account/${id}/status`, payload)
      await fetchServiceAccounts()
    } catch (err) {
      state.error = err
    } finally {
      state.loading = false
    }
  }

  const removeServiceAccount = async (id) => {
    state.loading = true
    state.error = null
    try {
      const { $api } = useNuxtApp()
      await $api.delete(`/clients/api/business/service-account/${id}`)
      await fetchServiceAccounts()
    } catch (err) {
      state.error = err
    } finally {
      state.loading = false
    }
  }

  return {
    ...toRefs(state),
    fetchStaff,
    fetchStaffInvites,
    createInvite,
    cancelInvite,
    acceptInvite,
    fetchStaffMember,
    updateStaff,
    deleteStaff,
    fetchRoles,
    fetchRole,
    fetchServiceAccounts,
    createServiceAccount,
    enableDisableServiceAccount,
    removeServiceAccount,
  }
}
