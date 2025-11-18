<template>
  <div class="inline-flex space-x-1 bg-surface-200 rounded-lg px-1 py-1">
    <button
      v-for="item in props.items"
      :class="[state.selectedItem.name === item.name ? 'bg-surface-100 shadow-sm' : '']"
      class="flex items-center py-1 cursor-pointer rounded-lg gap-2 px-4 h-8 text-sm transition-all duration-200"
      @click="updateState(item)"
    >
      <slot :item="item" name="item">
        <span class="flex">
          <span class="w-4 h-4 flex-shrink-0">
            <img :alt="`${item.name} flag`" :src="item.flagSrc" class="w-full h-full object-cover rounded-full" />
          </span>
          <span class="text-xs">{{ item.code }}</span>
        </span>
      </slot>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
  },
})
const state = reactive({
  selectedItem: '',
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
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (value) => {
  emit('update:modelValue', value)
}

const updateState = (value) => {
  state.selectedItem = value
  updateValue(value)
}
</script>
