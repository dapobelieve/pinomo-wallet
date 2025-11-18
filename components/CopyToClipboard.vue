<template>
  <div :class="['relative flex items-center', containerClass]" :style="containerStyle">
    <input
      :value="showValue ? value : maskedValue"
      :class="['pr-2 shadow-none outline-none focus:outline-none focus:ring-0 text-emphasis-higher select-all', { 'border-none bg-transparent': !withBorder }, inputClass]"
      :style="[{ background: 'transparent', outline: 'none' }, inputStyle]"
      :disabled="true"
      readonly
      spellcheck="false"
      autocomplete="off"
      @click="selectInput"
      ref="inputRef"
      v-if="!hideInput"
    />
    <div class="flex gap-1 ml-1">
      <Icon v-if="!hideToggleIcon" :name="showValue ? 'eye-off' : 'eye'" :size="20" class="text-emphasis-high hover:text-primary cursor-pointer" @click="toggleShowValue" />
      <Icon v-if="!hideCopyIcon" :name="copied ? 'check' : 'copy'" :size="17" class="text-emphasis-high hover:text-primary cursor-pointer" :disabled="disabled" :stroke-width="2" @click="copy" />
      <span v-if="label" class="-mt-1">{{ label }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Icon from './common/Icon.vue'

const emit = defineEmits(['copied'])

const props = defineProps({
  value: { type: String, required: true },
  label: { type: String, required: false, default: 'Copy' },
  disabled: { type: Boolean, default: false },
  hideCopyIcon: { type: Boolean, default: false },
  hideToggleIcon: { type: Boolean, default: false },
  hideInput: { type: Boolean, default: false },
  withBorder: { type: Boolean, default: false },
  containerClass: { type: String, default: 'w-full' },
  containerStyle: { type: Object, default: () => ({}) },
  inputClass: { type: String, default: '' },
  inputStyle: { type: Object, default: () => ({}) },
})

const copied = ref(false)
const showValue = ref(false)
const inputRef = ref(null)

const maskedValue = computed(() => (props.value ? '•'.repeat(props.value.length) : ''))

const toggleShowValue = () => {
  showValue.value = !showValue.value
}

const copy = async () => {
  if (props.disabled) return
  try {
    await navigator.clipboard.writeText(props.value)
    copied.value = true
    emit('copied')
    setTimeout(() => (copied.value = false), 1200)
  } catch (e) {
    // Optionally handle error
  }
}

const selectInput = (e) => {
  if (inputRef.value) {
    inputRef.value.select()
  }
}
</script>
