<template>
  <div class="w-full">
    <label :for="inputId" class="select-none text-sm">
      <slot name="label"></slot>
    </label>
    <div class="input-parent relative mt-1 flex rounded-xl bg-white">
      <textarea
        :id="inputId"
        :disabled="disabled"
        :maxlength="counter > 0 ? counter : undefined"
        :placeholder="placeholder"
        :required="required"
        :value="modelValue"
        class="input w-full rounded-xl border-0 resize-none placeholder:text-emphasis-low bg-white text-emphasis-higher outline-1 px-3 py-2 h-28 outline-surface-400 focus:outline-1 focus:outline-offset-0 focus:outline-primary-deep whitespace-pre-wrap break-words"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>
    </div>
    <div class="flex w-full mt-1">
      <small v-show="errMsg" class="text-red-500">{{ errMsg }}</small>
      <small v-show="counter" class="ml-auto font-medium text-xs text-emphasis-higher">{{ countedInput }} / {{ counter }}</small>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { customAlphabet } from 'nanoid'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  counter: {
    type: Number,
    default: 0,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  errMsg: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
})

defineEmits(['update:modelValue'])

const nanoid = customAlphabet('1234567890abcdef', 10)
const inputId = nanoid()
const countedInput = computed(() => props.modelValue?.length ?? 0)
</script>
