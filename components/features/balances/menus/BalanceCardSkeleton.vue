<template>
  <div class="relative h-[215px] min-w-[304px] cursor-pointer xl:min-w-[400px]">
    <div class="h-full rounded-3xl px-6 py-4 bg-gray-100">
      <div class="content space-y-8 relative z-[5] flex h-full flex-col transition-all">
        <div class="space-y-6">
          <div class="flex items-center">
            <div class="rounded w-[120px] h-5 animate-pulse bg-gray-200"></div>
            <div class="ml-auto">
              <div class="bg-gray-200 rounded-full p-2 drop-shadow-md w-8 h-8 animate-pulse"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="rounded w-[60px] h-3 animate-pulse bg-gray-200"></div>
            <div class="inline-flex items-center space-x-2">
              <div class="rounded-full w-5 h-5 animate-pulse bg-gray-200"></div>
              <div class="rounded w-[100px] h-3 animate-pulse bg-gray-200"></div>
            </div>
          </div>
        </div>
        <div>
          <div class="rounded w-[150px] h-8 animate-pulse bg-gray-200"></div>
          <div class="rounded w-[30px] h-4 mt-1 animate-pulse bg-gray-200"></div>
        </div>
      </div>
    </div>
    <div class="absolute top-0 h-full w-full overflow-hidden rounded-3xl">
      <div class="absolute -right-20 -bottom-10 h-[350px] w-[400px] bg-gray-100"></div>
    </div>
  </div>
</template>

<script setup>
// This is a skeleton loader component, no props or logic needed
</script>
