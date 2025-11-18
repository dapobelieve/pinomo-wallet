<template>
  <div class="w-4 h-4 flex-shrink-0">
    <img v-if="props.code" :alt="`${props.country} flag`" :src="currency(props.code)?.flag ?? flags['sn']" class="w-full h-full object-cover rounded-full" />
    <img v-else :alt="`${props.country} flag`" :src="getCountry(props.country).flag" class="w-full h-full object-cover rounded-full" />
  </div>
</template>
<script lang="ts" setup>
import { useImages } from '~/composables/useImage.js'

const props = defineProps(['country', 'code'])
const { flags, getCountry, currency } = useImages()
</script>
