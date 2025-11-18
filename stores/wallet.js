import { defineStore } from 'pinia'
import { generateIdempotencyKey } from '~/utils/idempotency'

const UMOA_COUNTRIES = [
  { name: 'Benin', code: 'bj' },
  { name: 'Burkina Faso', code: 'bf' },
  { name: "Côte d'Ivoire", code: 'ci' },
  { name: 'Guinea-Bissau', code: 'gw' },
  { name: 'Mali', code: 'ml' },
  { name: 'Niger', code: 'ne' },
  { name: 'Senegal', code: 'sn' },
  { name: 'Togo', code: 'tg' },
]

const NON_UMOA_COUNTRIES = [
  { name: 'Canada', code: 'ca' },
  { name: 'USA', code: 'us' },
]

const ALL_COUNTRIES = [...UMOA_COUNTRIES, ...NON_UMOA_COUNTRIES]

/**
 * Extracts the appropriate country code(s) from a fee record based on channel and currency mapping.
 *
 * This function implements the business logic for determining which countries are supported
 * by specific payment channels:
 * - CAD currency channels (interac_send, interac_request, etc.) → Canada only
 * - XOF currency channels (mobile_money, bank_transfer_ach, etc.) → All UMOA countries
 *
 * @param {Object} fee - The fee record object from the API
 * @param {string} fee.channel - The payment channel (e.g., 'interac_send', 'mobile_money')
 * @param {string} fee.target_currency - The target currency (e.g., 'cad', 'xof')
 * @returns {string|null} Returns 'ca' for CAD channels, 'umoa_all' for XOF channels, or null if no match
 */
function extractCountryFromFee(fee) {
  if (!fee || !fee.channel || !fee.target_currency) return null

  const channel = fee.channel
  const currency = fee.target_currency.toLowerCase()

  if (currency === 'cad') {
    const cadChannels = ['interac_send', 'interac_request', 'direct_debit', 'eft', 'billpay']
    if (cadChannels.includes(channel)) {
      return 'ca'
    }
  }

  if (currency === 'xof') {
    const xofChannels = ['mobile_money', 'bank_transfer_ach', 'credit_ecobank_account', 'xpresscash', 'bank_transfer', 'direct_debit']
    if (xofChannels.includes(channel)) {
      return 'umoa_all'
    }
  }

  return null
}

export const useWalletStore = defineStore('wallets', {
  state: () => ({
    wallets: [],
    serviceInventory: {},
    allFees: [],
    collectionFees: [],
    paymentFees: [],
    swapFees: [],
  }),
  persist: true,
  getters: {
    /**
     * Gets available countries for a specific currency and transaction type based on fee records.
     *
     * This getter filters fee records by currency and transaction type, then extracts all
     * available countries. For UMOA-wide channels, it expands 'umoa_all' to include all
     * 8 UMOA member countries.
     *
     * @param {Object} state - The store state
     * @returns {Function} A function that takes (currency, transactionType) and returns available countries
     * @example
     * // Get countries for XOF payout
     * const countries = store.getCountriesForCurrency('xof', 'payout')
     * // Returns: [{ country: 'bj', name: 'Benin', code: 'bj' }, ...]
     */
    getCountriesForCurrency:
      (state) =>
      (currency, transactionType = 'payout') => {
        console.log(state.collectionFees)
        const fees = transactionType === 'payin' ? state.collectionFees : state.paymentFees

        console.log(!Array.isArray(fees))

        if (!Array.isArray(fees)) return []

        const availableCountries = new Set()
        console.log(fees)

        fees
          .filter(
            (fee) => fee && fee.is_active && fee.target_currency,
            // fee.target_currency.toLowerCase() === currency.toLowerCase(),
          )
          .forEach((fee) => {
            const countryResult = extractCountryFromFee(fee)
            if (countryResult === 'umoa_all') {
              UMOA_COUNTRIES.forEach((country) => availableCountries.add(country.code))
            } else if (countryResult) {
              availableCountries.add(countryResult)
            }
          })

        return Array.from(availableCountries)
          .map((countryCode) => {
            const countryInfo = ALL_COUNTRIES.find((c) => c.code === countryCode)
            if (countryInfo) {
              return {
                country: countryCode,
                name: countryInfo.name,
                currency: currency.toLowerCase(),
                ...countryInfo,
              }
            }
            return null
          })
          .filter(Boolean)
      },

    /**
     * Gets available payment channels for a specific currency, country, and transaction type.
     *
     * This getter filters fee records to find channels that are available for the specified
     * combination of currency, country, and transaction type. It handles both country-specific
     * channels (like CAD channels for Canada) and UMOA-wide channels (like XOF channels for
     * any UMOA country).
     *
     * @param {Object} state - The store state
     * @returns {Function} A function that takes (currency, countryCode, transactionType) and returns available channels
     * @example
     * // Get channels for CAD in Canada for payout
     * const channels = store.getChannelsForCountry('cad', 'ca', 'payout')
     * // Returns: [{ channel: 'interac_send', country: 'ca', enabled: true, ... }, ...]
     */
    getChannelsForCountry:
      (state) =>
      (currency, countryCode, transactionType = 'payout') => {
        const fees = transactionType === 'payin' ? state.collectionFees : state.paymentFees

        if (!Array.isArray(fees)) return []

        return fees
          .filter((fee) => {
            if (!fee || !fee.is_active || !fee.target_currency) return false
            if (fee.target_currency.toLowerCase() !== currency.toLowerCase()) return false

            const countryResult = extractCountryFromFee(fee)

            if (countryResult === 'umoa_all') {
              return UMOA_COUNTRIES.some((country) => country.code === countryCode)
            }

            return countryResult === countryCode
          })
          .map((fee) => ({
            channel: fee.channel,
            country: countryCode,
            currency: fee.target_currency,
            enabled: fee.is_active,
            flat_fee: (fee.maraboo_flat_fee || 0) + (fee.partner_flat_fee || 0),
            percentage_fee: (fee.maraboo_percentage_fee || 0) + (fee.partner_percentage_fee || 0),
            name: fee.channel,
            fee_record: fee,
          }))
      },
  },
  actions: {
    async createWallet(data) {
      const { $api } = useNuxtApp()
      const res = await $api.post(`/clients/api/business/wallets`, data)
      return res.data
    },
    async getServiceInventory() {
      const { $api } = useNuxtApp()
      const res = await $api.get('/clients/api/service-inventory')
      this.serviceInventory = res.data
      return res.data
    },
    async depositCalculator(data) {
      const { $api } = useNuxtApp()
      const res = await $api.get(`/clients/api/calculator/deposit-calculator`, {
        params: data,
      })
      return res
    },
    async effectiveRate(data) {
      const { $api } = useNuxtApp()
      const res = await $api.get(`/clients/api/calculator/effective-rate`, {
        params: data,
      })
      return res
    },
    async swapCalculator(data) {
      const { $api } = useNuxtApp()
      const res = await $api.get(`/clients/api/calculator/swap-calculator`, {
        params: data,
      })
      return res
    },
    async swapAndSendCalculator(data) {
      const { $api } = useNuxtApp()
      const res = await $api.get(`/clients/api/calculator/swap-and-send-calculator`, {
        params: data,
      })
      return res
    },
    async withdrawalAndPaymentCalculator(data) {
      const { $api } = useNuxtApp()
      const res = await $api.get(`/clients/api/calculator/payment-calculator`, {
        params: data,
      })
      return res
    },
    async createWithdrawalAccount(data) {
      const { $api } = useNuxtApp()
      const res = await $api.post(`/clients/api/recipients`, {
        language: 'en',
        ...data,
      })
      return res.data
    },
    async createRecipient(data) {
      const { $api } = useNuxtApp()
      const res = await $api.post(`/clients/api/recipients`, {
        language: 'en',
        ...data,
      })
      return res.data
    },
    async getAllWithdrawalAccounts(type = 'transactions') {
      const { $api } = useNuxtApp()
      return ''
    },
    async initiatePayment(data) {
      const { $api } = useNuxtApp()
      const idempotencyKey = generateIdempotencyKey()
      return await $api.post(`/clients/transactions/sessions/payment`, data, {
        headers: {
          'X-Idempotency-Key': idempotencyKey,
        },
      })
    },
    /**
     * Retrieves mobile money providers for a specific country.
     *
     * @param {string} [countryCode=''] - The country code to filter providers
     * @returns {Promise<Array>} List of mobile money provider objects
     */
    async getMobileMoneyProviders(countryCode = '') {
      const { $api } = useNuxtApp()
      const res = await $api.get(`/clients/api/mobile_money-money/providers?country_code=${countryCode}`)
      return res.data
    },

    async getBankCodes(countryCode) {
      const { $api } = useNuxtApp()
      const res = await $api.get(`/clients/api/banks/bank-codes?country_code=${countryCode}`)
      return res.data
    },

    async verifyEcobankAccount(data) {
      const { $api } = useNuxtApp()
      const res = await $api.post(`/clients/collections/ecobank/account-inquiry`, data)
      return res.data
    },
    async deposit(data) {
      const { $api } = useNuxtApp()
      const idempotencyKey = generateIdempotencyKey()
      const res = await $api.post(`/clients/transactions/sessions/deposit`, data, {
        headers: {
          'X-Idempotency-Key': idempotencyKey,
        },
      })
      return res.data
    },
    async walletDeposit(data) {
      const { $api } = useNuxtApp()
      const idempotencyKey = generateIdempotencyKey()
      const res = await $api.post(`/api/v1/wallets/deposit`, {
        ...data,
        transaction_reference: idempotencyKey,
      }, {
        headers: {
          'X-Idempotency-Key': idempotencyKey,
        },
      })
      return res.data
    },
    async withdrawal(data) {
      const { $api } = useNuxtApp()
      const idempotencyKey = generateIdempotencyKey()
      const res = await $api.post(`/clients/transactions/sessions/withdrawal`, data, {
        headers: {
          'X-Idempotency-Key': idempotencyKey,
        },
      })
      return res.data
    },
    async getAllWallets() {
      const { $api } = useNuxtApp()
      const res = await $api.get(`/api/v1/wallets`)
      if (res.data) {
        this.wallets = res.data.map(account => ({
          id: account.id,
          wallet_name: account.account_name,
          wallet_reference: account.account_number,
          currency: account.currency,
          balance: account.available_balance,
          wallet_type: 'BankWallet',
          status: account.status,
          actual_balance: account.actual_balance,
          locked_amount: account.locked_amount,
        }))
      }
      return { items: this.wallets }
    },
    async getSingleWallet(walletId) {
      const { $api } = useNuxtApp()
      const res = await $api.get(`/clients/api/business/wallets/${walletId}`)
      return res.data
    },
    async swap(data) {
      const { $api } = useNuxtApp()
      const idempotencyKey = generateIdempotencyKey()
      const res = await $api.post(`/clients/transactions/sessions/swap`, data, {
        headers: {
          'X-Idempotency-Key': idempotencyKey,
        },
      })
      return res.data
    },
    /**
     * Retrieves bank configuration settings.
     *
     * @returns {Promise<Object>} The bank configuration data
     */
    async bankConfigurations() {
      const { $api } = useNuxtApp()
      const res = await $api.get(`/clients/api/banks/mb-bank-configurations`)
      return res.data
    },
    /**
     * Fetches all fee records from the API and categorizes them by revenue line.
     *
     * This method retrieves fee records and automatically sorts them into different
     * categories based on their revenue_line property:
     * - collection: Fees for deposit/payin operations
     * - payment: Fees for withdrawal/payout operations
     * - standard_swap/priority_swap: Fees for currency exchange operations
     *
     * @returns {Promise<Array>} Array of all fee records
     * @throws {Error} When API call fails
     * @example
     * await store.getAllFees()
     * // Now store.collectionFees, store.paymentFees, store.swapFees are populated
     */
    async getAllFees() {
      const { $api } = useNuxtApp()
      try {
        const res = await $api.get(`/clients/api/fees`)
        this.allFees = Array.isArray(res.data) ? res.data : []
        this.collectionFees = this.allFees.filter((fee) => fee && fee.revenue_line === 'collection')
        this.paymentFees = this.allFees.filter((fee) => fee && fee.revenue_line === 'payment')
        this.swapFees = this.allFees.filter((fee) => fee && ['standard_swap', 'priority_swap'].includes(fee.revenue_line))

        return this.allFees
      } catch (error) {
        console.error('Error fetching fees:', error)
        this.allFees = []
        this.collectionFees = []
        this.paymentFees = []
        this.swapFees = []
        throw error
      }
    },

    async enableDeveloperMode(data) {
      const { $api } = useNuxtApp()
      try {
        const res = await $api.post('/clients/api/business/service-requests', {
          request_type: 'DEVELOPER_ACCESS',
        })
        return res.data
      } catch (error) {
        console.error('Error enabling developer mode:', error)
        throw error
      }
    },
    updateWalletBalance(walletId, balanceData) {
      const walletIndex = this.wallets.findIndex((w) => w.id === walletId)
      if (walletIndex !== -1) {
        this.wallets[walletIndex] = {
          ...this.wallets[walletIndex],
          balance: balanceData.available_balance || this.wallets[walletIndex].balance,
          actual_balance: balanceData.actual_balance || this.wallets[walletIndex].actual_balance,
          locked_amount: balanceData.locked_amount || this.wallets[walletIndex].locked_amount,
        }
      }
    },
    async transfer(data) {
      const { $api } = useNuxtApp()
      const idempotencyKey = generateIdempotencyKey()
      const res = await $api.post(`/api/v1/wallets/transfer`, {
        ...data,
        transaction_reference: idempotencyKey,
      }, {
        headers: {
          'X-Idempotency-Key': idempotencyKey,
        },
      })
      return res.data
    },
  },
})
