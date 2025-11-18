<template>
  <div class="relative">
    <svg class="h-16 w-16" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-surface-400)" stroke-width="20" />
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="var(--xcolor-violet-600)"
        stroke-width="20"
        :stroke-dasharray="`${circumference} ${circumference}`"
        :stroke-dashoffset="circumference * 0.75"
        transform="rotate(-90 50 50)"
        class="progress-circle"
      />
    </svg>
  </div>
</template>
<script setup>
const props = defineProps({
  completed: {
    type: Number,
    default: 0,
  },
  label: {
    type: String,
    default: 'Go do 🚀',
  },
})
const circumference = 2 * Math.PI * 40
const dashArray = computed(() => `${(props.progress / 100) * circumference} ${circumference}`)

const computedFillColor = computed(() => '')
</script>
<style scoped>
.progress-circle {
  transition: stroke-dasharray 0.5s ease-in-out;
}
</style>
