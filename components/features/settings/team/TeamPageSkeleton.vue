<template>
  <div class="w-full">
    <div class="mb-4 flex">
      <div class="flex space-x-2">
        <div v-for="i in 2" :key="`tab-${i}`" class="h-8 w-20 rounded-lg bg-gray-200 animate-pulse"></div>
      </div>
    </div>

    <div class="border w-full justify-center px-4 py-3 bg-surface-100 rounded-3xl border-surface-400">
      <div class="grid grid-cols-12 min-h-10 border-b border-surface-400 content-center">
        <div class="col-span-1">
          <div class="h-3 w-4 rounded bg-gray-200 animate-pulse"></div>
        </div>
        <div class="col-span-2">
          <div class="h-3 w-16 rounded bg-gray-200 animate-pulse"></div>
        </div>
        <div class="col-span-2">
          <div class="h-3 w-24 rounded bg-gray-200 animate-pulse"></div>
        </div>
        <div class="col-span-4">
          <div class="h-3 w-20 rounded bg-gray-200 animate-pulse"></div>
        </div>
        <div class="col-span-2">
          <div class="h-3 w-18 rounded bg-gray-200 animate-pulse"></div>
        </div>
        <div class="col-span-1">
          <div class="h-3 w-4 rounded bg-gray-200 animate-pulse"></div>
        </div>
      </div>

      <div class="space-y-0">
        <div v-for="i in 5" :key="`member-${i}`" class="grid grid-cols-12 py-4 border-b border-surface-400 last:border-b-0">
          <div class="col-span-1 flex items-center">
            <div class="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          </div>

          <div class="col-span-2 flex items-center">
            <div class="space-y-1">
              <div class="h-4 w-16 rounded bg-gray-200 animate-pulse"></div>
              <div class="h-3 w-12 rounded bg-gray-200 animate-pulse"></div>
            </div>
          </div>

          <div class="col-span-2 flex items-center">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 rounded bg-gray-200 animate-pulse"></div>
              <div class="h-4 w-20 rounded bg-gray-200 animate-pulse"></div>
            </div>
          </div>

          <div class="col-span-4 flex items-center">
            <div class="flex items-center space-x-3">
              <div class="w-6 h-4 rounded bg-gray-200 animate-pulse"></div>
              <div class="space-y-1">
                <div class="h-4 w-24 rounded bg-gray-200 animate-pulse"></div>
                <div class="h-3 w-16 rounded bg-gray-200 animate-pulse"></div>
              </div>
            </div>
          </div>

          <div class="col-span-2 flex items-center">
            <div class="flex items-center space-x-2">
              <div class="w-5 h-5 rounded-full bg-gray-200 animate-pulse"></div>
              <div class="h-4 w-12 rounded bg-gray-200 animate-pulse"></div>
            </div>
          </div>

          <div class="col-span-1 flex items-center justify-end">
            <div class="w-6 h-6 rounded bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 flex justify-end">
      <div class="h-9 w-32 rounded-xl bg-gray-200 animate-pulse"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  rows: {
    type: Number,
    default: 5,
    validator: (value) => value > 0 && value <= 20,
  },
  showTabs: {
    type: Boolean,
    default: true,
  },
  showActionButton: {
    type: Boolean,
    default: true,
  },
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
