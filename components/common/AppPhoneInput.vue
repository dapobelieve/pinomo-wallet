<template>
  <div class="w-full">
    <label :for="inputId" class="select-none text-sm">
      <slot name="label"></slot>
    </label>
    <div class="input-parent relative mt-1 flex bg-white">
      <vue-tel-input
        :id="inputId"
        v-model="phoneValue"
        :disabled="disabled"
        :placeholder="placeholder"
        :only-countries="onlyCountries"
        mode="international"
        class="tel-input w-full border-0 bg-white text-emphasis-higher outline-1 outline-surface-400 focus:outline-1 focus:outline-offset-0 focus:outline-primary-deep"
        :class="{ 'outline-red-500': errMsg }"
        @validate="handleValidation"
        @country-changed="handleCountryChanged"
        @focus="$emit('focus', $event)"
      />
    </div>
    <small v-show="errMsg" class="text-red-500">{{ errMsg }}</small>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890abcdef', 10)

const props = defineProps({
  modelValue: String,
  errMsg: String,
  placeholder: String,
  disabled: Boolean,
  onlyCountries: {
    type: Array,
    default: () => [],
  },
})

const $emit = defineEmits(['update:modelValue', 'focus', 'validate', 'update:countryCode'])

const phoneValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    console.log(value)
    $emit('update:modelValue', value)
  },
})

const handleValidation = (validation) => {
  $emit('validate', validation)

  if (validation?.countryCode) {
    $emit('update:countryCode', validation.countryCode)
  }
}

const handleCountryChanged = (country) => {
  if (country?.iso2) {
    $emit('update:countryCode', country.iso2)
  }
}

const inputId = nanoid()
</script>

<style lang="scss">
.tel-input {
  &::deep(.vti__input) {
    border: none !important;
    outline: none !important;
    //padding-left: 0 !important;
    background: transparent !important;
    font-size: inherit !important;
    color: inherit !important;

    &::placeholder {
      color: rgb(var(--color-emphasis-low)) !important;
    }

    &:focus {
      outline: none !important;
      box-shadow: none !important;
    }
  }

  &::deep(.vti__dropdown) {
    border: none !important;
    background: transparent !important;

    &:hover {
      background: red !important;
    }
  }

  &::deep(.vti__dropdown-list) {
    //border-radius: 0.75rem !important;
    border: 1px solid rgb(var(--color-surface-400)) !important;
    box-shadow:
      0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
  }

  &::deep(.vti__dropdown-item) {
    padding: 0.5rem 1rem !important;

    &:hover {
      background-color: rgb(var(--color-surface-100)) !important;
    }

    &.highlighted {
      background-color: rgb(var(--color-primary) / 0.1) !important;
    }
  }

  &::deep(.vti__selection) {
    font-size: inherit !important;
    color: inherit !important;
  }

  &::deep(.vti__flag) {
    margin-right: 0.5rem !important;
  }
}
</style>
