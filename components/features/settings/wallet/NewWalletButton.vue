<template>
  <div>
    <div @click="open">
      <slot name="trigger">
        <AppButton>
          <template #prefix>
            <Icon :size="20" :stroke-width="3" class="" name="plus" />
          </template>
          Add Wallet
        </AppButton>
      </slot>
    </div>
    <AppDrawer :id="state.id" @cancel="back" @close="close" @proceed="">
      <template #header>
        <h6 class="text-emphasis-higher text-xl font-bold">Add Wallet</h6>
      </template>
      <div class="px-6 mt-6">
        <!--        <div class=" text-sm mb-2 text-emphasis-higher leading-tight">-->
        <!--          Wallet Type-->
        <!--        </div>-->
        <!--        <div class="flex space-x-4 mb-6">-->
        <!--          <div v-for="wtypes in props.types"-->
        <!--               :class="[getTypeClass(wtypes.code)]"-->
        <!--               class="inline-flex gap-3 cursor-pointer   outline rounded-xl px-3 py-2"-->
        <!--               @click="state.form.wallet_type = wtypes.code">-->
        <!--            <Icon :class="getIconClass(wtypes.code)" :name="wtypes.icon" :size="18" :stroke-width="2" class=""/>-->
        <!--            <span class="text-sm capitalize">{{ wtypes.name }}</span>-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="flex flex-col space-y-4">
          <AppInput v-if="state.form.type === 'bank'" type="text">
            <template #label> Bank Name </template>
          </AppInput>
          <AppSelect v-model="state.form.currency" :options="currencies" append-to-body class="w-full" label="Select Currency">
            <template #selected-option="selectedSlotData">
              <div class="flex items-center space-x-3">
                <img :src="selectedSlotData.flagSrc" class="h-8 w-8 object-contain" />
                <span class="text-emphasis-higher capitalize"> {{ selectedSlotData.name }}</span>
              </div>
            </template>
            <template #option="optionSlotData">
              <div class="flex h-10 items-center">
                <img :src="optionSlotData.flagSrc" class="mr-4 h-8 w-8 object-contain" />
                <div class="space-x-2">
                  <span class="capitalize"> {{ optionSlotData.currency }} </span>
                  <span> {{ optionSlotData.name }}</span>
                </div>
              </div>
            </template>
          </AppSelect>
          <AppInput v-model="state.form.wallet_name" type="text">
            <template #label> Wallet Name sss</template>
          </AppInput>
          <AppTextArea v-model="state.form.description" placeholder="Add description (Optional)"></AppTextArea>
        </div>
      </div>
      <template #footer>
        <div class="bg-surface-200 flex w-full items-center px-4 py-3">
          <AppButton size="lg" type="ghost" @click.stop="back">Cancel</AppButton>
          <AppButton :loading="state.loading" class="ml-auto" @click.stop="createWallet">Add Wallet</AppButton>
        </div>
      </template>
    </AppDrawer>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const { createWallet: _createWallet } = useWallet()
const appDrawer = useDrawer()
const toast = useToastStore()
const { currencies } = useImages()
const props = defineProps({
  types: {
    type: Array,
    default: [
      {
        name: 'bank wallet',
        icon: 'bank',
        code: 'BankWallet',
      },
      // {
      //   name: 'mobile wallet',
      //   icon: 'device-mobile-share',
      //   code: 'MobileMoneyWallet'
      // }
    ],
  },
})

const state = reactive({
  loading: false,
  id: 'settings-new-wallet',
  form: {
    wallet_type: 'BankWallet',
    wallet_name: null,
    currency: null,
    description: null,
  },
  currencies: [
    {
      name: 'xof',
      value: 'XOF',
    },
  ],
})

const createWallet = async () => {
  state.loading = true
  try {
    const { currency, ...rest } = state.form
    await _createWallet({
      ...rest,
      currency: currency.code,
    })

    state.form = {
      wallet_type: 'BankWallet',
      wallet_name: null,
      currency: null,
      description: null,
    }

    toast.show({
      message: `Wallet Created`,
    })
    close()
  } catch (e) {
    toast.error({
      message: `${e.message}: ${e.errors[0]}`,
    })
  } finally {
    state.loading = false
  }
}

const close = () => {
  appDrawer.close(state.id)
}

const open = () => {
  appDrawer.open(state.id)
}

const back = () => {
  close()
}
</script>

<style lang="scss" scoped></style>
