import { reactive, toRefs } from 'vue'
import { useWalletStore } from '~/stores/wallet'

const state = reactive({
  wallets: [],
  loading: false,
  initialized: false,
  error: null,
  form: {
    wallet_type: null,
    wallet_name: null,
    currency: null,
    description: null,
  },
})

export const useWallet = () => {
  const walletStore = useWalletStore()

  const fetchWallets = async () => {
    state.loading = true
    state.error = null

    try {
      const res = await walletStore.getAllWallets()
      state.wallets = res.items
      state.initialized = true
      state.loading = false
    } catch (err) {
      state.error = err
    } finally {
      state.loading = false
    }
  }

  const createWallet = async (data) => {
    await walletStore.createWallet(data)
    await fetchWallets()
  }

  const withdrawalAndPaymentCalculator = async (data) => {
    return await walletStore.withdrawalAndPaymentCalculator(data)
  }

  const withdrawal = async (data) => {
    return await walletStore.withdrawal(data)
  }

  return {
    ...toRefs(state),
    fetchWallets,
    createWallet,
    withdrawalAndPaymentCalculator,
    withdrawal,
  }
}
