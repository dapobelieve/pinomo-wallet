<template>
  <AppDrawer id="settings-email-drawer" @cancel="back" @close="close" @proceed="proceed">
    <template #header>
      <h6 class="text-emphasis-higher text-xl font-bold">Change Email</h6>
    </template>
    <div class="px-4 space-y-8">
      <span class="tracking-wide text-sm text-emphasis-low"> Type or paste email </span>
      <AppInput class="mt-4" placeholder="">
        <template #label class="text-xs">Email Address</template>
      </AppInput>
    </div>
  </AppDrawer>
</template>

<script setup>
import { reactive } from 'vue'

const { flags, countries } = useImages()

const appDrawer = useDrawer()

const props = defineProps({})

const state = reactive({
  id: 'settings-email-drawer',
  step: 'WITHDRAW_INPUTS',
  breakdown: [
    {
      icon: 'minus',
      text: 'our fee',
      value: 0.0,
      classes: 'before:content before:w-[2px] relative before:absolute before:h-[15px] before:bottom-[36px] before:left-[37px] before:bg-surface-400',
    },
    {
      icon: 'equal',
      text: 'we convert',
      value: 0.0,
      classes: 'before:content before:w-[2px] relative before:absolute before:h-[15px] before:bottom-[36px] before:left-[37px] before:bg-surface-400',
    },
    {
      icon: 'x',
      text: 'exchange rate',
      value: 0.0,
      classes: 'before:content before:w-[2px] relative before:absolute before:h-[15px] before:bottom-[36px] before:left-[37px] before:bg-surface-400',
    },
  ],
  description: '',
  selectedWallet: {},
  recipient: {},
  selectedRecipientConfig: {},
  from: {
    country: null,
    amount: 0.0,
  },
  to: {
    country: null,
    amount: 0.0,
  },
  fees: {
    amount: 0.0,
  },
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
