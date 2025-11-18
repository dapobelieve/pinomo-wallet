<template>
  <AppDrawer id="settings-profile-drawer" @cancel="back" @close="close" @proceed="">
    <template #header>
      <h6 class="text-emphasis-higher text-xl font-bold">Edit Profile</h6>
    </template>
    <div class="px-4 mt-6">
      <span class="text-sm text-emphasis-higher"> Profile Picture </span>
      <div class="flex mt-3 items-center mb-8">
        <div class="inline-flex items-center space-x-3">
          <AppAvatar name="Otunba" size="2xl" />
          <div>
            <div class="inline-flex mb-3">
              <AppButton class="mr-4" size="sm" type="outline">Update</AppButton>
              <AppButton class="" size="sm" type="outline">Remove</AppButton>
            </div>
            <span class="tracking-wide block text-[10px] text-emphasis-low"> Upload a square image (JPG, PNG, JPEG, min 1000px) </span>
          </div>
        </div>
      </div>
      <div class="flex space-x-4">
        <AppInput type="text">
          <template #label> First Name </template>
        </AppInput>
        <AppInput type="text">
          <template #label> Last Name </template>
        </AppInput>
      </div>
    </div>
    <template #footer>
      <div class="bg-surface-200 flex w-full items-center px-4 py-3">
        <AppButton size="lg" type="ghost" @click.stop="back">Cancel</AppButton>
        <AppButton class="ml-auto" @click.stop="">Update</AppButton>
      </div>
    </template>
  </AppDrawer>
</template>

<script setup>
import { reactive } from 'vue'

const appDrawer = useDrawer()

const props = defineProps({})

const state = reactive({
  id: 'settings-profile-drawer',
})

const close = () => {
  appDrawer.close(state.id)
}

const back = () => {
  close()
}
</script>

<style lang="scss" scoped></style>
