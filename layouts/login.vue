<template>
  <div class="flex h-full w-full">
    <div class="min-h-screen flex w-full bg-surface-200">
      <div class="w-full h-full p-8">
        <div :style="backgroundStyle" class="max-w-2xl flex flex-col bg-cover rounded-[40px] p-10 bg-center bg-no-repeat h-full w-full bg-surface-100">
          <nuxt-link class="p-3 self-start rounded-full bg-surface-100" to="/"> </nuxt-link>
          <div class="flex-1 flex flex-col justify-center">
            <h6 v-if="route.name === 'login'" class="text-surface-100 italic text-5xl leading-[56px]">
              Welcome! <br />
              Let's get started.
            </h6>
          </div>
          <div>
            <p class="text-surface-300 text-xs">© 2025, Pinomo. All rights reserved.</p>
          </div>
        </div>
      </div>
      <div class="w-full max-w-1/2 flex justify-center p-8">
        <slot />
      </div>
    </div>
    <AppToast />
  </div>
</template>
<script setup>
const route = useRoute()
const backgroundImages = {
  windows2: 'https://res.cloudinary.com/believe/image/upload/v1745330483/maraboo/client/register.png',
  windows: 'https://res.cloudinary.com/believe/image/upload/v1745330483/maraboo/client/windows.jpg',
  login: 'https://res.cloudinary.com/believe/image/upload/v1745330045/maraboo/client/blue-wave.jpg',
}

const backgroundStyle = computed(() => {
  if (route.name === 'set-password') {
    return {
      backgroundImage: `url(${backgroundImages.windows})`,
    }
  }
  return {
    backgroundImage: `url(${backgroundImages.login})`,
  }
})

onMounted(() => {
  Object.values(backgroundImages).forEach((url) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    link['data-purpose'] = 'dynamic-background'
    document.head.appendChild(link)
  })
})
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
