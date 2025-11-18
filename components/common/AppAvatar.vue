<template>
  <div class="inline-flex aspect-square flex-shrink-0 flex-grow-0 items-center justify-center rounded-full bg-surface" :class="[avatarSize]">
    <img v-show="props.src" :src="computedSrc" class="h-full w-full rounded-full" alt="" />
    <span v-show="props.name" class="select-none uppercase">{{ computedSrc }}</span>
  </div>
</template>
<script setup>
import { computed, reactive } from 'vue'
import { filename } from 'pathe/utils'

const props = defineProps({
  src: String,
  name: String,
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'base', 'sm', 'md', 'lg', 'xl', '2xl'].includes(value),
  },
})

const glob = import.meta.glob('~/assets/images/*.svg', { eager: true })
const images = Object.fromEntries(Object.entries(glob).map(([key, value]) => [filename(key), value.default]))

const data = reactive({
  sizes: {
    xs: 'h-6 w-6 text-xs', // 24x24
    sm: 'h-8 w-8 text-sm', // 32x32
    base: 'h-10 w-10 text-base', // 40x40
    md: 'h-12 w-12 text-lg', // 48x48
    lg: 'h-14 w-14 text-xl', // 56x56
    xl: 'h-16 w-16 text-2xl', // 64x64
    '2xl': 'h-20 w-20 text-3xl', // 80x80
  },
})

const avatarSize = computed(() => data.sizes[props.size])

const computedSrc = computed(() => {
  if (!props.src) {
    return props?.name?.charAt(0)
  } else if (props.src.startsWith('@/')) {
    return images[props.src.replace('@/', '').replace('.svg', '')]
  } else {
    return props.src
  }
})

// const computedBg = computed(() => {
//   if (computedSrc?.value?.length == 1) {
//     const gradient = data.gradientColors[1]
//     return `bg-gradient-to-b from-[${gradient.from}] to-[${gradient.to}]`
//   }
// })
</script>
