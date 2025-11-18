<template>
  <div class="txn-details">
    <div>
      <h6 class="uppercase mb-8 font-bold text-xs tracking-wide">transaction details</h6>
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
            <p class="capitalize text-emphasis-medium text-sm leading-tight">From (Wallet)</p>
            <div class="flex space-y-2 flex-col items-end ml-auto text-emphasis-higher text-sm">
              <span>{{ fromWalletName }}</span>
              <span class="uppercase"> {{ props.data.from_currency }}</span>
            </div>
          </div>
          <div class="flex items-start py-2 pt-4">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">Recipient</p>
            <div class="flex space-y-2 capitalize flex-col ml-auto text-sm">
              <span class="uppercase"> {{ props.data?.other_account ?? 'N/A' }}</span>
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
            <div class="flex space-y-2 flex-col ml-auto text-emphasis-higher text-sm">{{ $formatNumber(computedData.amount) }} {{ computedCurrency }}</div>
          </div>
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-2">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">Fees</p>
            <div class="flex space-y-2 flex-col ml-auto text-sm">{{ $formatNumber(computedFees) }} {{ computedCurrency }}</div>
          </div>
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-2">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">Total Debited</p>
            <div class="flex space-y-2 flex-col ml-auto text-sm">{{ $formatNumber(computedData.amount) }} {{ computedCurrency }}</div>
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
            <div class="flex space-y-2 flex-col ml-auto text-emphasis-higher text-sm">N/A</div>
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
import { computed, onMounted } from 'vue'
import { useWalletStore } from '~/stores/wallet.js'

const { getStatusGroup } = useTransactionStatus()
const walletStore = useWalletStore()
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
const computedTxnType = computed(() => props.data?.transaction_type)

const fromWalletName = computed(() => {
  return props.data?.other_account || props.data?.currency || 'N/A'
})

const computedTxnStatus = computed(() => props.data?.status)

const computedFees = computed(() => {
  if (computedTxnType.value === 'deposit') {
    return props.data.processing_fee
  }
})

const computedCurrency = computed(() => {
  return props.data?.currency?.toUpperCase() || 'N/A'
})

onMounted(async () => {
  try {
    if (walletStore.wallets.length === 0) {
      await walletStore.getAllWallets()
    }
  } catch (e) {
    console.log('Error fetching wallets:', e)
  }
})
</script>

<style lang="scss" scoped></style>
