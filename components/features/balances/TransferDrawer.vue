<template>
  <AppDrawer :id="state.id" @cancel="close" @close="close" @proceed="proceed">
    <template #header>
      <h6 class="text-emphasis-higher text-xl font-bold">Transfer</h6>
    </template>
    <template #sub-header>
      <div class="sub-header bg-surface-200 border-surface-400 flex flex-col gap-1.5 border-t border-b py-4 pr-3 pl-4">
        <h6 class="text-emphasis-higher leading-tight font-bold">Transfer Details</h6>
        <p class="text-emphasis-medium text-sm leading-tight">Send funds to another account</p>
      </div>
    </template>
    <div class="px-3 pt-3 pb-4">
      <div class="inputs space-y-4">
        <div class="account-input">
          <label class="text-emphasis-medium text-xs uppercase tracking-wide block mb-2 px-4">Recipient Account Number</label>
          <div class="bg-base outline-surface-400 flex items-center w-full rounded-3xl py-3 px-4 outline">
            <input
              v-model="state.form.receiver_id"
              class="placeholder:text-emphasis-low text-emphasis-higher w-full border-0 bg-white font-medium placeholder:font-normal focus:shadow-none focus:outline-none"
              placeholder="Enter account number"
              type="text"
              @input="validateAccountNumber"
            />
          </div>
          <p v-if="state.errors.receiver_id" class="text-red-500 text-xs mt-1 px-4">{{ state.errors.receiver_id }}</p>
        </div>
        <div class="amount-input">
          <label class="text-emphasis-medium text-xs uppercase tracking-wide block mb-2 px-4">Amount</label>
          <div class="from-input bg-base outline-surface-400 flex items-center w-full rounded-3xl py-3 px-4 outline">
            <span class="tracking-wide uppercase leading-none flex-1 text-emphasis-medium font-bold text-xs">Amount </span>
            <input
              v-model="formattedAmount"
              autofocus
              class="placeholder:text-emphasis-low text-emphasis-higher border-0 bg-white font-bold placeholder:text-xl placeholder:font-bold focus:shadow-none focus:outline-none"
              dir="rtl"
              placeholder="0.00"
              type="text"
              @keydown="keypressed"
            />
          </div>
          <p v-if="state.errors.amount" class="text-red-500 text-xs mt-1 px-4">{{ state.errors.amount }}</p>
        </div>
        <div
          v-if="calculatedFee > 0"
          class="break-down px-5 my-4 space-x-4 flex items-center before:content before:w-[2px] relative before:absolute before:h-[15px] before:bottom-[34px] before:bg-slate-200 before:left-[37px] after:content after:w-[2px] after:absolute after:h-[15px] after:bottom-[-15px] after:bg-slate-200 after:left-[37px]"
        >
          <span class="p-2 rounded-full">
            <Icon name="minus" :size="18" :stroke-width="3" class="text-red-600" />
          </span>
          <div class="w-full flex item-center">
            <div class="inline-flex items-center space-x-1">
              <span class="capitalize w-full text-emphasis-medium text-sm">Transfer fee (1.5%)</span>
              <Icon :size="15" class="shrink-0 text-emphasis-higher" name="info" />
            </div>
            <span class="capitalize ml-auto text-xs font-bold">{{ $formatNumber(calculatedFee) }}</span>
          </div>
        </div>
        <div v-if="totalDebit > 0" class="total-debit bg-[#99a1af3b] outline-surface-400 flex items-center w-full rounded-3xl py-3 px-4 outline">
          <span class="tracking-wide uppercase leading-none flex-1 text-emphasis-medium font-bold text-xs">total debit </span>
          <input
            class="placeholder:text-emphasis-higher text-emphasis-higher border-0 font-bold placeholder:text-xl placeholder:font-bold focus:shadow-none focus:outline-none"
            dir="rtl"
            :value="$formatNumber(totalDebit)"
            placeholder="0.00"
            disabled
            type="text"
          />
        </div>
        <div class="description-input">
          <label class="text-emphasis-medium text-xs uppercase tracking-wide block mb-2 px-4">Description (Optional)</label>
          <AppTextArea v-model="state.form.description" placeholder="Add a note for this transfer"></AppTextArea>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="bg-surface-200 flex w-full items-center px-4 py-3">
        <AppButton size="lg" type="ghost" @click.stop="close">Cancel</AppButton>
        <AppButton :disabled="!isFormValid" :loading="state.loading" class="ml-auto" @click.stop="proceed">Transfer</AppButton>
      </div>
    </template>
  </AppDrawer>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'

const { $formatNumber } = useNuxtApp()
const walletStore = useWalletStore()
const toast = useToastStore()
const appDrawer = useDrawer()

const state = reactive({
  id: 'transfer-drawer',
  form: {
    receiver_id: '',
    amount: '',
    description: '',
  },
  errors: {
    receiver_id: '',
    amount: '',
  },
  loading: false,
})

const keypressed = (event) => {
  if (!/[\d.\-]|Backspace/.test(event.key)) {
    event.preventDefault()
  }
}

const formattedAmount = useCurrencyInput(state, 'form.amount')

const calculatedFee = computed(() => {
  const amount = parseFloat(state.form.amount)
  if (!amount || amount <= 0) return 0
  return amount * 0.015
})

const totalDebit = computed(() => {
  const amount = parseFloat(state.form.amount)
  if (!amount || amount <= 0) return 0
  return amount + calculatedFee.value
})

const validateAccountNumber = () => {
  state.errors.receiver_id = ''
  if (state.form.receiver_id && state.form.receiver_id.length < 3) {
    state.errors.receiver_id = 'Account number is too short'
  }
}

const validateAmount = () => {
  state.errors.amount = ''
  const amount = parseFloat(state.form.amount)

  if (!amount || amount <= 0) {
    state.errors.amount = 'Amount must be greater than zero'
    return false
  }

  return true
}

const isFormValid = computed(() => {
  return !!(
    state.form.receiver_id &&
    state.form.receiver_id.length >= 3 &&
    state.form.amount &&
    parseFloat(state.form.amount) > 0 &&
    !state.errors.receiver_id
  )
})

const proceed = async () => {
  if (!validateAmount()) return

  state.loading = true
  try {
    await walletStore.transfer({
      receiver_id: state.form.receiver_id,
      amount: parseFloat(state.form.amount),
      description: state.form.description || 'Wallet transfer',
    })

    await walletStore.getAllWallets()

    toast.show({
      message: 'Transfer completed successfully',
      color: 'green',
    })

    close()
  } catch (e) {
    toast.show({
      message: e.response?.data?.message || e.message || 'Transfer failed',
      color: 'red',
    })
  } finally {
    state.loading = false
  }
}

const close = () => {
  state.form.receiver_id = ''
  state.form.amount = ''
  state.form.description = ''
  state.errors.receiver_id = ''
  state.errors.amount = ''
  appDrawer.close(state.id)
}

watch(
  () => state.form.amount,
  () => {
    if (state.errors.amount) {
      validateAmount()
    }
  },
)
</script>

<style lang="scss" scoped></style>
