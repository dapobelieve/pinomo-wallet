<template>
  <div class="bg-surface-200 rounded-[40px] flex flex-col items-center w-full h-full max-w-[592px] shadow-2xl">
    <div style="height: calc(100% - 48px)" class="flex-1 overflow-auto no-scrollbar flex items-center py-8">
      <div class="flex flex-col h-fit items-center w-full max-w-96 px-4">
        <h6 class="text-emphasis-higher leading-loose font-bolder text-2xl mb-6">Create your account</h6>

        <AppInput
          v-model="state.name"
          :errMsg="v$.name.$error ? v$.name?.$errors[0]?.$message : ''"
          class="mb-4"
          placeholder=""
          type="text"
        >
          <template #label>
            <span class="text-sm">Full Name</span>
          </template>
        </AppInput>

        <AppInput
          v-model="state.email"
          :errMsg="v$.email.$error ? v$.email?.$errors[0]?.$message : ''"
          class="mb-4"
          name="email"
          placeholder=""
          type="email"
        >
          <template #label>
            <span class="text-sm">Email</span>
          </template>
        </AppInput>

        <AppInput
          v-model="state.password"
          :errMsg="v$.password.$error ? v$.password?.$errors[0]?.$message : ''"
          class="mb-2"
          placeholder=""
          type="password"
        >
          <template #label>
            <span class="text-sm">Password</span>
          </template>
        </AppInput>

        <div class="mb-4 w-full">
          <span class="ml-3 space-x-3 text-xs flex items-center space-y-1" :class="getValidationClass(hasMinLength)">
            <Icon :size="19" :stroke-width="3" class="mt-1" name="check" />
            <span>At least 8 characters</span>
          </span>
          <span class="ml-3 space-x-3 text-xs flex items-center space-y-1" :class="getValidationClass(hasUppercase)">
            <Icon :size="19" :stroke-width="3" class="mt-1" name="check" />
            <span>At least 1 uppercase letter (A-Z)</span>
          </span>
          <span class="ml-3 space-x-3 text-xs flex items-center space-y-1" :class="getValidationClass(hasNumber)">
            <Icon :size="19" :stroke-width="3" class="mt-1" name="check" />
            <span>At least 1 number (0-9)</span>
          </span>
          <span class="ml-3 space-x-3 text-xs flex items-center space-y-1" :class="getValidationClass(hasSpecialChar)">
            <Icon :size="19" :stroke-width="3" class="mt-1" name="check" />
            <span>At least 1 special character (!, @, #, etc.)</span>
          </span>
        </div>

        <AppInput
          v-model="state.password_confirmation"
          :errMsg="v$.password_confirmation.$error ? v$.password_confirmation?.$errors[0]?.$message : ''"
          class="mb-6"
          placeholder=""
          type="password"
        >
          <template #label>
            <span class="text-sm">Confirm Password</span>
          </template>
        </AppInput>

        <div class="flex flex-col gap-6 items-center w-full">
          <span class="text-xs text-center text-emphasis-medium">
            By continuing, you accept our
            <nuxt-link class="text-primary" to="#">Terms of Service</nuxt-link> and have read our
            <nuxt-link class="text-primary" to="#">Privacy Policy.</nuxt-link>
          </span>
          <AppButton
            :loading="state.loading"
            :disabled="!isFormValid"
            class="w-full text-center py-4 px-3 text-sm"
            size="lg"
            @click="handleRegister"
          >
            Create Account
          </AppButton>
          <span class="text-sm">
            Already have an account?
            <nuxt-link to="login" class="text-primary">Login</nuxt-link>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth.js'
import { helpers, required, email, minLength, sameAs } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

const toast = useToastStore()
const authStore = useAuthStore()

definePageMeta({
  layout: 'register',
})

const state = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  loading: false,
})

const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage('Name is required', required),
      minLength: helpers.withMessage('Name must be at least 2 characters', minLength(2)),
      $autoDirty: true,
    },
    email: {
      required: helpers.withMessage('Email is required', required),
      email: helpers.withMessage('Please enter a valid email address', email),
      $autoDirty: true,
    },
    password: {
      required: helpers.withMessage('Password is required', required),
      minLength: helpers.withMessage('Password must be at least 8 characters', minLength(8)),
      $autoDirty: true,
    },
    password_confirmation: {
      required: helpers.withMessage('Password confirmation is required', required),
      sameAs: helpers.withMessage('Passwords must match', sameAs(computed(() => state.password))),
      $autoDirty: true,
    },
  }
})

const v$ = useVuelidate(rules, state)

const { hasMinLength, hasUppercase, hasNumber, hasSpecialChar, isPasswordValid, getValidationClass } = usePasswordValidation(computed(() => state.password))

const isFormValid = computed(() => {
  return (
    state.name.length >= 2 &&
    state.email &&
    state.password.length >= 8 &&
    state.password === state.password_confirmation &&
    isPasswordValid.value
  )
})

const handleRegister = async () => {
  if (await v$.value.$validate()) {
    state.loading = true
    try {
      const registrationData = {
        name: state.name,
        email: state.email,
        password: state.password,
        password_confirmation: state.password_confirmation,
      }

      const response = await authStore.register(registrationData)

      if (response.data?.token && response.data?.user) {
        await authStore.setToken(response.data.token, response.data.token)
        authStore.setUser(response.data.user)

        toast.show({
          message: response.message || 'Registration successful',
          color: 'green',
        })

        setTimeout(() => {
          navigateTo('/')
        }, 500)
      }
    } catch (e) {
      toast.error({
        message: e.message || 'Registration failed. Please try again.',
      })
    } finally {
      state.loading = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
