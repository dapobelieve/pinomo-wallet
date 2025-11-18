<template>
  <AppDrawer :id="state.id" :show-footer="false" :show-header="true" close-on-outside-click @close="close">
    <template #header>
      <div v-if="props.data.transaction_type" class="flex flex-col">
        <div class="capitalize bg-surface-400 text-emphasis-higher leading-none tracking-wide text-xs font-semibold px-2 py-1 rounded">
          {{ formatTransactionType(props.data.transaction_type) }}
        </div>
      </div>
    </template>
    <template #sub-header>
      <div class="bg-surface-400">
        <div class="flex items-center px-4 pt-4 pb-7 bg-surface-400">
          <h6 class="text-4xl text-emphasis-higher">
            {{ $formatNumber(computedData.amount) }} <small class="text-sm">{{ computedCurrency }}</small>
          </h6>
          <div class="w-12 ml-auto h-12 bg-base flex items-center justify-center rounded-full">
            <Icon :name="computedTxnIcon" :size="30" :stroke-width="1.5" class="text-emphasis-medium" />
          </div>
        </div>
        <div class="bg-surface-100 rounded-t-3xl h-8 borders"></div>
      </div>
    </template>
    <div v-if="props.data.transaction_type" class="px-4 flex flex-col space-y-8">
      <div class="statuses flex justify-between">
        <div class="inline-flex timeline flex-col items-start w-fit">
          <Icon :size="25" :stroke-width="2" class="text-green-600 mb-4" name="circle-check" />
          <div>
            <h6 class="text-emphasis-higher">Initiated</h6>
            <small class="text-emphasis-low">13 Feb 2025</small>
          </div>
        </div>
        <div class="inline-flex flex-col items-start w-fit">
          <Icon :size="25" :stroke-width="2" class="text-green-600 mb-4" name="circle-check" />
          <div>
            <h6 class="text-emphasis-higher">Processing</h6>
            <small class="text-emphasis-low">13 Feb 2025</small>
          </div>
        </div>
        <div class="inline-flex flex-col items-start w-fit">
          <Icon :size="25" :stroke-width="2" class="text-green-600 mb-4" name="circle-check" />
          <div>
            <h6 class="text-emphasis-higher">Completed</h6>
            <small class="text-emphasis-low">13 Feb 2025</small>
          </div>
        </div>
      </div>
      <SwapTxnDetails v-if="props.data.transaction_type === 'swap_transaction'" :data="props.data" />
      <DepositTxnDetails v-if="props.data.transaction_type === 'deposit_transaction'" :data="props.data" />
      <SwapAndSend v-if="props.data.transaction_type === 'swap_and_send_transaction'" :data="props.data" />
      <PaymentTxnDetails v-if="props.data.transaction_type === 'payment_transaction'" :data="props.data" />
    </div>
  </AppDrawer>
</template>

<script setup>
import { useWalletStore } from '~/stores/wallet.js'

const { $formatDate } = useNuxtApp()
const walletStore = useWalletStore()
const appDrawer = useDrawer()
const props = defineProps({
  data: {
    type: Object,
  },
})

const state = reactive({
  id: 'transaction-details-drawer',
  fetchingWallet: false,
  wallet: {},
  txnTypes: {
    deposit: 'circle-plus',
    withdrawal: 'circle-minus',
    excahnge: 'exchange',
    swap: 'exchange',
    payment: 'arrow-right-circle',
  },
})
const { flags } = useImages()

const computedData = computed(() => props.data)
const computedTxnType = computed(() => props.data?.transaction_type?.split('_')[0])

const formatTransactionType = (transactionType) => {
  if (!transactionType) return ''

  return transactionType
    .replace(/_transaction$/, '')
    .replace('and_', '& ')
    .replace('_', ' ')
}

const computedTxnIcon = computed(() => {
  return state.txnTypes[computedTxnType.value]
})

const computedCurrency = computed(() => {
  if (props.data?.transaction_type === 'swap_and_send_transaction') {
    return props.data?.from_currency?.toUpperCase()
  }

  return props.data?.from_currency?.toUpperCase()
})

onMounted(async () => {
  try {
    if (props.data.destination_wallet_id) {
      const wallet = await walletStore.getSingleWallet(props.data.destination_wallet_id)
      state.wallet = wallet
    }
  } catch (e) {
    console.log(e)
  } finally {
    state.fetchingWallet = false
  }
})

const close = () => {
  appDrawer.close(state.id)
}
</script>

<style lang="scss" scoped></style>
