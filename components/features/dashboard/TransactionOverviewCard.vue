<template>
  <div class="outline outline-surface-400 rounded-3xl overflow-hidden">
    <div class="w-full flex border-b border-surface-400">
      <div v-for="record in state.records" class="border-r border-surface-400 relative w-full cursor-pointer h-[150px] py-7 px-6 inset-x-[1px] top-[1px] bottom-[1px] overflow-hidden">
        <img :class="record.patternPosition" :src="patterns[record.pattern]" class="absolute" />
        <div class="content flex flex-col h-full relative z-20 transition-all">
          <div class="h-full flex flex-col space-y-6">
            <span class="flex-1 text-emphasis-medium">{{ record.name }}</span>
            <h6 class="text-3xl text-emphasis-high leading-stight">
              {{ record.amount }} <sub class="text-xs">{{ record.currency }}</sub>
            </h6>
          </div>
        </div>
      </div>
    </div>
    <div class="p-6">
      <div class="flex items-center mb-10">
        <h6>Wallet Type Breakdown</h6>
        <div class="ml-auto space-x-16">
          <div class="inline-flex space-x-2.5">
            <div aria-label="status" class="status mt-1.5 status-accent"></div>
            <div>
              <h6 class="text-sm text-emphasis-medium">Bank Wallet</h6>
              <p class="text-emphasis-high font-bold">{{ $formatNumber(bankWalletBalance) }} <sub style="font-size: 10px">{{ primaryCurrency }}</sub></p>
            </div>
          </div>
          <div class="inline-flex space-x-2.5">
            <div aria-label="status" class="status mt-1.5 status-info"></div>
            <div>
              <h6 class="text-sm text-emphasis-medium">Mobile Money</h6>
              <p class="text-emphasis-high font-bold">{{ $formatNumber(mobileMoneyBalance) }} <sub style="font-size: 10px">{{ primaryCurrency }}</sub></p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <BarChart />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useImages } from '~/composables/useImage.js'

const { patterns } = useImages()
const { $formatNumber } = useNuxtApp()

const props = defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
  wallets: {
    type: Array,
    default: () => [],
  },
})

const totalRevenue = computed(() => {
  if (!props.transactions.length) return 0
  return props.transactions.reduce((sum, txn) => {
    const amount = parseFloat(txn.amount) || 0
    return sum + amount
  }, 0)
})

const totalTransactions = computed(() => {
  return props.transactions.length
})

const currentBalance = computed(() => {
  if (!props.wallets.length) return 0
  return props.wallets.reduce((sum, wallet) => {
    const balance = parseFloat(wallet.balance) || 0
    return sum + balance
  }, 0)
})

const bankWalletBalance = computed(() => {
  if (!props.wallets.length) return 0
  return props.wallets
    .filter((w) => w.wallet_type === 'BankWallet')
    .reduce((sum, wallet) => {
      const balance = parseFloat(wallet.balance) || 0
      return sum + balance
    }, 0)
})

const mobileMoneyBalance = computed(() => {
  if (!props.wallets.length) return 0
  return props.wallets
    .filter((w) => w.wallet_type === 'MobileMoney')
    .reduce((sum, wallet) => {
      const balance = parseFloat(wallet.balance) || 0
      return sum + balance
    }, 0)
})

const primaryCurrency = computed(() => {
  if (!props.wallets.length) return 'CAD'
  return props.wallets[0]?.currency || 'CAD'
})

const state = reactive({
  isHovered: false,
  records: computed(() => [
    {
      name: 'Revenue',
      amount: $formatNumber(totalRevenue.value),
      currency: primaryCurrency.value,
      pattern: 'circle',
      patternPosition: '-right-[100px] -bottom-[101px]',
    },
    {
      name: 'Total Transactions',
      amount: $formatNumber(totalTransactions.value),
      currency: '',
      pattern: 'shape-5',
      patternPosition: '-right-[70px] -bottom-[101px]',
    },
    {
      name: 'Current Balance',
      amount: $formatNumber(currentBalance.value),
      pattern: 'shape-2',
      currency: primaryCurrency.value,
      patternPosition: ' -right-[50px] -bottom-[40px]',
    },
  ]),
})
</script>

<style lang="scss" scoped></style>
