<template>
  <div :style="[computedWidth]" class="flex flex-col items-start">
    <label class="mb-1 text-sm capitalize">{{ label }}</label>
    <v-select
      v-model="internalValue"
      :append-to-body="props.appendToBody"
      :calculate-position="calculatePosition"
      :clearable="false"
      :drop-down-should-open="dropdownShouldOpen()"
      :multiple="multiple"
      :placeholder="props.placeholder"
      :options="options"
      class="v-select cursor-pointer"
      @update:modelValue="onCountryChange"
    >
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData"></slot>
      </template>

      <template v-if="!$slots['selected-option']" #selected-option="selectedOption">
        <div class="flex align-baseline font-bold">{{ selectedOption.label }}</div>
      </template>

      <template v-if="!$slots['open-indicator']" #open-indicator="{ attributes }">
        <span>
          <Icon class="h-4 w-4" name="caret-down" v-bind="attributes" />
        </span>
      </template>
    </v-select>
  </div>
</template>

<script setup>
import 'vue-select/dist/vue-select.css'
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'

const slots = useSlots()
const props = defineProps({
  multiple: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  width: {
    type: Number,
    default: 180,
  },
  appendToBody: {
    type: Boolean,
    default: false,
  },
  placeHolder: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: () => [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
  },
  modelValue: {
    type: [Object, Array, String, Number],
    default: null,
  },
})
let inputFocused = ref(false)
const emits = defineEmits(['update:modelValue', 'focus', 'search'])
const internalValue = ref(null)

const computedWidth = computed(() => {
  return {
    minWidth: `${props.width}px !important`,
  }
})

onMounted(() => {
  if (props.modelValue !== null && (typeof props.modelValue === 'string' || typeof props.modelValue === 'number')) {
    const matchingOption = props.options.find((option) => option.value === props.modelValue || option.label === props.modelValue)
    internalValue.value = matchingOption || null
  } else {
    internalValue.value = props.modelValue
  }
})

function dropdownShouldOpen() {
  return false
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== null) {
      if (typeof newVal === 'string' || typeof newVal === 'number') {
        const matchingOption = props.options.find((option) => option.value === newVal || option.label === newVal)
        internalValue.value = matchingOption || null
      } else {
        internalValue.value = newVal
      }
    } else {
      internalValue.value = null
    }
  },
  { deep: true },
)

watch(
  () => internalValue.value,
  (newVal) => {
    emits('update:modelValue', newVal)
  },
  { deep: true },
)

const referenceRef = ref(null)
const floatingRef = ref(null)
let cleanupAutoUpdate = ref(null)

const calculatePosition = (dropdownEl, component, { width }) => {
  referenceRef.value = component.$el
  floatingRef.value = dropdownEl

  if (cleanupAutoUpdate.value) cleanupAutoUpdate.value()

  cleanupAutoUpdate.value = autoUpdate(referenceRef.value, floatingRef.value, async () => {
    const { x, y } = await computePosition(referenceRef.value, floatingRef.value, {
      placement: 'bottom-start',
      middleware: [offset(2), flip(), shift({ padding: 10 })],
      strategy: 'absolute',
    })

    Object.assign(floatingRef.value.style, {
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}`,
      minWidth: '250px',
    })
  })

  return {
    position: 'absolute',
    width: `${width}`,
    left: '0',
    top: '0',
  }
}

function onCountryChange(value) {
  emits('update:modelValue', value)
}
</script>
<style lang="scss">
.v-select {
  .vs__search {
    border: none;
  }
}
</style>
