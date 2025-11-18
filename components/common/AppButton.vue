<template>
  <button
    :class="[baseClasses, sizeClasses, typeClasses, disabledClasses, loadingClasses]"
    :disabled="props.disabled || props.loading"
    class="bg-red text-center relative"
    @blur="$emit('blur', $event)"
    @click="$emit('click', $event)"
    @focus="$emit('focus', $event)"
    @mouseenter="$emit('mouseenter', $event)"
    @mouseleave="$emit('mouseleave', $event)"
  >
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <Icon class="animate-spin h-5 w-5 text-current" name="loading" />
    </div>

    <div :class="{ 'opacity-0': loading }" class="flex items-center gap-1">
      <span v-if="hasPrefix" class="flex items-center">
        <slot name="prefix" />
      </span>
      <slot>Button</slot>
      <span v-if="hasSuffix" class="flex items-center">
        <slot name="suffix" />
      </span>
    </div>
  </button>
</template>

<script setup>
const slots = useSlots()
const emit = defineEmits(['click', 'mouseenter', 'mouseleave', 'focus', 'blur'])

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  type: {
    type: String,
    default: 'fill',
    validator: (value) => ['fill', 'outline', 'ghost', 'flat'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  prefix: {
    type: String,
    default: '',
  },
  suffix: {
    type: String,
    default: '',
  },
})

const hasPrefix = computed(() => !!slots.prefix)
const hasSuffix = computed(() => !!slots.suffix)

const baseClasses = computed(() => 'flex justify-center items-center cursor-pointer py-2 px-4 text-sm')

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-8 text-xs rounded-lg shrink-0'
    case 'lg':
      return 'h-11 rounded-xl'
    case 'md':
    default:
      return 'h-9 rounded-xl'
  }
})

const typeClasses = computed(() => {
  switch (props.type) {
    case 'fill':
      return 'bg-gradient-to-br from-violet-900 to-emphasis-higher text-white'
    case 'outline':
      return 'border-surface-400 border drop-shadow-md bg-white text-emphasis-high'
    case 'ghost':
      return ''
    case 'flat':
      return 'border-surface-400 border bg-white text-emphasis-high'
    default:
      return ''
  }
})

const disabledClasses = computed(() => {
  if (props.disabled || props.loading) {
    return 'opacity-50 cursor-not-allowed pointer-events-none'
  }
  return ''
})

const loadingClasses = computed(() => (props.loading ? 'cursor-wait' : ''))
</script>

<style lang="scss" scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
