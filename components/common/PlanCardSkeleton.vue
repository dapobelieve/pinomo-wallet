<template>
  <div class="relative space-y-4 w-[248px] shrink-0 rounded-3xl border border-gray-100 p-4 h-[286px] bg-gray-50">
    <div>
      <div class="flex items-center w-full mb-3">
        <div class="h-6 w-20 rounded bg-gray-200 animate-pulse"></div>
        <div class="ml-auto">
          <div class="h-6 w-6 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      </div>
      <div class="space-y-1">
        <div class="h-3 w-32 rounded bg-gray-200 animate-pulse"></div>
        <div class="h-3 w-24 rounded bg-gray-200 animate-pulse"></div>
      </div>
    </div>
    <div class="inline-flex items-baseline">
      <div class="h-7 w-12 rounded bg-gray-200 animate-pulse mr-2"></div>
      <div class="h-3 w-8 rounded bg-gray-200 animate-pulse"></div>
    </div>
    <div class="space-y-2">
      <div v-for="i in 7" :key="i" class="flex space-x-1 items-center">
        <div class="h-3.5 w-3.5 rounded-full bg-gray-200 animate-pulse"></div>
        <div class="h-3 w-40 rounded bg-gray-200 animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
