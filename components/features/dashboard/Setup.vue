<template>
  <div class="bg-surface-200 flex flex-col px-6 py-4">
    <div class="flex items-center">
      <div class="flex items-center space-x-5">
        <CircularProgress :completed="state.completed" />
        <div>
          <h6 class="text-xl font-bold">Complete Setup</h6>
          <small class="text-emphasis-medium">
            <span class="text-emphasis-medium font-bold">{{ state.completed }}</span>
            of <span class="text-emphasis-medium font-bold">5</span> Completed
          </small>
        </div>
      </div>
      <AppButton class="ml-auto" size="sm" suffix="caret-down" type="ghost" @click.stop="toggleSetups">
        {{ state.showSetups ? 'Hide' : 'Show' }}
      </AppButton>
    </div>
    <div
      ref="setupContainer"
      :style="{
        maxHeight: state.showSetups ? setupHeight + 'px' : '0px',
        opacity: state.showSetups ? '1' : '0',
        transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
      }"
      class="overflow-hidden"
    >
      <div ref="setupContent" class="w-full content pt-5">
        <div class="no-scrollbar flex space-x-6 overflow-x-auto">
          <SetupCard v-for="setup in state.setups" :setup="setup" />
          <!--          <SetupCard :pattern="patterns['globe']" class="shrink-0"/>-->
          <!--          <SetupCard :pattern="patterns['circle']" class="shrink-0" completed/>-->
          <!--          <SetupCard :pattern="patterns['shape-1']" class="shrink-0" completed/>-->
          <!--          <SetupCard :pattern="patterns['shape-2']" class="shrink-0"/>-->
          <!--          <SetupCard :pattern="patterns['shape-3']" class="shrink-0"/>-->
          <!--          <SetupCard :pattern="patterns['shape-4']" class="shrink-0"/>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { useImages } from '~/composables/useImage.js'

const { patterns } = useImages()

const state = reactive({
  completed: 0,
  showSetups: true,
  setups: [
    {
      text: 'Verify your business for full access.',
      priority: false,
      icon: 'building',
      pattern: patterns['cone'],
      completed: true,
    },
    {
      text: 'Add team members to collaborate on your account.',
      priority: false,
      icon: 'users',
      pattern: patterns['globe'],
      completed: false,
    },
    {
      text: 'Connect your bank accounts for transactions.',
      priority: false,
      icon: 'building',
      pattern: patterns['circle'],
      completed: true,
    },
    {
      text: 'Verify your business for full access.',
      priority: false,
      icon: 'caret-up-down',
      pattern: patterns['globe'],
      completed: false,
    },
    {
      text: 'Verify your business for full access.',
      priority: false,
      icon: 'building',
      pattern: patterns['circle'],
      completed: false,
    },
  ],
})

const setupContainer = ref(null)
const setupContent = ref(null)
const setupHeight = ref(0)

onMounted(() => {
  updateSetupHeight()
  window.addEventListener('resize', updateSetupHeight)
})

function updateSetupHeight() {
  if (setupContent.value) {
    // Add a small buffer to ensure we don't clip content
    setupHeight.value = setupContent.value.scrollHeight + 5
  }
}

async function toggleSetups() {
  // Make sure height is updated before toggling
  if (!state.showSetups) {
    await nextTick()
    updateSetupHeight()
  }
  state.showSetups = !state.showSetups
}
</script>

<style scoped>
:root {
  --space: 1rem;
  --space-md: calc(var(--space) * 2);
  --content-max-width: 60ch;
}

.content {
  display: grid;
  grid-template-columns: 1fr min(var(--content-max-width), 100% - var(--space-md) * 2) 1fr;
}
</style>
