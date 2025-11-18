<template>
  <div class="inline-flex space-x-1 bg-surface-200 rounded-lg px-1 py-1">
    <button
      v-for="currency in currencies"
      :key="currency.code"
      @click="selectCurrency(currency.code)"
      class="flex items-center py-1 cursor-pointer rounded-lg gap-2 px-4 h-8 text-sm transition-all duration-200"
      :class="[selectedCurrency === currency.code ? 'bg-surface-100 shadow-sm' : '']"
    >
      <span class="w-4 h-4 flex-shrink-0">
        <img :src="currency.flagSrc" :alt="`${currency.name} flag`" class="w-full h-full object-cover rounded-full" />
      </span>
      <span class="text-xs">{{ currency.code }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'CurrencySelector',
  data() {
    return {
      selectedCurrency: 'CAD',
      currencies: [
        {
          code: 'CAD',
          name: 'Canadian Dollar',
          flagSrc: 'https://flagcdn.com/w80/ca.png',
        },
        {
          code: 'XOF',
          name: 'West African CFA Franc',
          flagSrc: 'https://flagcdn.com/w80/sn.png', // Using Senegal as example for XOF
        },
        {
          code: 'GBP',
          name: 'British Pound',
          flagSrc: 'https://flagcdn.com/w80/gb.png',
        },
        {
          code: 'NGN',
          name: 'Nigerian Naira',
          flagSrc: 'https://flagcdn.com/w80/ng.png',
        },
      ],
    }
  },
  methods: {
    selectCurrency(code) {
      this.selectedCurrency = code
      this.$emit('currency-selected', code)
    },
  },
}
</script>
