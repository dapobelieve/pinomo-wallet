<template>
  <div class="flex h-full w-full">
    <div :style="backgroundStyle" class="min-h-screen flex w-full bg-cover bg-center bg-no-repeat">
      <div class="flex-1 flex items-start p-8">
        <div class="p-3 rounded-full bg-surface-100">
          <img alt="business-logo" class="h-6 w-6" src="~/assets/images/maraboo.png" />
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
  default: 'https://res.cloudinary.com/believe/image/upload/v1745330483/maraboo/client/register.png',
  alt: 'https://res.cloudinary.com/believe/image/upload/v1745330045/maraboo/client/verify.png',
  invite: 'https://res.cloudinary.com/believe/image/upload/v1753804658/maraboo/client/richard-horvath-cPccYbPrF-A-unsplash.jpg',
}

const getCurrentBackgroundImage = () => {
  if (route.name === 'verification-complete') {
    return backgroundImages.alt
  }
  if (route.name === 'accept-invite-id') {
    return backgroundImages.invite
  }
  return backgroundImages.default
}

const backgroundStyle = computed(() => {
  return {
    backgroundImage: `url(${getCurrentBackgroundImage()})`,
  }
})

onMounted(() => {
  // Only preload the background image for the current route
  const currentImageUrl = getCurrentBackgroundImage()
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = currentImageUrl
  link['data-purpose'] = 'dynamic-background'
  document.head.appendChild(link)
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
