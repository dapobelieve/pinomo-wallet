<template>
  <AppDrawer id="api-key-drawer" @close="close">
    <template #header>
      <h3 class="text-lg font-bold">Generate API Key</h3>
    </template>
    <div class="p-4">
      <div class="mb-4">
        <AppSelect v-model="state.form.service_account_id" :options="serviceAccountOptions" label="Choose Service Account" placeholder="Select service account" class="w-full" />
      </div>
      <!--      <div class="mb-4">-->
      <!--        <label class="block text-sm font-medium text-emphasis-medium mb-1">Status</label>-->
      <!--        <div class="flex items-center">-->
      <!--          <AppToggle v-model="state.form.is_active" size="sm" />-->
      <!--          <span class="ml-2 text-sm">{{ state.form.is_active ? 'Active' : 'Inactive' }}</span>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
    <template #footer>
      <div class="bg-surface-200 flex w-full items-center justify-between px-4 py-3">
        <AppButton type="ghost" @click="cancel">Cancel</AppButton>
        <AppButton :loading="state.loading" @click="save">Generate Key </AppButton>
      </div>
    </template>
  </AppDrawer>
</template>

<script setup>
import { reactive, watchEffect, onMounted, computed } from 'vue'
import { useApiKeysStore } from '~/stores/apiKeys'
import { useToastStore } from '~/stores/toast'
import { useDrawer } from '~/composables/useDrawer'

const appDrawer = useDrawer()
const apiKeysStore = useApiKeysStore()
const toast = useToastStore()

const props = defineProps({
  serviceAccounts: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['saved'])

const state = reactive({
  form: {
    service_account_id: '',
    is_active: true,
  },
  loading: false,
})

// Transform service accounts into AppSelect format
const serviceAccountOptions = computed(() => {
  return props.serviceAccounts
    .filter((account) => account.type === 'service_account')
    .map((account) => ({
      label: account.full_name,
      value: account.id,
    }))
})

// Initialize form with first service account if available
watchEffect(() => {
  if (props.serviceAccounts && props.serviceAccounts.length > 0 && !state.form.service_account_id) {
    state.form.service_account_id = props.serviceAccounts[0].id
  }
})

const save = async () => {
  if (!state.form.service_account_id) {
    toast.error({ message: 'Please select a service account' })
    return
  }

  state.loading = true
  try {
    // Extract the value from AppSelect (which returns the whole option object)
    const payload = {
      service_account_id: typeof state.form.service_account_id === 'object'
        ? state.form.service_account_id.value
        : state.form.service_account_id,
      is_active: state.form.is_active
    }
    const response = await apiKeysStore.createApiKey(payload)
    emit('saved', response)
    toast.show({ message: 'API key generated successfully!', color: 'green' })
  } catch (error) {
    toast.error({ message: error?.detail || 'Failed to generate API key. Please try again later.' })
  } finally {
    state.loading = false
  }
}

const cancel = () => {
  close()
}

const close = () => {
  // Reset form
  state.form = {
    service_account_id: props.serviceAccounts.length > 0 ? props.serviceAccounts[0].id : '',
    is_active: true,
  }
  appDrawer.close('api-key-drawer')
}

// Register the drawer
onMounted(() => {
  appDrawer.register('api-key-drawer')
})
</script>

<style lang="scss" scoped>
.bg-surface-200 {
  background: #f3f4f6;
}
</style>
