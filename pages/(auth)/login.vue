<template>
  <div class="flex items-center justify-center w-full">
    <div class="max-w-96 w-80 space-y-10">
      <h6 class="text-black text-center font-bold text-xl mb-16">Login</h6>
      <div>
        <AppInput v-model="state.email" class="mb-6" placeholder="Email" type="email"> </AppInput>
        <AppInput v-model="state.password" class="mb-8" placeholder="Password" type="password"> </AppInput>
        <div class="flex items-center mb-20">
          <div class="max-w-[8.93rem] ml-auto w-full">
            <AppButton :loading="state.loading" class="ml-auto w-full text-center py-4 px-3 text-sm" size="lg" @click="login">Login </AppButton>
          </div>
        </div>
        <div class="flex w-full justify-center">
          <span class="text-sm text-center"
            >New business?
            <nuxt-link to="register">Create an Account</nuxt-link>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth.js'

definePageMeta({
  layout: 'login',
})
const authStore = useAuthStore()
const route = useRoute()
const toast = useToastStore()

const state = reactive({
  userType: null,
  email: null,
  password: null,
})

const login = async () => {
  state.loading = true
  try {
    const res = await authStore.login({ ...state })

    const { token, user } = res.data

    await authStore.setToken(token, token)
    authStore.setUser(user)

    toast.show({
      message: 'Login successful',
      color: 'green',
      duration: 3000,
    })

    navigateTo('/')
  } catch (e) {
    toast.error({
      message: e.message || e.detail || 'Login failed. Please try again.',
      duration: 3000,
    })
  } finally {
    state.loading = false
  }
}
</script>

<style lang="scss" scoped></style>
