<template>
  <div class="relative">
    <div ref="triggerRef" class="cursor-pointer" @click="toggleDropdown">
      <slot name="trigger">
        <button class="btn">trigger</button>
      </slot>
    </div>
    <Teleport to="body">
      <div v-if="state.dropdownOpen" ref="floatingElement" :style="state.dropdownStyle" class="absolute z-1000">
        <slot>
          <div class="w-52 bg-surface-100 rounded-3xl border p-1 shadow-sm" tabindex="0">
            <button class="w-full shadow-md">Sign Out</button>
          </div>
        </slot>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref, watch } from 'vue'
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'

const props = defineProps({
  closeAfterClick: {
    type: Boolean,
    default: true,
  },
  placement: {
    type: String,
    default: 'bottom-start',
  },
  dropdownWidth: {
    type: String,
    default: 'w-72',
  },
})

const emit = defineEmits(['item-click'])

const triggerRef = ref(null)
const floatingElement = ref(null)
const cleanupAutoUpdate = ref(null)

const state = reactive({
  dropdownOpen: false,
  dropdownStyle: {},
})

useClickOutside(floatingElement, () => {
  if (state.dropdownOpen) {
    close()
  }
})

const close = () => {
  state.dropdownOpen = false
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
          placement: props.placement,
          middleware: [offset(), flip(), shift()],
        })

        state.dropdownStyle = {
          left: `${x}px`,
          top: `${y}px`,
          width: props.dropdownWidth,
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

const handleItemClick = (item) => {
  emit('item-click', item)
  if (props.closeAfterClick) {
    state.dropdownOpen = false
  }
}

onBeforeUnmount(() => {
  if (cleanupAutoUpdate.value) {
    cleanupAutoUpdate.value()
  }
})
</script>
