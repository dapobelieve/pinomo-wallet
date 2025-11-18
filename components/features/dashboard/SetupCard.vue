<template>
  <div class="relative w-[240px] shrink-0 cursor-pointer h-[224px] overflow-hidden">
    <div :class="[bgBorderClasses]" class="absolute inset-0 rounded-3xl"></div>
    <div
      :class="[overlayClass, bgClass]"
      class="bg-red-300 py-7 px-6 absolute inset-x-[1px] top-[1px] bottom-[1px] rounded-3xl overflow-hidden"
      @mouseenter="state.isHovered = true"
      @mouseleave="state.isHovered = false"
    >
      <img :src="props.setup.pattern" class="absolute -right-20 -bottom-10" />
      <div :class="[contentTextColor]" class="content flex flex-col h-full relative z-[9] transition-all">
        <div class="flex-1 space-y-6">
          <div class="flex">
            <Icon :class="[contentTextColor]" :name="props.setup.icon" :size="20" :stroke-width="2.3" />
            <Icon :class="[props.setup.completed ? '' : 'hidden']" :size="20" :stroke-width="2" class="text-teal-600 ml-auto" name="circle-check" />
          </div>
          <p class="text-sm leading-tight">{{ props.setup.text }}.</p>
        </div>
        <div>
          <NewInviteButton>
            <template #trigger>
              <AppButton :type="buttonClasses" size="sm" suffix="chev-right">Start</AppButton>
            </template>
          </NewInviteButton>
          <!--          <AppButton :type="buttonClasses" size="sm" suffix="chev-right">Start</AppButton>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  setup: {
    type: Object,
    default: {},
  },
})

const state = reactive({
  isHovered: false,
})

const bgClass = computed(() => {
  if (props.setup.completed) {
    return 'bg-surface-200'
  } else {
    return 'bg-white'
  }
})

const bgBorderClasses = computed(() => {
  if (props.setup.priority && state.isHovered) {
    return ''
  }
  if (props.setup.priority) {
    return 'bg-gradient-to-br from-sky-500 to-violet-500 delay-1000 transition-all'
  } else {
    return state.isHovered && !props.setup.completed ? '' : 'bg-surface-400'
  }
})

const contentTextColor = computed(() => {
  return state.isHovered ? 'text-surface-100 ' : ''
})

const overlayClass = computed(() => {
  return state.isHovered ? 'bg-gradient-to-br from-sky-500 to-violet-600' : ''
})

const buttonClasses = computed(() => {
  return state.isHovered ? 'outline' : 'fill'
})
</script>

<style lang="scss" scoped></style>
