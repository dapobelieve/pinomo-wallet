<template>
  <div class="flex h-full w-full">
    <TheNav />
    <div class="flex h-full w-full min-h-full flex-col">
      <main class="w-full overflow-auto flex-1">
        <NuxtPage />
      </main>
      <footer class="app-footer text-xs"></footer>
      <AppToast />
      <DepositDrawer />
      <TransferDrawer />
    </div>
  </div>
</template>
<script setup>
import { watch, onMounted } from 'vue'

const authStore = useAuthStore()
const { connectionStatus, connect, disconnect } = usePusherConnection()

onMounted(() => {
  if (authStore.token && authStore.user) {
    connect()
  }
})

watch(
  () => authStore.token,
  (newToken, oldToken) => {
    if (newToken && !oldToken) {
      connect()
    } else if (!newToken && oldToken) {
      disconnect()
    }
  },
)
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#__nuxt {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* .app-header {
} */
</style>
