<template>
  <AppModal id="api-key-success-modal">
    <div class="bg-transparent p-8 flex flex-col space-y-6">
      <div class="">
        <h3 class="text-lg font-bold mb-1">Your API key has been created</h3>
      </div>

      <div class="space-y-4 w-full">
        <div class="w-full">
          <label class="block text-sm font-medium text-emphasis-medium mb-1">API Key</label>
          <CopyToClipboard
            :value="apiKey.access_public_key"
            withBorder
            containerClass="border border-gray-200 rounded-md p-3 hover:border-primary transition-colors"
            inputClass="w-full"
            @copied="toast.show({ message: 'Public key copied to clipboard!', color: 'green' })"
          />
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium text-emphasis-medium mb-1">
            Secret Key
            <span class="text-red-500 ml-1">*</span>
          </label>
          <CopyToClipboard
            :value="apiKey.shared_secret_key"
            withBorder
            containerClass="border border-gray-200 rounded-md p-3 hover:border-primary transition-colors"
            inputClass="w-full"
            @copied="toast.show({ message: 'Secret key copied to clipboard!', color: 'green' })"
          />
        </div>
      </div>

      <div class="pt-4">
        <div class="border border-yellow-200 bg-yellow-50 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <Icon name="alert-triangle" class="text-yellow-500" :size="20" />
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">This is your only chance to view the secret key. Please copy and store it securely.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center pt-4">
        <AppButton @click="close">I've Saved My Keys</AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup>
import { useToastStore } from '~/stores/toast'
import { useModal } from '~/composables/useModal'
import { onMounted } from 'vue'
import Icon from '~/components/common/Icon.vue'

const appModal = useModal()
const toast = useToastStore()

const props = defineProps({
  apiKey: {
    type: Object,
    required: true,
    default: () => ({
      access_public_key: '',
      shared_secret_key: '',
    }),
  },
})

const close = () => {
  appModal.close('api-key-success-modal')
}

// Register the modal
onMounted(() => {
  appModal.register('api-key-success-modal')
})
</script>

<style lang="scss" scoped>
.bg-surface-200 {
  background: #f3f4f6;
}
</style>
