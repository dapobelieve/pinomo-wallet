<template>
  <div class="txn-details">
    <div>
      <h6 class="uppercase mb-8 font-bold text-xs tracking-wide">transaction details ssss</h6>
      <div>
        <div class="summary pb-6">
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-2">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">Transaction ID</p>
            <div class="flex space-y-2 flex-col ml-auto text-sm">
              {{ computedData.reference }}
            </div>
          </div>
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-2">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">Date/Time</p>
            <div class="flex space-y-2 flex-col ml-auto text-sm">
              {{ $formatDate(computedData.created_at, 'd LLL yyyy, H:m aaaa') }}
            </div>
          </div>
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-2">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">Status</p>
            <div class="flex space-y-2 flex-col ml-auto text-sm">
              <TxnDetailsStatus :status="getStatusGroup(computedTxnStatus)" />
            </div>
          </div>
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-2">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">Type</p>
            <div class="flex space-y-2 capitalize flex-col ml-auto text-sm">
              {{ computedTxnType }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="direction">
      <h6 class="uppercase mb-8 font-bold text-xs tracking-wide">direction</h6>
      <div>
        <div class="summary pb-6">
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-2 pb-4">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">From Currency</p>
            <div class="flex space-y-2 flex-col ml-auto text-emphasis-higher text-sm">
              <div class="flex space-y-2 flex-col items-end ml-auto text-emphasis-higher text-sm">
                <span>{{ fromWalletName }}</span>
                <span class="uppercase"> {{ props.data.from_currency }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-start py-2 pt-4">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">To Currecy</p>
            <div class="flex space-y-2 capitalize flex-col ml-auto text-sm">
              <div class="flex space-y-2 flex-col items-end ml-auto text-emphasis-higher text-sm">
                <span>{{ toWalletName }}</span>
                <span class="uppercase"> {{ props.data.to_currency }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h6 class="uppercase mb-8 font-bold text-xs tracking-wide">breakdown</h6>
      <div>
        <div class="summary pb-6">
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-2">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">Amount</p>
            <div class="flex space-y-2 flex-col ml-auto text-emphasis-higher text-sm">{{ $formatNumber(computedData.amount) }} {{ computedData.from_currency.toUpperCase() }}</div>
          </div>
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-2">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">Fees</p>
            <div class="flex space-y-2 flex-col ml-auto text-sm">{{ $formatNumber(computedFees) }} {{ computedData.from_currency.toUpperCase() }}</div>
          </div>
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-2">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">Total Received</p>
            <div class="flex space-y-2 flex-col ml-auto text-sm">{{ $formatNumber(computedData.converted_amount) }} {{ computedData.to_currency.toUpperCase() }}</div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h6 class="uppercase mb-8 font-bold text-xs tracking-wide">additional</h6>
      <div>
        <div class="summary pb-6">
          <div class="flex itaems-start border-b border-dashed border-b-surface-300 py-2">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">initiated by</p>
            <div class="flex space-y-2 flex-col ml-auto text-emphasis-higher text-sm">{{ computedData.user.first_name }} {{ computedData.user.last_name }}</div>
          </div>
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-2">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">notes</p>
            <div class="flex space-y-2 flex-col ml-auto text-sm">--</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TxnDetailsStatus from '~/components/features/transactions/TxnDetailsStatus.vue'
import { computed } from 'vue'
import { useWalletStore } from '~/stores/wallet.js'

const walletStore = useWalletStore()

const { getStatusGroup } = useTransactionStatus()
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

const computedData = computed(() => props.data)
const computedTxnType = computed(() => props.data?.transaction_type?.split('_')[0])

const fromWalletName = computed(() => {
  if (walletStore.wallets.length === 0) return 'Loading...'
  const wallet = walletStore.wallets.find((wallet) => wallet.id === props.data?.source_wallet_id)
  return wallet ? wallet.wallet_name : 'Unknown Wallet'
})

const toWalletName = computed(() => {
  return props.data?.recipient.name
})

const computedTxnStatus = computed(() => {
  return props.data?.status
})

const computedFees = computed(() => {
  return props.data.processing_fee
})

const computedWallet = computed(() => {
  if (!props.data.destination_wallet_id) {
    return 'N/A'
  }
})

const computedCurrency = computed(() => {
  const sameIncomingAndOutgoingCurrency = ['deposit', 'withdrawal', 'swap', 'payment']
  if (sameIncomingAndOutgoingCurrency.includes(computedTxnType.value)) {
    return props.data.exchange_rate.currency_id
  } else {
  }
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
</script>

<style lang="scss" scoped></style>
