<template>
  <AppModal id="delete-webhook-modal">
    <div class="bg-transparent p-8 flex flex-col items-center text-center">
      <div class="bg-surface-200 rounded-full p-3 mb-4 flex items-center justify-center">
        <Icon name="trash" class="text-red-500" :size="28" />
      </div>
      <h3 class="text-base font-semibold mb-1">Delete Webhook Endpoint</h3>
      <p class="text-xs text-emphasis-medium mb-6">Deleting this webhook will immediately stop all event deliveries. This action is irreversible.</p>
      <div class="flex justify-center space-x-3 w-full">
        <AppButton type="ghost" class="w-1/2" @click="cancel">Cancel</AppButton>
        <AppButton :loading="state.loading" class="w-1/2 bg-red-500 hover:bg-red-600 text-white border-none" @click="confirmDelete">Yes, Delete </AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup>
import { useWebhooksStore } from '~/stores/webhooks'
import { useToastStore } from '~/stores/toast'
import { useModal } from '~/composables/useModal'

const appModal = useModal()
const webhooksStore = useWebhooksStore()
const toast = useToastStore()

const state = reactive({
  webhookId: null,
  loading: false,
  onConfirm: null,
})

const setModalData = (data) => {
  state.webhookId = data.id
  state.onConfirm = data.onConfirm || (() => {})
}

const confirmDelete = async () => {
  if (!state.webhookId) return

  state.loading = true
  try {
    await webhooksStore.deleteWebhook(state.webhookId)
    toast.show({ message: 'Webhook deleted successfully!', color: 'green' })
    if (typeof state.onConfirm === 'function') {
      state.onConfirm()
    }
    cancel()
  } catch (error) {
    console.error('Error deleting webhook:', error)
    toast.error({ message: 'Failed to delete webhook. Please try again later.' })
  } finally {
    state.loading = false
  }
}

const cancel = () => {
  appModal.close('delete-webhook-modal')
  // Reset state
  state.webhookId = null
  state.onConfirm = null
}

// Register the modal and expose the setModalData method
defineExpose({
  setModalData,
})
</script>

<style lang="scss" scoped>
.bg-surface-200 {
  background: #f3f4f6;
}
</style>
