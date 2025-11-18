<template>
  <AppModal id="delete-ip-address-modal" width="max-w-md" backgroundColor="transparent">
    <div class="bg-transparent p-8 flex flex-col items-center text-center">
      <div class="bg-surface-200 rounded-full p-3 mb-4 flex items-center justify-center">
        <Icon name="trash" class="text-red-500" :size="28" />
      </div>
      <h3 class="text-base font-semibold mb-1">Delete IP Address</h3>
      <p class="text-xs text-emphasis-medium mb-6">
        Deleting this IP address will immediately remove it from your whitelist. API requests from this IP will no longer be allowed. This action is irreversible.
      </p>
      <div class="flex justify-center space-x-3 w-full">
        <AppButton type="ghost" class="w-1/2" @click="cancel">Cancel</AppButton>
        <AppButton :loading="state.loading" class="w-1/2 bg-red-500 hover:bg-red-600 text-white border-none" @click="confirmDelete">Yes, Delete </AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup>
import { useToastStore } from '~/stores/toast'
import { useModal } from '~/composables/useModal'

const appModal = useModal()
const toast = useToastStore()

const state = reactive({
  ipAddressId: null,
  loading: false,
  onConfirm: null,
})

const setModalData = (data) => {
  state.ipAddressId = data.id
  state.onConfirm = data.onConfirm || (() => {})
}

const confirmDelete = async () => {
  if (!state.ipAddressId) return

  state.loading = true
  try {
    if (typeof state.onConfirm === 'function') {
      await state.onConfirm(state.ipAddressId)
    }
    toast.show({ message: 'IP address deleted successfully!', color: 'green' })
    cancel()
  } catch (error) {
    console.error('Error deleting IP address:', error)
    toast.error({ message: 'Failed to delete IP address. Please try again later.' })
  } finally {
    state.loading = false
  }
}

const cancel = () => {
  appModal.close('delete-ip-address-modal')
  state.ipAddressId = null
  state.onConfirm = null
}

defineExpose({
  setModalData,
})
</script>

<style lang="scss" scoped>
.bg-surface-200 {
  background: #f3f4f6;
}
</style>
