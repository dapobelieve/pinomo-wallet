<template>
  <div>
    <div @click="open">
      <slot name="trigger">
        <AppButton>
          <template #prefix>
            <Icon :size="20" :stroke-width="3" name="plus" />
          </template>
          Add IP Address
        </AppButton>
      </slot>
    </div>

    <AppDrawer :id="state.id" @cancel="back" @close="close">
      <template #header>
        <h6 class="text-emphasis-higher text-xl font-bold">{{ isEditing ? 'Edit IP Address' : 'Add IP Address' }}</h6>
      </template>
      <div class="px-6 mt-6">
        <div class="flex flex-col space-y-4">
          <AppInput v-model="state.form.address" required type="text" placeholder="192.168.1.1">
            <template #label>IP Address</template>
          </AppInput>
          <AppInput v-model="state.form.description" type="text" placeholder="Office Network">
            <template #label>Label (optional)</template>
          </AppInput>
          <div class="flex items-center space-x-2">
            <AppToggle v-model="state.form.is_active" size="sm" />
            <span class="text-sm text-emphasis-medium">{{ state.form.is_active ? 'Active' : 'Inactive' }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="bg-surface-200 flex w-full items-center px-4 py-3">
          <AppButton size="lg" type="ghost" @click.stop="back">Cancel</AppButton>
          <AppButton :loading="state.loading" class="ml-auto" @click.stop="submitCreate">{{ isEditing ? 'Update' : 'Add IP Address' }}</AppButton>
        </div>
      </template>
    </AppDrawer>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useToastStore } from '~/stores/toast'
import { useIpWhitelistStore } from '~/stores/ipWhitelist'
import { useDrawer } from '~/composables/useDrawer'

const props = defineProps({
  ipAddress: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['ip-created', 'ip-updated'])

const appDrawer = useDrawer()
const toast = useToastStore()
const ipWhitelistStore = useIpWhitelistStore()

const state = reactive({
  loading: false,
  id: 'ip-address-drawer',
  form: {
    address: '',
    description: '',
    is_active: true,
  },
})

const isEditing = computed(() => !!props.ipAddress)

const open = async () => {
  if (props.ipAddress) {
    state.form = {
      address: props.ipAddress.address,
      description: props.ipAddress.description || '',
      is_active: props.ipAddress.is_active,
    }
  }
  appDrawer.open(state.id)
}

const close = () => {
  appDrawer.close(state.id)
}

const back = () => {
  close()
}

const resetForm = () => {
  state.form = {
    address: '',
    description: '',
    is_active: true,
  }
}

const validateIpAddress = (ip) => {
  const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip)
}

const submitCreate = async () => {
  if (!state.form.address) {
    toast.error({
      message: 'IP address is required',
    })
    return
  }

  if (!validateIpAddress(state.form.address)) {
    toast.error({
      message: 'Please enter a valid IP address',
    })
    return
  }

  state.loading = true
  try {
    const payload = {
      ip_address: state.form.address,
      is_active: state.form.is_active,
    }

    if (state.form.description) {
      payload.label = state.form.description
    }

    if (isEditing.value) {
      const data = await ipWhitelistStore.updateIpAddress(props.ipAddress.id, payload)
      emit('ip-updated', data)
      toast.show({
        message: 'IP address updated successfully',
        color: 'green',
      })
    } else {
      const data = await ipWhitelistStore.createIpAddress(payload)
      emit('ip-created', data)
      toast.show({
        message: 'IP address added successfully',
        color: 'green',
      })
    }

    resetForm()
    close()
  } catch (err) {
    const message = err?.response?.data?.errors?.[0] || err?.response?.data?.message || 'Failed to add IP address'
    toast.error({
      message,
    })
  } finally {
    state.loading = false
  }
}
</script>
