<template>
  <AppDrawer :id="state.id" @cancel="close" @close="close" @proceed="proceed">
    <template #header>
      <h6 class="text-emphasis-higher text-xl font-bold">Deposit</h6>
    </template>
    <template #sub-header>
      <div class="sub-header bg-surface-200 border-surface-400 flex flex-col gap-1.5 border-t border-b py-4 pr-3 pl-4">
        <h6 class="text-emphasis-higher leading-tight font-bold">Deposit Funds</h6>
        <p class="text-emphasis-medium text-sm leading-tight">Add funds to your wallet</p>
      </div>
    </template>
    <div class="px-3 pt-3 pb-4">
      <div class="selections mb-4">
        <div class="select-wallet-card bg-base border-surface-400 flex flex-col gap-2 rounded-2xl p-1 border">
          <div class="flex flex-col space-y-2">
            <div class="flex items-center pt-4 px-3 w-full">
              <h6 class="text-emphasis-medium text-xs uppercase tracking-wide">to wallet</h6>
              <p v-if="state.selectedWallet?.balance" class="tracking-wide ml-auto text-emphasis-low text-xs">
                Balance: {{ $formatNumber(state.selectedWallet.balance) }} {{ state.selectedWallet.currency }}
              </p>
            </div>
            <div class="bg-surface-100 hover:bg-surface-200 cursor-default rounded-3xl px-4 py-3">
              <div class="flex items-center justify-between">
                <div class="flex flex-col">
                  <span class="text-emphasis-higher font-semibold text-sm">{{ state.selectedWallet?.wallet_name || 'Loading...' }}</span>
                  <span class="text-emphasis-medium text-xs">{{ state.selectedWallet?.currency || '' }}</span>
                </div>
                <div class="text-right">
                  <span class="text-emphasis-higher font-bold text-sm">{{ state.selectedWallet?.balance ? $formatNumber(state.selectedWallet.balance) : '0.00' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="inputs">
        <div class="from-input bg-base outline-surface-400 flex items-center w-full rounded-3xl py-3 px-4 outline">
          <span class="tracking-wide uppercase leading-none flex-1 text-emphasis-medium font-bold text-xs">Amount</span>
          <input
            v-model="formattedAmount"
            autofocus
            class="placeholder:text-emphasis-low text-emphasis-higher border-0 bg-white font-bold placeholder:text-xl placeholder:font-bold focus:shadow-none focus:outline-none"
            dir="rtl"
            placeholder="0.00"
            type="text"
            @keydown="keypressed"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <div class="bg-surface-200 flex w-full items-center px-4 py-3">
        <AppButton size="lg" type="ghost" @click.stop="close">Cancel</AppButton>
        <AppButton :disabled="!isFormValid" :loading="state.loading" class="ml-auto" @click.stop="proceed">Deposit</AppButton>
      </div>
    </template>
  </AppDrawer>
</template>

<script setup>
import { reactive, computed, watch, onMounted } from 'vue'
import { AppDrawerStore } from '@/stores/drawer'

const { $formatNumber } = useNuxtApp()
const walletStore = useWalletStore()
const toast = useToastStore()
const appDrawer = useDrawer()
const drawerStore = AppDrawerStore()

const state = reactive({
  id: 'deposit-drawer',
  selectedWallet: {},
  form: {
    amount: 0,
  },
  loading: false,
})

const loadDefaultWallet = async () => {
  if (walletStore.wallets && walletStore.wallets.length > 0) {
    state.selectedWallet = walletStore.wallets[0]
  } else {
    await walletStore.getAllWallets()
    if (walletStore.wallets && walletStore.wallets.length > 0) {
      state.selectedWallet = walletStore.wallets[0]
    }
  }
}

const keypressed = (event) => {
  if (!/[\d.\-]|Backspace/.test(event.key)) {
    event.preventDefault()
  }
}

const isFormValid = computed(() => {
  return !!(
    state.form.amount &&
    parseFloat(state.form.amount) > 0 &&
    state.selectedWallet?.currency
  )
})

const proceed = async () => {
  if (!isFormValid.value) return

  state.loading = true
  try {
    const res = await walletStore.walletDeposit({
      amount: parseFloat(state.form.amount),
      currency: state.selectedWallet.currency,
      description: 'Wallet deposit',
    })

    await walletStore.getAllWallets()

    toast.show({
      message: res.message || 'Deposit processed successfully',
      color: 'green',
      duration: 5000,
    })

    close()

  } catch (e) {
    toast.show({
      message: e.response?.data?.message || e.message || 'Failed to process deposit',
      color: 'red',
      duration: 5000,
    })
  } finally {
    state.loading = false
  }
}

const close = () => {
  state.selectedWallet = {}
  state.form.amount = 0
  appDrawer.close(state.id)
}

const formattedAmount = useCurrencyInput(state, 'form.amount')

watch(
  () => drawerStore.getDrawerById(state.id)?.preSelectedWallet,
  async (preSelectedWallet) => {
    if (preSelectedWallet && Object.keys(preSelectedWallet).length > 0) {
      state.selectedWallet = preSelectedWallet
    } else {
      await loadDefaultWallet()
    }
  },
  { immediate: true },
)

onMounted(async () => {
  if (!state.selectedWallet || Object.keys(state.selectedWallet).length === 0) {
    await loadDefaultWallet()
  }
})
</script>

<style lang="scss" scoped></style>
