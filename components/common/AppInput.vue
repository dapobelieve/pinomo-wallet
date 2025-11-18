<template>
  <div class="w-full">
    <label :for="inputId" class="select-none text-sm">
      <slot name="label"></slot>
    </label>
    <div class="input-parent relative mt-1 flex rounded-xl bg-white">
      <input
        :id="inputId"
        :autofocus="autofocus"
        :disabled="disabled"
        :maxlength="maxlength"
        :placeholder="placeholder"
        :type="computedType"
        :value="props.modelValue"
        class="input w-full rounded-xl border-0 placeholder:text-emphasis-low bg-white text-emphasis-higher outline-1 outline-surface-400 focus:outline-1 focus-within:outline-primary-deep focus-within:outline-1 focus:outline-offset-0 focus:outline-primary-deep"
        @focus="$emit('focus', $event)"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <Icon v-show="shouldShowIcon" :name="getIconComponent" :size="24" class="absolute right-3 top-[0.5rem] cursor-pointer text-emphasis-high" @click="handleIconClick" />
    </div>
    <small v-show="errMsg" class="text-red-500">{{ errMsg }}</small>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890abcdef', 10)

const props = defineProps({
  modelValue: String | Number,
  type: String,
  error: Boolean,
  errMsg: String,
  placeholder: String,
  disabled: Boolean,
  hasIcon: Boolean,
  iconComponent: String,
  autofocus: Boolean,
  maxlength: Number,
})

const $emit = defineEmits(['update:modelValue', 'icon-click', 'focus'])

const showPassword = ref(false)

const computedType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text'
  }
  return props.type
})

const shouldShowIcon = computed(() => {
  if (props.hasIcon) {
    return true
  }
  return props.type === 'password'
})

const getIconComponent = computed(() => {
  if (props.hasIcon) {
    return props.iconComponent
  }
  if (props.type === 'password' && showPassword.value) {
    return 'eye-off'
  }
  return 'eye'
})

const handleIconClick = () => {
  if (props.type === 'password') {
    togglePasswordVisibility()
  }
  $emit('icon-click')
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const inputId = nanoid()
</script>
<style lang="scss">
input:-webkit-autofill,
input:-webkit-autofill:focus {
  box-shadow: 0 0 0 1000px white inset;
  -webkit-text-fill-color: #333;
}

input[type='number'] {
  -moz-appearance: textfield;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
