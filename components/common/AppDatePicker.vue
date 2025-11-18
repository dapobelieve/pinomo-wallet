<template>
  <div ref="referenceEl" class="relative">
    <AppButton prefix="calendar-check" size="sm" suffix="caret-down" type="outline" @click.stop="toggle" :class="buttonClass">
      {{ displayText }}
    </AppButton>

    <Teleport to="body">
      <div v-show="state.open" ref="floatingEl" :style="floatingStyles" class="absolute bg-surface-900 rounded-3xl flex max-w-80 z-50">
        <div class="w-full outline-1 outline-surface-300 rounded-3xl flex flex-col">
          <div class="w-full p-3 rounded-t-3xl bg-surface-200">
            <div class="flex px-1 py-3 space-x-2 shrink-0 no-scrollbar overflow-x-auto">
              <AppButton v-for="preset in presets" :key="preset.key" size="sm" type="outline" :class="{ '!bg-primary-500 !text-white': activePreset === preset.key }" @click="applyPreset(preset)">
                {{ preset.label }}
              </AppButton>
            </div>
            <div class="flex space-x-6 w-full">
              <input class="w-full px-3 py-1 outline-surface-400 rounded-lg focus-within:outline-none outline-1" :value="formatDate(state.range.start)" readonly type="text" placeholder="Start date" />
              <input class="w-full px-3 py-1 outline-surface-400 rounded-lg focus-within:outline-none outline-1" :value="formatDate(state.range.end)" readonly type="text" placeholder="End date" />
            </div>
          </div>
          <div class="app-calendar w-full outline-1 outline-surface-300">
            <DatePicker v-model.range="state.range" :attributes="state.attrs" borderless class="w-full">
              <template #header-prev-button>
                <Icon :size="34" :strokeWidth="2" name="arrow-left" />
              </template>
              <template #header-next-button>
                <Icon :size="34" :strokeWidth="2" name="arrow-right" />
              </template>
            </DatePicker>
          </div>
          <div class="actions flex p-3 bg-surface-200 rounded-b-3xl">
            <AppButton size="sm" type="ghost" @click="close">Cancel</AppButton>
            <AppButton class="ml-auto" size="sm" @click="applyDate">Apply</AppButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { reactive, ref, watch, computed, onMounted } from 'vue'
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'

const emit = defineEmits(['update:modelValue', 'change'])

const props = defineProps({
  buttonClass: {
    type: [String, Array, Object],
    default: '',
  },
  modelValue: {
    type: Object,
    default: () => ({
      start: null,
      end: null,
      preset: 'last30days',
    }),
  },
})

const referenceEl = ref(null)
const floatingEl = ref(null)
const floatingStyles = ref({})
const activePreset = ref(props.modelValue.preset || 'last30days')

const presets = [
  {
    key: 'today',
    label: 'Today',
    getRange: () => {
      const today = new Date()
      return { start: today, end: today }
    },
  },
  {
    key: 'yesterday',
    label: 'Yesterday',
    getRange: () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      return { start: yesterday, end: yesterday }
    },
  },
  {
    key: 'last7days',
    label: 'Last 7 Days',
    getRange: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(end.getDate() - 6)
      return { start, end }
    },
  },
  {
    key: 'last30days',
    label: 'Last 30 Days',
    getRange: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(end.getDate() - 29)
      return { start, end }
    },
  },
  {
    key: 'last90days',
    label: 'Last 90 Days',
    getRange: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(end.getDate() - 89)
      return { start, end }
    },
  },
  {
    key: 'thisyear',
    label: 'This Year',
    getRange: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), 0, 1) // January 1st of current year
      return { start, end: now }
    },
  },
  {
    key: 'lastyear',
    label: 'Last Year',
    getRange: () => {
      const lastYear = new Date().getFullYear() - 1
      const start = new Date(lastYear, 0, 1) // January 1st of last year
      const end = new Date(lastYear, 11, 31) // December 31st of last year
      return { start, end }
    },
  },
]

const state = reactive({
  open: false,
  range: {
    start: props.modelValue.start ? new Date(props.modelValue.start) : null,
    end: props.modelValue.end ? new Date(props.modelValue.end) : null,
  },
  attrs: [
    {
      key: 'today',
      highlight: true,
      dates: new Date(),
    },
  ],
})

// Initialize with default value if none provided
onMounted(() => {
  if (!state.range.start || !state.range.end) {
    const preset = presets.find((p) => p.key === activePreset.value) || presets.find((p) => p.key === 'last30days')
    if (preset) {
      const range = preset.getRange()
      state.range.start = range.start
      state.range.end = range.end
    }
  }
})

// Format date for display
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Compute display text based on current selection
const displayText = computed(() => {
  const preset = presets.find((p) => p.key === activePreset.value)
  if (preset) return preset.label

  if (state.range.start && state.range.end) {
    return `${formatDate(state.range.start)} - ${formatDate(state.range.end)}`
  }

  return 'Select date range'
})

let cleanup = null

useClickOutside(floatingEl, () => {
  if (state.open) {
    close()
  }
})

// Apply a preset date range
const applyPreset = (preset) => {
  const range = preset.getRange()
  state.range.start = range.start
  state.range.end = range.end
  activePreset.value = preset.key
}

const toggle = () => {
  state.open = !state.open
}

const close = () => {
  state.open = false
}

const applyDate = () => {
  // Create a result object with proper date values
  const result = {
    start: state.range.start,
    end: state.range.end,
    preset: activePreset.value,
  }

  emit('update:modelValue', result)
  emit('change', result)
  close()
}

watch(
  () => state.open,
  (open) => {
    if (open) {
      cleanup = autoUpdate(referenceEl.value, floatingEl.value, updatePosition)
    } else if (cleanup) {
      cleanup()
      cleanup = null
    }
  },
)

watch(
  () => state.range,
  () => {
    // When user selects a custom range, clear the active preset
    if (state.range.start && state.range.end) {
      // Check if the selected range matches any preset
      const matchingPreset = presets.find((preset) => {
        const presetRange = preset.getRange()
        return isSameDay(presetRange.start, state.range.start) && isSameDay(presetRange.end, state.range.end)
      })

      activePreset.value = matchingPreset ? matchingPreset.key : null
    }
  },
  { deep: true },
)

// Helper function to compare dates
function isSameDay(date1, date2) {
  if (!date1 || !date2) return false
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

async function updatePosition() {
  if (!referenceEl.value || !floatingEl.value) return

  const middleware = [offset(10), flip(), shift({ padding: 5 })]

  const { x, y } = await computePosition(referenceEl.value, floatingEl.value, {
    placement: 'bottom-start',
    middleware,
  })

  floatingStyles.value = {
    left: `${x}px`,
    top: `${y}px`,
  }
}
</script>

<style lang="scss" scoped>
.app-calendar :deep(.vc-container) {
  width: 100%;
  font-size: 6px !important;

  .vc-pane-container {
    .vc-header {
      font-size: 14px !important;
      font-weight: 500;

      button {
        color: black;

        &:hover {
          background-color: transparent;
        }

        &:focus-within {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
      }
    }

    .vc-weeks {
      padding-top: 3px;

      .is-not-in-month {
        display: none;
      }
    }

    .vc-week {
      .vc-day-content {
        font-size: 12px !important;
      }
    }

    .vc-weekday {
      font-size: 12px !important;
    }
  }
}

.app-calendar :deep(.vc-weekday-1, .vc-weekday-7) {
  color: red;
}
</style>
