<template>
  <div class="toggle-container inline-flex items-center">
    <label :for="toggleId" class="flex cursor-pointer items-center">
      <div class="relative">
        <input :id="toggleId" :checked="props.modelValue" :disabled="props.disabled" class="sr-only" type="checkbox" @change="handleChange" />
        <div :class="[computedToggleOnBg, sizeConfig.trackWidth, sizeConfig.trackHeight]" class="toggle-track rounded-full transition-colors"></div>
        <div
          :class="[sizeConfig.dotSize, sizeConfig.dotRadius, props.modelValue ? sizeConfig.dotPositionChecked : sizeConfig.dotPositionUnchecked]"
          class="toggle-dot absolute bg-white shadow transition-all duration-300"
        ></div>
      </div>
    </label>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890abcdef', 10)
const toggleId = nanoid()

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Boolean,
    default: false,
    required: false,
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
})

const emit = defineEmits(['update:modelValue'])

const handleChange = (event) => {
  emit('update:modelValue', event.target.checked)
}

const sizeConfig = computed(() => {
  const configs = {
    sm: {
      trackWidth: 'w-8',
      trackHeight: 'h-5',
      dotSize: 'w-3.5 h-3.5',
      dotPositionUnchecked: 'left-1',
      dotPositionChecked: 'left-[calc(100%-18px)]',
      dotRadius: 'rounded-full',
    },
    md: {
      trackWidth: 'w-12',
      trackHeight: 'h-[1.69rem]',
      dotSize: 'w-5 h-[1.21rem]',
      dotPositionUnchecked: 'left-1',
      dotPositionChecked: 'left-[calc(100%-24px)]',
      dotRadius: 'rounded-full',
    },
    lg: {
      trackWidth: 'w-16',
      trackHeight: 'h-8',
      dotSize: 'w-6 h-6',
      dotPositionUnchecked: 'left-1',
      dotPositionChecked: 'left-[calc(100%-28px)]',
      dotRadius: 'rounded-full',
    },
  }

  return configs[props.size]
})

const computedToggleOnBg = computed(() => {
  return props.modelValue ? 'bg-gradient-to-br from-violet-900 to-emphasis-higher' : ''
})

watch(
  () => props.modelValue,
  (newValue) => {
    emit('update:modelValue', newValue)
  },
)
</script>

<style lang="scss" scoped>
.toggle-container {
  .toggle-dot {
    top: 50%;
    transform: translateY(-50%);
  }

  input:checked {
    + .toggle-track {
      background-color: #5f19f2;
    }
  }

  input:not(:checked) {
    + .toggle-track {
      background-color: var(--color-surface);
      opacity: 0.4;
    }
  }
}
</style>
