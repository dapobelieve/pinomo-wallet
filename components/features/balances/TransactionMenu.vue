<template>
  <div class="relative">
    <div ref="triggerRef" @click.stop="toggleDropdown">
      <slot name="trigger">
        <button class="btn">Actions</button>
      </slot>
    </div>
    <Teleport to="body">
      <div v-if="state.dropdownOpen" ref="floatingElement" :style="state.dropdownStyle" class="absolute z-9">
        <ul class="dropdown-content bg-surface-100 w-72 rounded-3xl p-1 shadow-sm" tabindex="0">
          <li v-for="menu in state.menu" :key="menu.name" class="hover:bg-none">
            <a class="p- hover:bg-surface-400 cursor-pointer flex items-start gap-x-3.5 rounded-3xl p-3" @click.stop="handleMenuAction(menu)">
              <Icon :name="menu.icon" :size="20" :stroke-width="2.5" class="mt-0.5" />
              <span class="flex flex-col gap-1">
                <span class="text-emphasis-higher text-sm font-bold capitalize">{{ menu.name }}</span>
                <small class="text-emphasis-low text-xs capitalize">{{ menu.text }}</small>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </Teleport>
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
    default: true,
  },
  wallet: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['action'])

const state = reactive({
  dropdownOpen: false,
  dropdownStyle: {},
  menu: [
    {
      icon: 'circle-plus',
      name: 'deposit',
      text: 'adding funds from an external source',
      action: '',
    },
    {
      icon: 'arrow-right-circle',
      name: 'transfer',
      text: 'transfer funds to another account',
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

function handleTransactionAction(actionType, menu) {
  const drawerProps = props.wallet ? { selectedWallet: props.wallet } : {}

  switch (actionType) {
    case 'deposit':
      appDrawer.open(`${actionType}-drawer`, drawerProps)
      break
    case 'transfer':
      appDrawer.open('transfer-drawer', drawerProps)
      break
  }
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

const handleMenuAction = (menuItem) => {
  handleTransactionAction(menuItem.name, menuItem)
  if (props.closeAfterClick) {
    state.dropdownOpen = false
  }
}

onBeforeUnmount(() => {
  if (cleanupAutoUpdate.value) {
    cleanupAutoUpdate.value()
  }
})
</script>
