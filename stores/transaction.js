import { defineStore } from 'pinia'

export const useTransactionStore = defineStore('transactions', {
  state: () => ({
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
  }),
  actions: {
    async getTransactions(params = {}) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const { offset = 0, limit = 10, ...rest } = params
        const page = Math.floor(offset / limit) + 1
        const res = await $api.get('/api/v1/wallets/transactions', {
          params: { page, per_page: limit, ...rest },
        })

        this.transactions = (res.data.transactions || []).map(txn => ({
          ...txn,
          from_currency: txn.currency,
          type: txn.direction === 'credit' ? 'incoming' : 'outgoing',
        }))

        const pagination = res.data.pagination || {}
        this.pagination = {
          offset: (pagination.current_page - 1) * pagination.per_page,
          limit: pagination.per_page,
          total: pagination.total,
          has_next: pagination.has_more_pages,
          has_previous: pagination.current_page > 1,
          next_offset: pagination.has_more_pages ? pagination.current_page * pagination.per_page : null,
          previous_offset: pagination.current_page > 1 ? (pagination.current_page - 2) * pagination.per_page : null,
        }
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async getSingleTransaction(id) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const res = await $api.get(`/clients/transactions/sessions/${id}`)
        this.transaction = res.data
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    prependTransaction(transaction) {
      const formattedTransaction = {
        ...transaction,
        from_currency: transaction.currency || transaction.from_currency,
      }
      this.transactions.unshift(formattedTransaction)
      this.pagination.total += 1
    },
  },
})
