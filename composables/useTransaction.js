import { reactive, toRefs } from 'vue'
import { useTransactionStore } from '~/stores/transaction'

const state = reactive({
  transactions: [],
  transaction: null,
  pagination: {
    offset: 0,
    limit: 10,
    total: 0,
    has_next: false,
    has_previous: false,
    next_offset: 0,
    previous_offset: 0,
  },
  loading: false,
  error: null,
})

export const useTransaction = () => {
  const transactionStore = useTransactionStore()

  const fetchTransactions = async (params = {}) => {
    await transactionStore.getTransactions(params)
    state.transactions = transactionStore.transactions
    state.pagination = transactionStore.pagination
    state.loading = transactionStore.loading
    state.error = transactionStore.error
  }

  const fetchSingleTransaction = async (id) => {
    await transactionStore.getSingleTransaction(id)
    state.transaction = transactionStore.transaction
    state.loading = transactionStore.loading
    state.error = transactionStore.error
  }

  return {
    ...toRefs(state),
    fetchTransactions,
    fetchSingleTransaction,
  }
}
