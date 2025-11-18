<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="store.isVisible"
      :class="bgClass"
      class="fixed right-4 top-4 z-[1000] flex min-w-[280px] max-w-[320px] items-center justify-between gap-3 rounded-xl p-3 text-sm font-medium text-white shadow-[0px_4px_10px_rgba(0,0,0,0.1)]"
    >
      <Icon :size="20" class="mt-1 shrink-0 text-white" name="info" />
      <span class="shrink text-sm leading-tight tracking-tight text-white">{{ store.message }} </span>
      <button v-if="store.actionText" class="cursor-pointer border-none bg-transparent font-bold text-white" @click="$emit('action-clicked')">
        {{ store.actionText }}
      </button>
      <button class="m-0 p-0" @click="handleClose">
        <Icon :size="20" :stroke-width="2" class="cursor-pointer text-white" name="x" />
      </button>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useToastStore } from '@/stores/toast'

const store = useToastStore()

const bgClass = computed(() => {
  switch (store.color) {
    case 'blue':
      return 'bg-sky-500'
    case 'red':
      return 'bg-rose-500'
    case 'green':
      return 'bg-teal-700'
    case 'orange':
      return 'bg-orange-500'
    default:
      return 'bg-sky-500'
  }
})

function handleClose() {
  store.hide()
}
</script>
