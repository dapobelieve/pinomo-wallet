<template>
  <div>
    <div @click="open">
      <slot name="trigger">
        <AppButton>
          <template #prefix>
            <Icon :size="20" :stroke-width="3" name="plus" />
          </template>
          Create Account
        </AppButton>
      </slot>
    </div>

    <AppDrawer :id="state.id" @cancel="back" @close="close">
      <template #header>
        <h6 class="text-emphasis-higher text-xl font-bold">Create Service Account</h6>
      </template>
      <div class="px-6 mt-6">
        <div class="flex flex-col space-y-4">
          <AppInput v-model="state.form.full_name" required type="text">
            <template #label>Service Account Name (optional)</template>
          </AppInput>
          <AppInput v-model="state.form.email" type="email">
            <template #label>Email (optional)</template>
          </AppInput>
        </div>
      </div>
      <template #footer>
        <div class="bg-surface-200 flex w-full items-center px-4 py-3">
          <AppButton size="lg" type="ghost" @click.stop="back">Cancel</AppButton>
          <AppButton :loading="state.loading" class="ml-auto" @click.stop="submitCreate">Create Account</AppButton>
        </div>
      </template>
    </AppDrawer>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useTeam } from '~/composables/useTeam.js'
import { useToastStore } from '~/stores/toast'
import { useDrawer } from '~/composables/useDrawer'

const emit = defineEmits(['account-created'])

const { createServiceAccount, fetchRoles, roles } = useTeam()
const appDrawer = useDrawer()
const toast = useToastStore()

const state = reactive({
  loading: false,
  id: 'service-account-drawer',
  form: {
    full_name: '',
    email: '',
  },
})

const open = async () => {
  if (!roles.value || roles.value.length === 0) {
    try {
      await fetchRoles()
    } catch (err) {
      toast.error('Failed to load roles')
      return
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
    full_name: '',
    role_id: null,
  }
}

const submitCreate = async () => {
  state.loading = true
  const r = {}
  try {
    if (state.form.full_name) {
      r.full_name = state.form.full_name
    }
    if (state.form.email) {
      r.email = state.form.email
    }
    await createServiceAccount(r)

    toast.show({
      message: 'Service account created successfully',
      color: 'green',
    })
    resetForm()
    close()
    emit('account-created')
  } catch (err) {
    const message = err.errors[0] || 'Failed to create service account'
    toast.error({
      message,
    })
  } finally {
    state.loading = false
  }
}
</script>
