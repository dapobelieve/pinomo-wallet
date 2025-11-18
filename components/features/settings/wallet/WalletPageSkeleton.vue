<template>
  <div class="w-full">
    <div class="mb-4 flex">
      <div class="flex items-center space-x-2">
        <div v-for="i in 2" :key="`tab-${i}`" class="h-10 w-24 rounded-lg bg-gray-200 animate-pulse"></div>
      </div>
      <div class="ml-auto">
        <div class="h-10 w-32 rounded-lg bg-gray-200 animate-pulse"></div>
      </div>
    </div>

    <div class="border w-full justify-center px-4 py-3 bg-surface-100 rounded-3xl border-surface-400">
      <div class="grid grid-cols-12 min-h-10 border-b border-surface-400 content-center">
        <div class="col-span-1"></div>
        <div class="col-span-2">
          <div class="h-4 w-16 rounded bg-gray-200 animate-pulse"></div>
        </div>
        <div class="col-span-2">
          <div class="h-4 w-20 rounded bg-gray-200 animate-pulse"></div>
        </div>
        <div class="col-span-4">
          <div class="h-4 w-24 rounded bg-gray-200 animate-pulse"></div>
        </div>
        <div class="col-span-2">
          <div class="h-4 w-16 rounded bg-gray-200 animate-pulse"></div>
        </div>
        <div class="col-span-1"></div>
      </div>

      <div v-for="i in 3" :key="`row-${i}`" class="grid grid-cols-12 gap-4 px-0 py-4 border-b border-surface-400 last:border-b-0">
        <div class="col-span-1 flex justify-center">
          <div class="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
        </div>

        <div class="col-span-2 flex items-center">
          <div class="space-y-1">
            <div class="h-4 w-12 rounded bg-gray-200 animate-pulse"></div>
            <div class="h-3 w-8 rounded bg-gray-200 animate-pulse"></div>
          </div>
        </div>

        <div class="col-span-2 flex items-center">
          <div class="h-4 w-20 rounded bg-gray-200 animate-pulse"></div>
        </div>

        <div class="col-span-4 flex items-center">
          <div class="space-y-1">
            <div class="h-4 w-32 rounded bg-gray-200 animate-pulse"></div>
            <div class="h-3 w-24 rounded bg-gray-200 animate-pulse"></div>
          </div>
        </div>

        <div class="col-span-2 flex items-center">
          <div class="space-y-1">
            <div class="h-5 w-16 rounded bg-gray-200 animate-pulse"></div>
            <div class="h-3 w-8 rounded bg-gray-200 animate-pulse"></div>
          </div>
        </div>

        <div class="col-span-1 flex justify-center">
          <div class="h-6 w-6 rounded bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
