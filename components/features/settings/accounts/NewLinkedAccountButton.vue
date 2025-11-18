<template>
  <div>
    <div ref="triggerRef" @click.stop.exact="toggleDropdown">
      <slot name="trigger">
        <AppButton>
          <template #prefix>
            <Icon :size="20" :stroke-width="3" class="" name="plus" />
          </template>
          New Account
        </AppButton>
      </slot>
    </div>
    <Teleport to="body">
      <div v-if="state.dropdownOpen" ref="floatingElement" :style="state.dropdownStyle" class="absolute z-9">
        <ul class="dropdown-content bg-surface-100 w-72 rounded-3xl p-1 shadow-sm" tabindex="0">
          <li v-for="menu in state.menu" class="hover:bg-none select-none">
            <a class="hover:bg-surface-400 cursor-pointer flex items-start gap-x-3.5 rounded-3xl p-3" @click.stop="handleMenuAction(menu)">
              <Icon :name="menu.icon" :size="20" :stroke-width="2.5" class="mt-0.5" />
              <span class="flex flex-col gap-1">
                <span class="text-emphasis-higher text-sm font-bold capitalize">{{ menu.name === 'eft' ? 'EFT' : menu.name }}</span>
                <small class="text-emphasis-low text-xs capitalize">{{ menu.text }}</small>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </Teleport>
    <NewBankAccountDrawer :menu="state.activeMenu" />
    <NewMobileMoneyAccountDrawer :menu="state.activeMenu" />
    <NewInteracSendAccountDrawer :menu="state.activeMenu" />
    <NewBillPayAccountDrawer :menu="state.activeMenu" />
  </div>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref, watch } from 'vue'
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'

const triggerRef = ref(null)
const floatingElement = ref(null)
const cleanupAutoUpdate = ref(null)
const appDrawer = useDrawer()

const props = defineProps({
  closeAfterClick: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['action'])

const state = reactive({
  dropdownOpen: false,
  dropdownStyle: {},
  activeMenu: {},
  menu: [
    {
      icon: 'circle-plus',
      name: 'bank transfer (all banks)',
      text: 'receive funds to your bank account',
      id: 'settings-linked-account-bank-account',
      action: '',
    },
    {
      icon: 'circle-plus',
      name: 'mobile money',
      text: 'send to a mobile wallet',
      id: 'settings-linked-account-mobile-money',
      action: '',
    },
    {
      icon: 'circle-plus',
      name: 'interac send',
      text: 'send via email (Canada only)',
      id: 'settings-linked-account-interac-send',
      action: '',
    },
    {
      icon: 'circle-plus',
      name: 'eft',
      text: 'electric fund transfer',
      id: 'settings-linked-account-mobile-money',
      action: '',
    },
    {
      icon: 'circle-plus',
      name: 'ecobank',
      text: 'withdraw at an atm using a secure code',
      id: 'settings-linked-account-mobile-money',
      action: '',
    },
    {
      icon: 'circle-plus',
      name: 'BillPay',
      text: 'pay directly to a registered biller',
      id: 'settings-linked-account-bill-pay',
      action: '',
    },
  ],
})

useClickOutside(floatingElement, () => {
  if (state.dropdownOpen) {
    close()
  }
})

const close = () => {
  state.dropdownOpen = false
}

watch(
  [() => state.dropdownOpen, triggerRef, floatingElement],
  () => {
    if (state.dropdownOpen && triggerRef.value && floatingElement.value) {
      if (cleanupAutoUpdate.value) {
        cleanupAutoUpdate.value()
      }

      cleanupAutoUpdate.value = autoUpdate(triggerRef.value, floatingElement.value, async () => {
        const { x, y } = await computePosition(triggerRef.value, floatingElement.value, {
          placement: 'bottom-end',
          middleware: [offset(), flip(), shift()],
        })

        state.dropdownStyle = {
          left: `${x}px`,
          top: `${y}px`,
        }
      })
    } else if (cleanupAutoUpdate.value) {
      cleanupAutoUpdate.value()
      cleanupAutoUpdate.value = null
    }
  },
  { immediate: true },
)

const toggleDropdown = () => {
  state.dropdownOpen = !state.dropdownOpen
}

const handleMenuAction = (menu) => {
  Object.assign(state.activeMenu, menu)
  appDrawer.open(state.activeMenu.id)
}

onBeforeUnmount(() => {
  if (cleanupAutoUpdate.value) {
    cleanupAutoUpdate.value()
  }
})
</script>
