<template>
  <div :class="statusClasses" class="inline-flex items-center space-x-1.5 px-1.5 py-0.5 rounded">
    <span :class="dotClasses" class="status drop-shadow-none h-2 w-2"></span>
    <span class="text-xs">{{ statusText }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  status: {
    type: String,
    default: 'failed',
    validator: (value) => ['completed', 'processing', 'failure', 'initiated'].includes(value),
  },
})

const statusClasses = computed(() => {
  switch (props.status) {
    case 'completed':
      return 'outline outline-green-400'
    case 'processing':
      return 'outline outline-blue-400'
    case 'initiated':
      return 'outline outline-orange-400'
    case 'failure':
      return 'outline outline-red-400'
    default:
      return 'outline outline-gray-400'
  }
})

const dotClasses = computed(() => {
  switch (props.status) {
    case 'completed':
      return 'bg-green-400'
    case 'processing':
      return 'bg-blue-400'
    case 'initiated':
      return 'bg-orange-400'
    case 'failure':
      return 'bg-red-400'
    default:
      return 'bg-gray-400'
  }
})

const statusText = computed(() => {
  switch (props.status) {
    case 'completed':
      return 'Completed'
    case 'processing':
      return 'Processing'
    case 'initiated':
      return 'Initiated'
    case 'failure':
      return 'Failed'
    default:
      return 'Unknown'
  }
})
</script>

<style lang="scss" scoped></style>
