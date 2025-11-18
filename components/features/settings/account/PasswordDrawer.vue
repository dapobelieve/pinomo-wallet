<template>
  <AppDrawer id="settings-password-drawer" @cancel="back" @close="close" @proceed="proceed">
    <template #header>
      <h6 class="text-emphasis-higher text-xl font-bold">Change Password</h6>
    </template>
    <div class="px-4">
      <AppInput v-model="state.otp" class="mb-6" placeholder="" type="password">
        <template #label> Your Current Password </template>
      </AppInput>
      <AppInput v-model="state.new_password" class="mb-6" placeholder="New Password" type="password">
        <template #label> New Password </template>
      </AppInput>
      <div class="mb-6 w-full">
        <span class="ml-3 text-emphasis-low space-x-3 text-xs flex items-center space-y-1">
          <Icon :size="19" :stroke-width="3" class="mt-1" name="check" />
          <span class=" ">At least 8 characters</span>
        </span>
        <span class="ml-3 text-emphasis-low space-x-3 text-xs flex items-center space-y-1">
          <Icon :size="19" :stroke-width="3" class="mt-1" name="check" />
          <span class=" ">At least 1 uppercase letter (A-Z)</span>
        </span>
        <span class="ml-3 text-emphasis-low space-x-3 text-xs flex items-center space-y-1">
          <Icon :size="19" :stroke-width="3" class="mt-1" name="check" />
          <span class=" ">At least 1 number (0-9)</span>
        </span>
        <span class="ml-3 text-emphasis-low space-x-3 text-xs flex items-center space-y-1">
          <Icon :size="19" :stroke-width="3" class="mt-1" name="check" />
          <span class=" ">At least 1 special character (!, @, #, etc.)</span>
        </span>
      </div>
      <AppInput v-model="state.password2" class="mb-6" placeholder="New Password" type="password">
        <template #label> Confirm New Password </template>
      </AppInput>
    </div>
    <template #footer>
      <div class="bg-surface-200 flex w-full items-center px-4 py-3">
        <AppButton size="lg" type="ghost" @click.stop="">Cancel</AppButton>
        <AppButton class="ml-auto" @click.stop="">Update</AppButton>
      </div>
    </template>
  </AppDrawer>
</template>

<script setup>
import { reactive } from 'vue'

const { flags, countries } = useImages()

const appDrawer = useDrawer()

const props = defineProps({})

const state = reactive({
  id: 'settings-password-drawer',
  email: null,
  otp: null,
  new_password: null,
  password2: null,
  loading: false,
})

const keypressed = (event) => {
  if (!/[\d.\-]|Backspace/.test(event.key)) {
    event.preventDefault()
  }
}

const proceed = () => {
  if (state.step === 'WITHDRAW_INPUTS') {
    if (!state.selectedWallet.name) {
      return
    }
    state.step = 'WITHDRAW_RECIPIENT'
  } else if (state.step === 'WITHDRAW_RECIPIENT') {
    if (!state.recipient.id) {
      return
    }
    state.step = 'WITHDRAW_SUMMARY'
  } else if (state.step === 'WITHDRAW_SUMMARY') {
    close()
  }
}

const back = () => {
  if (state.step === 'WITHDRAW_RECIPIENT') {
    state.step = 'WITHDRAW_INPUTS'
  } else if (state.step === 'WITHDRAW_SUMMARY') {
    state.step = 'WITHDRAW_RECIPIENT'
  } else {
    close()
  }
}

const close = () => {
  appDrawer.close(state.id)
}

const fromAmount = useCurrencyInput(state, 'from.amount')
// const toAmount = useCurrencyInput(state, 'to.amount');
// const feesAmount = useCurrencyInput(state, 'fees.amount');
</script>

<style lang="scss" scoped>
/* Your styles here */
</style>
