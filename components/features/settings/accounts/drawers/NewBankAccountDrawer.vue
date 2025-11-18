<template>
  <div>
    <Teleport to="body">
      <AppDrawer :id="state.id" @close="close">
        <template #header>
          <h6 class="text-emphasis-higher text-xl font-bold">Link New Account</h6>
        </template>
        <template #sub-header>
          <div class="sub-header bg-surface-200 border-surface-400 flex flex-col gap-1.5 border-t border-b py-4 pr-3 pl-4">
            <h6 class="text-emphasis-higher leading-tight font-bold">Account Info</h6>
            <p class="text-emphasis-medium text-xs leading-tight">Provide details for the selected method.</p>
          </div>
        </template>
        <div class="px-7 pt-4 pb-4 space-y-3">
          <AppInput type="text">
            <template #label> Account Name </template>
          </AppInput>
          <AppSelect v-model="state.form.country" :options="computedWAEMUCountries" append-to-body class="w-full" label="Country">
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
          <AppSelect v-model="state.form.currency" :options="currencies" append-to-body class="w-full" label="Currency">
            <template #selected-option="selectedSlotData">
              <div class="flex items-center space-x-3">
                <img :src="selectedSlotData.flag" class="mr-4 h-6 w-6 cover rounded-full" />
                <span class="text-emphasis-higher capitalize"> {{ selectedSlotData.name }}</span>
              </div>
            </template>
            <template #option="optionSlotData">
              <div class="flex h-10 items-center">
                <img :src="optionSlotData.flag" class="mr-4 h-8 w-8 cover rounded-full" />
                <div class="space-x-2">
                  <span class="capitalize"> {{ optionSlotData.currency }} </span>
                  <span> {{ optionSlotData.name }}</span>
                </div>
              </div>
            </template>
          </AppSelect>
          <AppInput v-model="state.form.bank_code" type="text">
            <template #label> Bank Code </template>
          </AppInput>
          <AppInput v-model="state.form.account_number" type="text">
            <template #label> Account Number </template>
          </AppInput>
          <AppInput type="text">
            <template #label> SWIFT/BIC </template>
          </AppInput>
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

const { flags, countries, currencies } = useImages()

const toast = useToastStore()
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
  id: 'settings-linked-account-bank-account',
  loading: false,
  form: {
    currency: null,
    country: 'ml',
    transaction_type: 'bank_transfer_ach',
    recipient_type: 'withdrawal',
    account_number: null,
    bank_code: null,
    description: null,
  },
})

const computedWAEMUCountries = computed(() => {
  return countries.filter((x) => x?.flag !== 'canada')
})

const createNewWithdrawalAccount = async () => {
  state.loading = true
  try {
    await walletStore.createWithdrawalAccount({ ...state.form, country: state.form.country.code })
    close()
  } catch (e) {
    toast.error({
      message: `Error: ${e.errors[0]}`,
    })
  } finally {
    state.loading = false
  }
}

const close = () => {
  appDrawer.close(state.id)
}
</script>
<style lang="scss" scoped></style>
