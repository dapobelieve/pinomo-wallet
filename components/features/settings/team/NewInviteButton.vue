<template>
  <div>
    <div @click="open">
      <slot name="trigger">
        <AppButton>
          <template #prefix>
            <Icon :size="20" :stroke-width="3" name="plus" />
          </template>
          Invite Member
        </AppButton>
      </slot>
    </div>
    <AppDrawer :id="state.id" @cancel="back" @close="close">
      <template #header>
        <h6 class="text-emphasis-higher text-xl font-bold">Invite Team Member</h6>
      </template>
      <div class="px-6 mt-6">
        <div class="flex flex-col space-y-4">
          <AppInput v-model="state.form.full_name" :errMsg="v$.full_name.$error ? v$.full_name?.$errors[0]?.$message : ''" required type="text">
            <template #label>Full Name</template>
          </AppInput>
          <AppInput v-model="state.form.email" :errMsg="v$.email.$error ? v$.email?.$errors[0]?.$message : ''" required type="email">
            <template #label>Email</template>
          </AppInput>
          <AppSelect v-model="state.form.role_id" :options="roleOptions" :errMsg="v$.role_id.$error ? v$.role_id?.$errors[0]?.$message : ''" label="Select Role" required>
            <template #selected-option="slotProps">
              <span>{{ slotProps.name }}</span>
            </template>
            <template #option="option">
              <span>{{ option.name }}</span>
            </template>
          </AppSelect>
        </div>
      </div>
      <template #footer>
        <div class="bg-surface-200 flex w-full items-center px-4 py-3">
          <AppButton size="lg" type="ghost" @click.stop="back">Cancel</AppButton>
          <AppButton :loading="state.loading" class="ml-auto" buttonType="button" @click.stop="submitInvite">Invite</AppButton>
        </div>
      </template>
    </AppDrawer>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useTeam } from '~/composables/useTeam'
import { helpers, required, email, minLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

const emit = defineEmits(['invite-sent'])

const { createInvite, fetchRoles, roles } = useTeam()
const appDrawer = useDrawer()
const toast = useToastStore()

const state = reactive({
  loading: false,
  id: 'settings-new-invite',
  form: {
    full_name: '',
    email: '',
    role_id: null,
  },
})

const roleOptions = computed(() =>
  (roles.value || []).map((r) => ({
    name: r.name,
    value: r.id,
    ...r,
  })),
)

const rules = computed(() => {
  return {
    full_name: {
      required: helpers.withMessage('Full name is required', required),
      minLength: helpers.withMessage('Full name must be at least 2 characters', minLength(2)),
      $autoDirty: true,
    },
    email: {
      required: helpers.withMessage('Email is required', required),
      email: helpers.withMessage('Please enter a valid email address', email),
      $autoDirty: true,
    },
    role_id: {
      required: helpers.withMessage('Please select a role', required),
      $autoDirty: true,
    },
  }
})

const v$ = useVuelidate(rules, state.form)

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
    email: '',
    role_id: null,
  }
}

const submitInvite = async () => {
  if (await v$.value.$validate()) {
    state.loading = true
    try {
      await createInvite({
        full_name: state.form.full_name,
        email: state.form.email,
        role_id: state.form.role_id.id || state.form.role_id.value,
      })
      emit('invite-sent')

      toast.show({
        message: 'Invite sent successfully',
        color: 'green',
      })

      resetForm()
      close()
    } catch (err) {
      const message = err?.message || 'Failed to send invite'
      toast.error(message)
    } finally {
      state.loading = false
    }
  }
}
</script>
