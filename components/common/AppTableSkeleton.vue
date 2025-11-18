<template>
  <div class="w-full overflow-hidden rounded-lg">
    <!-- Table Header Skeleton -->
    <div class="grid grid-cols-4 gap-4 bg-surface-100 px-4 py-3">
      <div v-for="i in 4" :key="`header-${i}`" class="h-5 w-24 rounded bg-gray-200 animate-pulse"></div>
    </div>

    <!-- Table Rows Skeleton -->
    <div class="divide-y divide-gray-200">
      <div v-for="i in 4" :key="`row-${i}`" class="grid grid-cols-4 gap-4 px-4 py-4">
        <!-- First Column (Reference) -->
        <div class="flex items-center space-x-2">
          <div class="h-2 w-2 rounded-full bg-gray-200 animate-pulse"></div>
          <div class="h-4 w-24 rounded bg-gray-200 animate-pulse"></div>
        </div>

        <!-- Second Column (Date) -->
        <div class="space-y-1">
          <div class="h-4 w-24 rounded bg-gray-200 animate-pulse"></div>
          <div class="h-3 w-16 rounded bg-gray-200 animate-pulse"></div>
        </div>

        <!-- Third Column (Description) -->
        <div class="flex items-center space-x-2">
          <div class="h-4 w-4 rounded bg-gray-200 animate-pulse"></div>
          <div class="h-4 w-32 rounded bg-gray-200 animate-pulse"></div>
        </div>

        <!-- Fourth Column (Amount) -->
        <div class="h-4 w-16 rounded bg-gray-200 animate-pulse"></div>
      </div>
    </div>

    <!-- Pagination Skeleton -->
    <div class="flex items-center justify-between bg-surface-50 px-4 py-3">
      <div class="h-4 w-20 rounded bg-gray-200 animate-pulse"></div>
      <div class="flex space-x-2">
        <div v-for="i in 3" :key="`page-${i}`" class="h-8 w-8 rounded bg-gray-200 animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// This is a skeleton loader component, no props or logic needed
</script>
