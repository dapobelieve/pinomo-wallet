<template>
  <AppDrawer id="webhook-drawer" @close="close">
    <template #header>
      <h3 class="text-lg font-bold">{{ isEditing ? 'Edit Webhook URL' : 'Add Webhook URL' }}</h3>
    </template>
    <p class="text-xs text-emphasis-medium mb-4 p-4">Receive real-time event notifications from your account activity. Choose which events to listen to and provide a secure URL to receive them.</p>
    <div class="p-4">
      <div class="mb-4">
        <label class="block text-sm font-medium text-emphasis-medium mb-1">Event Type</label>
        <select v-model="state.form.event_type" class="w-full p-2 border border-surface-400 rounded-md">
          <option value="transaction.created">Transaction Created</option>
          <option value="transaction.updated">Transaction Updated</option>
          <option value="transaction.completed">Transaction Completed</option>
          <option value="wallet.created">Wallet Created</option>
          <option value="wallet.updated">Wallet Updated</option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-emphasis-medium mb-1">Webhook URL</label>
        <AppInput v-model="state.form.url" type="text" placeholder="https://example.com/webhook" />
        <p class="text-xs text-emphasis-medium mt-1">Enter the URL where you want to receive webhook events</p>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-emphasis-medium mb-1">Status</label>
        <div class="flex items-center">
          <AppToggle v-model="state.form.is_active" size="sm" />
          <span class="ml-2 text-sm">{{ state.form.is_active ? 'Active' : 'Inactive' }}</span>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="bg-surface-200 flex w-full items-center justify-between px-4 py-3">
        <AppButton type="ghost" @click="cancel">Cancel</AppButton>
        <AppButton :loading="state.loading" @click="save">{{ isEditing ? 'Update Webhook' : 'Create Webhook' }}</AppButton>
      </div>
    </template>
  </AppDrawer>
</template>

<script setup>
import { useWebhooksStore } from '~/stores/webhooks'
import { useToastStore } from '~/stores/toast'
import { useDrawer } from '~/composables/useDrawer'

const appDrawer = useDrawer()
const webhooksStore = useWebhooksStore()
const toast = useToastStore()

const props = defineProps({
  webhook: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['saved'])

const state = reactive({
  form: {
    url: '',
    event_type: 'transaction.created',
    is_active: true,
    business_id: '875ba77c-71af-484b-a844-746db6f572a0', // This should be dynamically set in a real app
  },
  loading: false,
})

const isEditing = computed(() => !!props.webhook)

// Initialize form with webhook data if in edit mode
watchEffect(() => {
  if (props.webhook) {
    state.form = { ...props.webhook }
  }
})

const save = async () => {
  state.loading = true
  try {
    if (isEditing.value) {
      await webhooksStore.updateWebhook(props.webhook.id, state.form)
      toast.show({ message: 'Webhook updated successfully!', color: 'green' })
    } else {
      await webhooksStore.createWebhook(state.form)
      toast.show({ message: 'Webhook created successfully!', color: 'green' })
    }
    emit('saved')
    close()
  } catch (error) {
    console.error('Error saving webhook:', error)
    toast.error({
      message: isEditing.value ? 'Failed to update webhook. Please try again later.' : 'Failed to create webhook. Please try again later.',
    })
  } finally {
    state.loading = false
  }
}

const cancel = () => {
  close()
}

const close = () => {
  // Reset form
  if (!isEditing.value) {
    state.form = {
      url: '',
      event_type: 'transaction.created',
      is_active: true,
      business_id: '875ba77c-71af-484b-a844-746db6f572a0',
    }
  }
  appDrawer.close('webhook-drawer')
}

// Register the drawer
onMounted(() => {
  appDrawer.register('webhook-drawer')
})
</script>

<style lang="scss" scoped></style>
