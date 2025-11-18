<template>
  <input :id="props.id" class="modal-toggle" type="checkbox" />
  <dialog :id="props.id" class="modal" :style="modalStyle" @click.stop.exact="closeOnBackdropClick($event)">
    <div :class="props.width" class="modal-box w-full rounded-3xl bg-white p-10" @click.stop>
      <slot />
    </div>
  </dialog>
</template>

<script setup>
const appModal = useModal()
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    default: 'max-w-xl',
  },
  closeOnOutsideClick: {
    type: Boolean,
    default: false,
  },
  blur: { type: String, default: '1px' },
  glassIntensity: { type: Number, default: 0.2 },
  backgroundColor: {
    type: String,
    default: '#0f172a',
  },
})
const state = reactive({})

const modalStyle = computed(() => ({
  backgroundColor: props.backgroundColor,
  backdropFilter: `blur(${props.blur})`,
}))

const closeOnBackdropClick = (event) => {
  if (props.closeOnOutsideClick) {
    appModal.close(props.id)
  }
}
</script>

<style lang="scss" scoped></style>
