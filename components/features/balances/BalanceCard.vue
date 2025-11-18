<template>
  <div class="relative h-[215px] min-w-[304px] cursor-pointer xl:min-w-[400px]" @click.exact="openWalletDetails">
    <div :class="props.color" class="h-full rounded-3xl px-6 py-4">
      <div :class="[contentTextColor]" class="content space-y-5 relative z-[5] flex h-full flex-col transition-all">
        <div class="space-y-4">
          <div class="flex items-center">
            <h6 class="text-sm font-bold capitalize">{{ wallet.wallet_name }}</h6>
            <div class="ml-auto">
              <TransactionMenu :wallet="wallet">
                <template #trigger>
                  <button class="bg-surface-200 rounded-full p-2 drop-shadow-md">
                    <Icon :size="20" :stroke-width="3" class="text-emphasis-higher rotate-90" name="dots" />
                  </button>
                </template>
              </TransactionMenu>
            </div>
          </div>
          <div class="space-y-1">
            <h6 class="font-medium text-xs">Currency</h6>
            <div class="flex flex-col">
              <div class="inline-flex text-xs mb-4 items-center space-x-2">
                <AppFlag v-if="wallet.currency.toLowerCase() === 'cad'" code="cad" />
                <AppFlag v-else code="xof" />
                <span v-if="currency(wallet.currency)">{{ currency(wallet.currency).code }} ({{ currency(wallet.currency).name }})</span>
                <span v-else>{{ wallet.currency }}</span>
              </div>
              <span class="font-bold">{{ wallet.wallet_reference }} </span>
            </div>
          </div>
        </div>
        <div>
          <h6 class="text-emphasis-high leading-stight text-2xl font-bold">
            {{ $formatNumber(wallet?.balance) }} <sub class="text-xs">{{ wallet.currency }}</sub>
          </h6>
        </div>
      </div>
    </div>
    <div class="absolute top-0 h-full w-full overflow-hidden rounded-3xl">
      <ConeSVG class="absolute -right-45 -bottom-23 h-[350px] w-[400px]" color="#f5f5f5" />
    </div>
  </div>
</template>

<script setup>
import ConeSVG from '~/components/svgs/ConeSVG.vue'

const { $formatNumber } = useNuxtApp()
const { currency } = useImages()
const appDrawer = useDrawer()

const props = defineProps({
  wallet: {
    type: Object,
  },
  text: {
    type: String,
    default: 'Verify your business for full access',
  },
  color: {
    type: String,
    default: 'bg-rose-200',
  },
  pattern: {
    type: String,
    default: 'globe',
  },
})

const state = reactive({
  isHovered: false,
})

const contentTextColor = computed(() => {
  return state.isHovered ? 'text-surface-100 ' : ''
})

function openWalletDetails() {
  appDrawer.open('wallet-details-drawer', { wallet: props.wallet })
}
</script>

<style lang="scss" scoped></style>
