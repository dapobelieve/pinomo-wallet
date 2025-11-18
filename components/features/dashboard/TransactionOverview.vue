<template>
  <div class="px-6 pt-8 pb-6 h-full">
    <div class="h-full">
      <h6 class="font-bold text-xl mb-6">Transaction Overview</h6>
      <div>
        <div class="flex mb-4">
          <AppCurrencySelector />
          <AppDatePicker class="ml-auto" />
        </div>
        <TransactionOverviewCard :transactions="transactions" :wallets="wallets" />
      </div>
      <div class="bg-surface-200 hidden rounded-2xl justify-center items-center w-full sflex py-16 px-8 h-full">
        <div class="flex items-center gasp-6">
          <img class="h-[112px]" src="https://res.cloudinary.com/believe/image/upload/v1747664552/maraboo/client/coming-soon.png" />
          <div class="space-y-2">
            <h6 class="font-bold text-lg">Coming Soon</h6>
            <p class="text-emphasis-low text-sm">
              This feature is in development and will be available <br />
              soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
  wallets: {
    type: Array,
    default: () => [],
  },
})
</script>

<style lang="scss" scoped></style>
