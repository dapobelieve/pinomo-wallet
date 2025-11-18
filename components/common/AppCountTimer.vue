<template>
  <span class="text-sm font-bold text-primary">
    {{ formattedTime }}
  </span>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  minutes: {
    type: Number,
    required: true,
    validator: (value) => value > 0,
  },
})

const emit = defineEmits(['timeUp'])

const remainingSeconds = ref(0)
let intervalId = null

const formattedTime = computed(() => {
  const totalSeconds = remainingSeconds.value
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts = []

  // Show hours only if > 0
  if (hours > 0) {
    parts.push(hours.toString().padStart(2, '0'))
  }

  // Show minutes if hours > 0 OR minutes > 0
  if (hours > 0 || minutes > 0) {
    parts.push(minutes.toString().padStart(2, '0'))
  }

  // Always show seconds
  parts.push(seconds.toString().padStart(2, '0'))

  return parts.join(':')
})

const startTimer = () => {
  remainingSeconds.value = props.minutes * 60

  intervalId = setInterval(() => {
    remainingSeconds.value--

    if (remainingSeconds.value <= 0) {
      clearInterval(intervalId)
      emit('timeUp')
    }
  }, 1000)
}

const stopTimer = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

watch(
  () => props.minutes,
  () => {
    stopTimer()
    startTimer()
  },
)

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>
