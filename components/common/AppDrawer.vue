<template>
  <Teleport to="body">
    <div class="drawer drawer-end z-[9]">
      <input :id="props.id" class="drawer-toggle" type="checkbox" />
      <div class="drawer-side">
        <label :for="props.id" aria-label="close sidebar" class="drawer-overlay" @click.prevent="backdropClicked($event)"></label>
        <div class="bg-surface-100 text-base-content border-surface-400 h-full min-h-full w-[512px] border-l">
          <div class="flex h-full min-h-full flex-col">
            <div v-if="props.showHeader" class="header">
              <div class="bg-base flex items-center pt-7 pr-4 pb-3 pl-4">
                <slot name="header"></slot>
                <button class="ml-auto" @click.stop="close">
                  <Icon :size="20" :stroke-width="2.5" name="x" />
                </button>
              </div>
              <slot name="sub-header"></slot>
            </div>
            <div class="flex-1 overflow-y-auto">
              <slot></slot>
            </div>
            <footer v-if="props.showFooter">
              <slot name="footer">
                <div class="bg-surface-200 flex w-full items-center px-4 py-3">
                  <AppButton size="lg" type="ghost" @click.stop="cancel">Cancel</AppButton>
                  <AppButton class="ml-auto" @click.stop="proceed">Proceed</AppButton>
                </div>
              </slot>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const appDrawer = useDrawer()

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  closeOnOutsideClick: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['cancel', 'proceed', 'close'])

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

function handleKeydown(event) {
  if (event.key === 'Escape') {
    if (props.closeOnOutsideClick) {
      appDrawer.close(props.id)
    }
  }
}

function proceed() {
  emit('proceed')
}

const backdropClicked = () => {
  if (props.closeOnOutsideClick) {
    appDrawer.close(props.id)
  }
}

function close() {
  emit('close')
}

function cancel() {
  emit('cancel')
}
</script>

<style lang="scss">
.v-select {
  .vs__dropdown-toggle {
    height: 33px;
  }
}
</style>
