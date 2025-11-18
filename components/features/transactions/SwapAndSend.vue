'''
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
              {{ formatTransactionType(computedData.transaction_type) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="direction">
      <h6 class="uppercase mb-8 font-bold text-xs tracking-wide">conversion</h6>
      <div>
        <div class="summary pb-6">
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-2 pb-4">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">From Currency</p>
            <div class="flex space-y-2 flex-col items-end ml-auto text-emphasis-higher text-sm">
              <span>{{ fromWalletName }}</span>
              <span class="uppercase text-xs text-emphasis-medium"> {{ props.data.from_currency }}</span>
            </div>
          </div>
          <div class="flex items-start py-2 pt-4">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">To Currecy</p>
            <div class="flex space-y-2 flex-col items-end ml-auto text-emphasis-higher text-sm">
              <span>{{ toWalletName }}</span>
              <span class="uppercase text-xs text-emphasis-medium"> {{ props.data.to_currency }}</span>
            </div>
          </div>

          <div class="flex items-start border-b border-dashed border-b-surface-300 py-2">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">Amount Converted</p>
            <div class="flex space-y-2 flex-col ml-auto text-emphasis-higher text-sm">{{ $formatNumber(computedData.converted_amount) }} {{ computedCurrency }}</div>
          </div>
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-2">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">Conversion Fee</p>
            <div class="flex space-y-2 items-center ml-auto text-emphasis-higher text-sm">
              <span class="inline-flex items-center space-x-1">
                <span>{{ $formatNumber(computedData.transaction_fee) }}</span> <small class="uppercase mt-0.5">{{ computedFromCurrency }}</small>
              </span>
            </div>
          </div>
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-2">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">Exchange Rate</p>
            <div class="flex space-y-2 flex-col ml-auto text-emphasis-higher text-sm">
              {{ computedData.exchange_rate }}
            </div>
          </div>
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-2">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">Final Amount</p>
            <div class="flex space-y-2 flex-col ml-auto text-emphasis-higher text-sm">
              <span class="inline-flex items-center space-x-1">
                <span>{{ $formatNumber(computedData.amount) }}</span> <small class="uppercase mt-0.5">{{ computedFromCurrency }}</small>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h6 class="uppercase mb-8 font-bold text-xs tracking-wide">sending</h6>
      <div>
        <div class="summary pb-6">
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-3">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">Delivery Method</p>
            <div class="flex space-y-2 flex-col ml-auto text-emphasis-higher text-sm">
              {{ computedSendSession?.payin_method ?? 'N/A' }}
            </div>
          </div>
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-3">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">Delivery Type</p>
            <div class="flex space-y-2 flex-col ml-auto text-sm">
              {{ computedSendSession?.transaction_type ?? 'N/A' }}
            </div>
          </div>
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-3">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">Recipient</p>
            <div class="flex space-y-2 flex-col ml-auto text-sm">
              {{ computedSendSession?.recipient?.name ?? 'N/A' }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h6 class="uppercase mb-8 font-bold text-xs tracking-wide">breakdown</h6>
      <div>
        <div class="summary pb-6">
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-3">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">Amount</p>
            <div class="flex space-y-2 flex-col ml-auto text-emphasis-higher text-sm">{{ $formatNumber(computedData.amount) }} {{ computedCurrency }}</div>
          </div>
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-3">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">Delivery Fee</p>
            <div class="flex space-y-2 flex-col ml-auto text-sm">
              <span class="inline-flex items-center space-x-1">
                <span>{{ $formatNumber(computedData.processing_fee) }}</span>
                <small class="uppercase mt-0.5">{{ computedFromCurrency }}</small>
              </span>
            </div>
          </div>
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-3">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">Final Received</p>
            <div class="flex space-y-2 flex-col ml-auto text-sm">
              <span class="inline-flex items-center space-x-1">
                <span>{{ $formatNumber(computedData.amount) }}</span>
                <small class="uppercase mt-0.5">{{ computedFromCurrency }}</small>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h6 class="uppercase mb-8 font-bold text-xs tracking-wide">advanced details</h6>
      <div>
        <div class="summary pb-6">
          <div class="flex items-start border-b border-dashed border-b-surface-300 py-2">
            <p class="capitalize text-emphasis-medium text-sm leading-tight">initiated by</p>
            <div class="flex space-y-2 flex-col ml-auto text-emphasis-higher text-sm">
              {{ computedData.recipient.name }}
            </div>
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
import { useWalletStore } from '~/stores/wallet'
import { computed, onMounted, reactive } from 'vue'

const { getStatusGroup } = useTransactionStatus()

const props = defineProps({
  data: {
    type: Object,
  },
})

const walletStore = useWalletStore()

const state = reactive({})

const computedTxnStatus = computed(() => {
  return props.data?.status
})

const computedFromCurrency = computed(() => {
  return props.data?.from_currency
})

const computedToCurrency = computed(() => props.data?.to_currency)

const computedData = computed(() => props.data)

const fromWalletName = computed(() => {
  if (walletStore.wallets.length === 0) return 'Loading...'
  const wallet = walletStore.wallets.find((wallet) => wallet.id === props.data?.source_wallet_id)
  return wallet ? wallet.wallet_name : 'Unknown Wallet'
})

const toWalletName = computed(() => {
  if (walletStore.wallets.length === 0) return 'Loading...'
  const wallet = walletStore.wallets.find((wallet) => wallet.id === props.data?.recipient?.wallet_id)
  return wallet ? wallet.wallet_name : ''
})

const computedSendSession = computed(() => {
  return props.data?.send_session ?? undefined
})

const computedTxnType = computed(() => props.data?.transaction_type?.split('_')[0])

const computedFees = computed(() => {
  if (computedTxnType.value === 'deposit') {
    return props.data.processing_fee
  }
})

const formatTransactionType = (transactionType) => {
  if (!transactionType) return ''

  return transactionType
    .replace(/_transaction$/, '')
    .replace('and_', '& ')
    .replace('_', ' ')
}

const computedCurrency = computed(() => {
  const sameIncomingAndOutgoingCurrency = ['deposit', 'withdrawal', 'swap', 'payment']
  if (sameIncomingAndOutgoingCurrency.includes(computedTxnType.value)) {
    return props.data.exchange_rate.currency_id
  } else {
  }
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
'''
