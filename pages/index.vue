<template>
  <header class="bg-surface-100 border-surface-400 border-b-1 px-6 pt-6">
    <div class="mb-2 flex items-center">
      <h6 class="text-2xl font-bold">Balances</h6>
    </div>
    <div>
      <div class="text-emphasis-medium flex items-center relative">
        <NuxtLink :class="$route.path === '/' ? 'text-dark' : ''" class="cursor-pointer p-3 pl-0 transition-colors duration-200" to="/"> Bank Wallet </NuxtLink>
      </div>
    </div>
  </header>
  <div v-if="wallets.length || state.loading" class="flex flex-col">
    <div class="content">
      <div class="bg-surface-200 inline-flex no-scrollbar space-x-4 overflow-x-scroll px-6 py-6">
        <template v-if="state.loading">
          <BalanceCardSkeleton v-for="x in 5" :key="x" />
        </template>
        <BalanceCard v-else v-for="(wallet, index) in computedDefaultWallets" :key="wallet.id" :pattern="patterns['cone']" :wallet="wallet" :color="getColorForIndex(index)" />
      </div>
    </div>
    <div class="border-t-surface-400 border-t">
      <div class="py-10 px-6">
        <AppTableSkeleton v-if="transactionsLoading"></AppTableSkeleton>
        <AppTable :headings="state.headings" :loading="transactionsLoading" :pagination="true" :per-page="4" :table-data="tableData" :total="pagination.total">
          <template #tableRows="{ rowData }">
            <td class="text-primary">
              <div class="inline-flex items-start space-x-2">
                <Icon :size="8" class="text-green-500" name="circle-filled"></Icon>
                <span class="-mt-2 inline-flex items-center" @click.stop>
                  {{ rowData.internal_reference }}
                  <CopyToClipboard
                    :hideToggleIcon="true"
                    :hideInput="true"
                    :value="rowData.internal_reference"
                    container-class="w-fit"
                    label=""
                    @copied="toast.show({ message: 'copied!', color: 'green', duration: 500 })"
                  />
                </span>
              </div>
            </td>

            <td class="">
              {{ rowData.other_account || rowData.currency || 'N/A' }}
            </td>
            <td class="capitalize">{{ formatTransactionType(rowData.transaction_type) }}</td>
            <td>
              <TxnDetailsStatus :status="getStatusGroup(rowData.status)" />
            </td>

            <td>
              <div class="inline-flex items-center space-x-2">
                <Icon
                  v-if="rowData.type"
                  :key="rowData.type"
                  :size="16"
                  :class="rowData.type === 'incoming' ? 'text-green-500' : 'text-red-500'"
                  :name="rowData.type === 'incoming' ? 'arrow-down' : 'arrow-up'"
                />
                <span>{{ $formatNumber(rowData.amount) }}</span>
                <span class="font-bold text-emphasis-low">{{ rowData.currency?.toUpperCase() }}</span>
              </div>
            </td>
            <td class="inline-flex items-center space-x-2">
              <Icon :name="state.txnTypes[rowData.transaction_type] || 'circle-filled'" :size="15" :stroke-width="3" class="text-emphasis-high mr-2" />
              {{ rowData.description }}
            </td>
            <td class="text-sm text-emphasis-high">
              {{ $formatDate(rowData.created_at, 'd LLL yyyy') }}
              <small class="text-emphasis-medium">{{ $formatDate(rowData.created_at, 'H:m aaaa') }}</small>
            </td>
          </template>
        </AppTable>
      </div>
    </div>
    <TransactionDetailsDrawer :data="state.detailsData" />
  </div>
  <div v-else class="w-full h-full sflex justify-center">
    <div class="flex flex-col space-y-6 h-96 py-8 items-center">
      <img class="h-[112px]" src="https://res.cloudinary.com/believe/image/upload/v1747767057/maraboo/client/emptyState.png" />
      <div class="flex flex-col items-center space-y-2">
        <h6 class="text-sm">No Bank Wallets found</h6>
        <p class="text-emphasis-low text-xs text-center">
          Create a bank wallet to view your <br />
          balance
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useTransaction } from '~/composables/useTransaction'
import TxnDetailsStatus from '~/components/features/transactions/TxnDetailsStatus.vue'
import CopyToClipboard from '~/components/CopyToClipboard.vue'
import AppTableSkeleton from '~/components/common/AppTableSkeleton.vue'

const { wallets, fetchWallets, error: walletError } = useWallet()
const { patterns } = useImages()
const { getColorForIndex } = useWalletColors()
const { getStatusGroup } = useTransactionStatus()

const { transactions, pagination, error, loading: transactionsLoading, fetchTransactions } = useTransaction()
const { $formatDate } = useNuxtApp()
const toast = useToastStore()
const appDrawer = useDrawer()

const props = defineProps({
  mockData: {
    type: Array,
    default: null,
  },
})
const state = reactive({
  loading: false,
  menu: {},
  wallets: [],
  txnTypes: {
    deposit: 'circle-plus',
    withdrawal: 'circle-minus',
    transfer: 'arrow-right-circle',
    charge: 'receipt',
    exchange: 'exchange',
    swap: 'exchange',
    payment: 'arrow-right-circle',
  },
  detailsData: {},
  headings: [
    { name: 'Transaction id', value: 'internal_reference', sortable: false },
    { name: 'account', value: 'other_account', sortable: false, width: 'w-2/12' },
    { name: 'transaction type', value: 'transaction_type', sortable: true },
    { name: 'status', value: 'status', sortable: false },
    { name: 'amount', value: 'amount', sortable: false },
    { name: 'description', value: 'description', sortable: true },
    { name: 'date & time', value: 'created_at', sortable: true },
  ],
})

const fromWalletName = (txnData) => {
  if (txnData.other_account) {
    return txnData.other_account
  }
  return txnData.currency || 'N/A'
}

onMounted(() => {
  fetchTransactions()
})

const formatTransactionType = (transactionType) => {
  if (!transactionType) return ''

  return transactionType
    .replace(/_transaction$/, '')
    .replace('and_', '& ')
    .replace('_', ' ')
}

const itemClicked = async (data) => {
  state.detailsData = data
  appDrawer.open('transaction-details-drawer')
  return 'Drawer opened successfully'
}
const tableData = computed(() =>
  (transactions.value || []).map((txn) => ({
    ...txn,
    amount: txn.amount ? Number(txn.amount).toFixed(2) : '0.00',
    txnType: txn.transaction_type,
    isIncoming: txn.type === 'incoming',
  })),
)

const onPageClicked = (page) => {
  const offset = (page - 1) * 4
  fetchTransactions({ offset, limit: 4 })
}

const computedDefaultWallets = computed(() => {
  return wallets.value.filter((w) => w.wallet_type === 'BankWallet')
})

onBeforeMount(async () => {
  state.loading = true
  try {
    if (!wallets.value.length) {
      await fetchWallets()
    }
  } catch (e) {
  } finally {
    state.loading = false
  }
})

watch(error, (newError) => {
  if (newError) {
    toast.show({
      message: newError.message || 'An error occurred while fetching transactions',
      color: 'red',
      duration: 5000,
    })
  }
})

watch(walletError, (newError) => {
  if (newError) {
    toast.show({
      message: newError.message || 'An error occurred while fetching wallets',
      color: 'red',
      duration: 5000,
    })
  }
})
</script>

<style scoped>
:root {
  --space: 1rem;
  --space-md: calc(var(--space) * 2);
  --content-max-width: 60ch;
}

.content {
  display: grid;
  grid-template-columns: 1fr min(var(--content-max-width), 100% - var(--space-md) * 2) 1fr;
}
</style>
