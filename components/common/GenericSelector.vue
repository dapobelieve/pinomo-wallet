<template>
  <div class="flex items-center">
    <div class="flex items-center w-full px-4 py-2 border border-surface-400 rounded-xl cursor-pointer" ref="triggerRef" @click="toggleDropdown">
      <slot name="trigger" :selected="internalValue" :placeholder="placeholder">
        <div v-if="!internalValue || (multiple && (!Array.isArray(internalValue) || internalValue.length === 0))" class="flex w-full items-center">
          <h6 class="text-xs font-bold max-w-xs text-emphasis-higher mr-2 capitalize leading-tight">{{ placeholder }}</h6>
          <Icon name="caret-down" class="" :stroke-width="2" :size="15" />
        </div>
        <div v-else class="flex items-center w-full max-w-32">
          <div class="inline-flex">
            <h6 class="text-xs font-bold text-emphasis-higher capitalize leading-tight max-w-[20ch] truncate">{{ getMultiSelectDisplayValue() }}</h6>
          </div>
        </div>
      </slot>
    </div>
    <Teleport to="body">
      <div v-if="state.dropdownOpen" ref="floatingElement" :style="state.dropdownStyle" class="absolute z-9 drop-shadow-lg h-[280px] rounded-2xl overflow-y-scroll no-scrollbar">
        <ul :class="['dropdown-content bg-surface-100 shadow-sm', dropdownClass]" class="rounded-2xl" tabindex="0">
          <li v-for="option in filteredOptions" :key="getOptionValue(option)" class="hover:bg-none mb-1">
            <slot name="option" :option="option" :isSelected="isSelected(option)" :selectOption="() => selectOption(option)">
              <a class="hover:bg-primary-200 cursor-pointer flex items-start gap-x-3.5 rounded-2xl p-3" @click.stop.prevent="selectOption(option)">
                <div class="flex w-full justify-between items-center space-x-1">
                  <h6 class="text-sm text-emphasis-higher capitalize leading-tight max-w-[20ch] truncate">{{ getDisplayValue(option) }}</h6>
                  <Icon :class="[isSelected(option) ? 'text-primary-deep' : 'text-surface-400']" :size="18" class="" name="circle-check-filled"></Icon>
                </div>
              </a>
            </slot>
          </li>
          <li class="border border-x-0 border-b-0 border-t-surface-400">
            <div class="px-1 py-2 flex gap-2">
              <AppButton type="flat" @click="resetSelection">Reset</AppButton>
              <AppButton v-if="multiple" type="primary" @click="close">Done</AppButton>
            </div>
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'

const triggerRef = ref(null)
const floatingElement = ref(null)
const cleanupAutoUpdate = ref(null)

const props = defineProps({
  closeAfterClick: {
    type: Boolean,
    default: true,
  },
  modelValue: {
    type: [Object, Array, String, Number],
    default: null,
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Select Option',
  },
  displayKey: {
    type: String,
    default: 'label',
  },
  valueKey: {
    type: String,
    default: 'value',
  },
  dropdownClass: {
    type: String,
    default: 'w-96',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'action'])

let internalValue = ref(null)

const state = reactive({
  dropdownOpen: false,
  dropdownStyle: {},
})

const getDisplayValue = (item) => {
  if (!item) return ''
  if (typeof item === 'string' || typeof item === 'number') return item
  return item[props.displayKey] || item.label || item.name || item.toString()
}

const getMultiSelectDisplayValue = () => {
  if (props.multiple && Array.isArray(internalValue.value)) {
    if (internalValue.value.length === 0) return ''
    if (internalValue.value.length === 1) {
      return getDisplayValue(internalValue.value[0])
    }
    return `${internalValue.value.length} selected`
  }
  return getDisplayValue(internalValue.value)
}

const getOptionValue = (item) => {
  if (!item) return null
  if (typeof item === 'string' || typeof item === 'number') return item

  // Check for the specified key first
  if (props.valueKey && item.hasOwnProperty(props.valueKey)) {
    return item[props.valueKey]
  }

  // Fallback to common properties
  if (item.hasOwnProperty('value')) {
    return item.value
  }

  if (item.hasOwnProperty('id')) {
    return item.id
  }

  return item
}

const filteredOptions = computed(() => {
  return props.options.filter((option) => {
    const value = getOptionValue(option)
    return value !== null && value !== undefined && value !== ''
  })
})

const isSelected = (option) => {
  if (!internalValue.value || !option) return false
  
  if (props.multiple) {
    const currentValue = Array.isArray(internalValue.value) ? internalValue.value : []
    const optionValue = getOptionValue(option)
    return currentValue.some(item => getOptionValue(item) === optionValue)
  } else {
    const currentValue = getOptionValue(internalValue.value)
    const optionValue = getOptionValue(option)
    return currentValue === optionValue
  }
}

useClickOutside(floatingElement, (event) => {
  if (state.dropdownOpen) {
    // For multi-select, only close if clicking the Done button or outside
    if (props.multiple) {
      // Check if the click is on a dropdown option or control
      const clickedElement = event.target
      const isClickingOption = clickedElement.closest('.dropdown-content')
      if (!isClickingOption) {
        close()
      }
    } else {
      close()
    }
  }
})

const close = () => {
  state.dropdownOpen = false
}

const resetSelection = () => {
  if (props.multiple) {
    internalValue.value = []
    emit('update:modelValue', [])
  } else {
    internalValue.value = null
    emit('update:modelValue', null)
  }
}

watch(
  [() => state.dropdownOpen, triggerRef, floatingElement],
  () => {
    if (state.dropdownOpen && triggerRef.value && floatingElement.value) {
      if (cleanupAutoUpdate.value) {
        cleanupAutoUpdate.value()
      }

      cleanupAutoUpdate.value = autoUpdate(triggerRef.value, floatingElement.value, async () => {
        const { x, y } = await computePosition(triggerRef.value, floatingElement.value, {
          placement: 'bottom-start',
          middleware: [
            offset({
              mainAxis: 4,
              alignmentAxis: 0,
            }),
            flip(),
            shift(),
          ],
        })

        state.dropdownStyle = {
          left: `${x}px`,
          top: `${y}px`,
        }
      })
    } else if (cleanupAutoUpdate.value) {
      cleanupAutoUpdate.value()
      cleanupAutoUpdate.value = null
    }
  },
  { immediate: true },
)

const toggleDropdown = () => {
  state.dropdownOpen = !state.dropdownOpen
}

const selectOption = (option) => {
  if (!option) return
  
  if (props.multiple) {
    const currentValue = Array.isArray(internalValue.value) ? internalValue.value : []
    const optionValue = getOptionValue(option)
    const existingIndex = currentValue.findIndex(item => getOptionValue(item) === optionValue)
    
    if (existingIndex > -1) {
      // Remove if already selected
      const newValue = currentValue.filter((_, index) => index !== existingIndex)
      internalValue.value = newValue
      emit('update:modelValue', newValue)
    } else {
      // Add if not selected
      const newValue = [...currentValue, option]
      internalValue.value = newValue
      emit('update:modelValue', newValue)
    }
    
    // Don't close dropdown for multiple selection - keep it open
  } else {
    internalValue.value = option
    emit('update:modelValue', option)
    if (props.closeAfterClick) {
      setTimeout(() => {
        state.dropdownOpen = false
      }, 800)
    }
  }
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (props.multiple) {
      internalValue.value = Array.isArray(newVal) ? newVal : (newVal ? [newVal] : [])
    } else {
      internalValue.value = newVal !== null ? newVal : null
    }
  },
  { deep: true, immediate: true },
)

onBeforeUnmount(() => {
  if (cleanupAutoUpdate.value) {
    cleanupAutoUpdate.value()
  }
})
</script>
