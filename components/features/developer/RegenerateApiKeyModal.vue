<template>
  <AppModal id="regenerate-api-key-modal">
    <div class="bg-transparent p-8 flex flex-col items-center text-center">
      <div class="bg-surface-200 rounded-full p-3 mb-4 flex items-center justify-center">
        <Icon name="refresh" class="text-primary" :size="28" />
      </div>
      <h3 class="text-base font-semibold mb-1">Regenerate API Key</h3>
      <p class="text-xs text-emphasis-medium mb-6">Regenerating this API key will immediately invalidate the current key. Any applications using this key will need to be updated with the new key.</p>
      <div class="flex justify-center space-x-3 w-full">
        <AppButton type="ghost" class="w-1/2" @click="cancel">Cancel</AppButton>
        <AppButton :loading="state.loading" class="w-1/2" @click="confirmRegenerate">Yes, Regenerate </AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup>
import { useApiKeysStore } from '~/stores/apiKeys'
import { useToastStore } from '~/stores/toast'
import { useModal } from '~/composables/useModal'

const appModal = useModal()
const apiKeysStore = useApiKeysStore()
const toast = useToastStore()

const state = reactive({
  apiKeyId: null,
  loading: false,
  onConfirm: null,
})

const setModalData = (data) => {
  state.apiKeyId = data.id
  state.onConfirm = data.onConfirm || (() => {})
}

const confirmRegenerate = async () => {
  if (!state.apiKeyId) return

  state.loading = true
  try {
    const response = await apiKeysStore.regenerateApiKey(state.apiKeyId)
    if (typeof state.onConfirm === 'function') {
      state.onConfirm(response)
    } else {
      cancel()
    }
  } catch (error) {
    toast.error({ message: 'Failed to regenerate API key. Please try again later.' })
  } finally {
    state.loading = false
  }
}

const cancel = () => {
  appModal.close('regenerate-api-key-modal')
  // Reset state
  state.apiKeyId = null
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
