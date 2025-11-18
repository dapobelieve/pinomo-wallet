<template>
  <div class="flex items-center gap-2 text-xs text-gray-600">
    <div class="relative flex items-center">
      <span
        :class="[
          'inline-block h-2 w-2 rounded-full',
          statusColor,
          isConnected && 'animate-pulse',
        ]"
      ></span>
    </div>
    <span class="hidden sm:inline">{{ statusText }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const { connectionStatus } = usePusherConnection()

const isConnected = computed(() => connectionStatus.value === 'connected')

const statusColor = computed(() => {
  switch (connectionStatus.value) {
    case 'connected':
      return 'bg-green-500'
    case 'connecting':
      return 'bg-yellow-500'
    case 'error':
      return 'bg-red-500'
    case 'disconnected':
      return 'bg-gray-400'
    case 'unavailable':
      return 'bg-gray-300'
    default:
      return 'bg-gray-400'
  }
})

const statusText = computed(() => {
  switch (connectionStatus.value) {
    case 'connected':
      return 'Live'
    case 'connecting':
      return 'Connecting...'
    case 'error':
      return 'Connection error'
    case 'disconnected':
      return 'Offline'
    case 'unavailable':
      return 'Real-time unavailable'
    default:
      return 'Offline'
  }
})
</script>
