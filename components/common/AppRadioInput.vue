<template>
  <label class="flex items-start space-x-4 px-4 py-4 w-full cursor-pointer border">
    <input v-model="localModel" :disabled="disabled" :name="name" :value="value" class="radio border h-4 w-4 border-emphasis-higher" type="radio" @change="handleChange" />
    <div class="flex flex-col space-y-1">
      <h6 class="text-emphasis-higher leading-tight text-sm font-semibold">{{ label }}</h6>
      <span class="text-xs text-emphasis-medium">{{ text }}</span>
    </div>
  </label>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    default: undefined,
  },
  text: {
    type: String,
    default: 'Something light 🥂',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  customLabelClass: {
    type: [String, Array],
    default: '',
  },
  customTextClass: {
    type: [String, Array],
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const localModel = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit('update:modelValue', newValue)
  },
})

const isSelected = computed(() => props.modelValue === props.value)

const handleChange = (event) => {
  emit('change', event.target.value)
}
</script>

<style scoped></style>
