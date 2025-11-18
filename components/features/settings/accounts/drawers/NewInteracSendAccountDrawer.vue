<template>
  <div>
    <Teleport to="body">
      <AppDrawer :id="state.id" @close="close">
        <template #header>
          <h6 class="text-emphasis-higher text-xl font-bold">Link New Account</h6>
        </template>
        <template #sub-header>
          <div class="sub-header bg-surface-200 border-surface-400 flex flex-col gap-1.5 border-t border-b py-4 pr-3 pl-4">
            <h6 class="text-emphasis-higher leading-tight font-bold">Interac Send Info</h6>
            <p class="text-emphasis-medium text-xs leading-tight">Provide details for the selected method.</p>
          </div>
        </template>
        <div class="px-7 pt-4 pb-4 space-y-3">
          <div class="flex space-x-6">
            <AppInput v-model="state.form.first_name" type="text">
              <template #label> First Name </template>
            </AppInput>
            <AppInput v-model="state.form.last_name" type="text">
              <template #label> Last Name </template>
            </AppInput>
          </div>
          <AppInput v-model="state.form.email" type="text">
            <template #label> Email </template>
          </AppInput>
          <AppSelect v-model="state.form.country" :options="countries" append-to-body class="w-full" label="Country">
            <template #selected-option="selectedSlotData">
              <div class="flex items-center space-x-3">
                <img :src="flags[selectedSlotData.flag]" class="h-5 w-8 rounded" />
                <span class="text-emphasis-higher capitalize"> {{ selectedSlotData.name }}</span>
              </div>
            </template>
            <template #option="optionSlotData">
              <div class="flex h-10 items-center">
                <img :src="flags[optionSlotData.flag]" class="mr-4 h-5 w-8 rounded" />
                <div class="space-x-2">
                  <span> {{ optionSlotData.name }}</span>
                </div>
              </div>
            </template>
          </AppSelect>
          <AppInput v-model="state.form.phone" type="text">
            <template #label> Phone Number </template>
          </AppInput>
          <AppSelect v-if="state.providers.length" v-model="state.form.provider" :options="state.providers" append-to-body class="w-full" label="Provider">
            <template #selected-option="selectedSlotData">
              <div class="flex items-center space-x-3">
                <img :src="selectedSlotData.logo" class="h-5 w-5 rounded-full" />
                <span class="text-emphasis-higher capitalize"> {{ selectedSlotData.operator }} ({{ selectedSlotData.provider_name }})</span>
              </div>
            </template>
            <template #option="optionSlotData">
              <div class="flex h-10 items-center">
                <img :src="optionSlotData.logo" class="mr-4 h-5 w-5 rounded-full" />
                <div class="space-x-2">
                  <span> {{ optionSlotData.operator }} ({{ optionSlotData.provider_name }}) </span>
                </div>
              </div>
            </template>
          </AppSelect>
        </div>
        <template #footer>
          <div class="bg-surface-200 flex w-full items-center px-4 py-3">
            <AppButton size="lg" type="ghost">Cancel</AppButton>
            <AppButton :loading="state.loading" class="ml-auto" @click="createNewWithdrawalAccount">Link Account </AppButton>
          </div>
        </template>
      </AppDrawer>
    </Teleport>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useWalletStore } from '~/stores/wallet.js'

const toast = useToastStore()

const { flags, countries, currencies } = useImages()
const { channels, getChannel } = useChannel()

const appDrawer = useDrawer()
const walletStore = useWalletStore()

const props = defineProps({
  menu: {
    type: Object,
  },
  types: {
    type: Array,
    default: [
      {
        name: 'bank wallet',
        icon: 'bank',
        code: 'DefaultWallet',
      },
      {
        name: 'mobile wallet',
        icon: 'device-mobile-share',
        code: 'MobileMoneyWallet',
      },
    ],
  },
})
const state = reactive({
  id: 'settings-linked-account-interac-send',
  loading: false,
  form: {
    first_name: null,
    last_name: null,
    email: null,
    recipient_type: 'interac_send',
    country: null,
    phone: null,
    account_number: null,
    payee_name: null,
    payee_code: null,
  },
  providers: [],
})

const createNewWithdrawalAccount = async () => {
  state.loading = true
  console.log(state.loading)
  try {
    await walletStore.createWithdrawalAccount({
      ...state.form,
      country: state.form.country.code,
    })
    toast.show({
      message: `Withdrawal recipient created`,
      color: 'green',
      duration: 50000,
    })

    close()
  } catch (e) {
    //
  } finally {
    state.loading = false
  }
}

const close = () => {
  state.form = {}
  appDrawer.close(state.id)
}

watch(
  () => state.form.country,
  async (oldData, newData) => {
    await fetchProvidersByCountry(newData?.code)
  },
  {
    deep: true,
  },
)

const fetchProvidersByCountry = async (countryCode) => {
  try {
    const providers = await walletStore.getMobileMoneyProviders(countryCode)
    Object.assign(state.providers, providers)
  } catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  // appDrawer.open(state.id)
})
</script>
<style lang="scss" scoped></style>
