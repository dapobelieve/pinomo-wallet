<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError,
})

const handleError = () => clearError({ redirect: '/' })

const getErrorTitle = (statusCode: number) => {
  switch (statusCode) {
    case 404:
      return 'Page Not Found'
    case 500:
      return 'Server Error'
    case 503:
      return 'Service Unavailable'
    default:
      return 'Oops! Something went wrong'
  }
}

const getErrorDescription = (statusCode: number) => {
  switch (statusCode) {
    case 404:
      return "The page you're looking for doesn't exist or has been moved."
    case 500:
      return "We're experiencing some technical difficulties. Our team has been notified and is working to fix this issue."
    case 503:
      return 'The service is temporarily unavailable. Please try again in a few moments.'
    default:
      return 'An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.'
  }
}

const getErrorIcon = (statusCode: number) => {
  switch (statusCode) {
    case 404:
      return 'search'
    case 500:
      return 'server'
    case 503:
      return 'clock'
    default:
      return 'alert-triangle'
  }
}

const isServerError = computed(() => props.error?.statusCode >= 500)
</script>

<template>
  <div class="min-h-screen bg-surface-100 flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">
      <!-- Error Icon -->
      <div class="mb-8">
        <div class="w-24 h-24 mx-auto rounded-full bg-red-100 flex items-center justify-center">
          <Icon :name="getErrorIcon(error?.statusCode || 500)" :size="48" class="text-red-500" />
        </div>
      </div>

      <!-- Error Content -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-emphasis-higher mb-2">
          {{ error?.statusCode || 500 }}
        </h1>
        <h2 class="text-xl font-semibold text-emphasis-high mb-4">
          {{ getErrorTitle(error?.statusCode || 500) }}
        </h2>
        <p class="text-emphasis-medium text-sm leading-relaxed">
          {{ getErrorDescription(error?.statusCode || 500) }}
        </p>
      </div>

      <!-- Error Details (only in development) -->
      <div v-if="$dev && error?.message" class="mb-8">
        <details class="text-left bg-red-50 border border-red-200 rounded-lg p-4">
          <summary class="cursor-pointer text-red-700 font-medium mb-2">Technical Details</summary>
          <pre class="text-xs text-red-600 overflow-x-auto">{{ error.message }}</pre>
          <pre v-if="error.stack" class="text-xs text-red-600 overflow-x-auto mt-2">{{ error.stack }}</pre>
        </details>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button @click="$router.go(-1)" class="px-6 py-2 border border-surface-400 text-emphasis-medium rounded-lg hover:bg-surface-200 transition-colors">
          <Icon name="arrow-left" :size="16" class="inline mr-2" />
          Go Back
        </button>
        <button @click="handleError" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          <Icon name="home" :size="16" class="inline mr-2" />
          Go to Dashboard
        </button>
        <button v-if="isServerError" @click="$router.go(0)" class="px-6 py-2 border border-surface-400 text-emphasis-medium rounded-lg hover:bg-surface-200 transition-colors">
          <Icon name="refresh-cw" :size="16" class="inline mr-2" />
          Try Again
        </button>
      </div>

      <!-- Support Contact (for server errors) -->
      <div v-if="isServerError" class="mt-8 pt-6 border-t border-surface-300">
        <p class="text-xs text-emphasis-low mb-2">If this problem persists, please contact our support team</p>
        <p class="text-xs text-emphasis-medium">Error ID: {{ error?.statusCode }}-{{ Date.now().toString(36) }}</p>
      </div>
    </div>
  </div>
</template>
