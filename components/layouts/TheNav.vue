<template>
  <aside :class="['flex flex-col bg-surface-100 border-r border-surface-300 flex-none transition-all duration-300 ease-in-out', isCollapsed ? 'w-16' : 'w-[234px]']">
    <div :class="['flex sidebar-header items-center justify-between w-full px-4 py-3 bg-white transition-all duration-300', isCollapsed ? 'justify-center px-2' : 'justify-between px-4']">
      <AppDropDown v-if="!isCollapsed">
        <template #trigger>
          <div class="flex items-center gap-3 p-2 rounded-2xl">
            <AppAvatar :name="authStore.user.full_name" size="sm" />

            <div class="flex flex-col justify-center">
              <span class="text-sm font-semibold leading-tight text-gray-900">{{ authStore.user.full_name }}</span>
              <small class="text-xs text-gray-500">{{ authStore.user?.role?.name }}</small>
            </div>
            <Icon :size="10" name="caret-down" />
          </div>
        </template>
        <AppButton class="shadow-lg bg-surface-100" type="ghost" @click="signout">
          <template #prefix>
            <Icon :size="15" :stroke-width="3" class="text-red-600 mr-3" name="power" />
          </template>
          Sign Out
        </AppButton>
      </AppDropDown>

      <div v-else class="flex items-center justify-center">
        <AppDropDown>
          <template #trigger>
            <AppAvatar :name="authStore.user.full_name" size="sm" />
          </template>
          <AppButton class="shadow-lg bg-surface-100" type="ghost" @click="signout">
            <template #prefix>
              <Icon :size="15" :stroke-width="3" class="text-red-600 mr-3" name="power" />
            </template>
            Sign Out
          </AppButton>
        </AppDropDown>
      </div>

      <button v-if="!isCollapsed" @click="toggleSidebar" :class="['transition-transform duration-300', isCollapsed ? 'rotate-180' : '']">
        <Icon :size="20" :stroke-width="2.5" class="text-black" name="collapse" />
      </button>
    </div>
    <nav class="flex-1 flex flex-col no-scrollbar px-2 overflow-y-auto">
      <ul class="flex-1" style="height: 44px">
        <li v-if="isCollapsed" class="px-2 pl-4 my-3">
          <button @click="toggleSidebar" :class="['transition-transform duration-300', isCollapsed ? 'rotate-180' : '']">
            <Icon :size="20" :stroke-width="2.5" class="text-black" name="collapse" />
          </button>
        </li>
        <template v-for="menuItem in menu">
          <li v-if="!menuItem.section" class="hover:bg-primary-100 hover:rounded-3xl w-full">
            <NuxtLink
              :class="[isActiveMenu(menuItem) ? 'bg-primary-100 rounded-3xl' : '', isCollapsed ? 'justify-center px-2' : 'justify-start px-3']"
              :to="{ name: menuItem.route }"
              class="p-3 inline-flex h-full w-full gap-4 items-center"
              :title="isCollapsed ? menuItem.name : ''"
            >
              <Icon :name="menuItem.icon" :size="20" :stroke-width="2.5" :class="[isActiveMenu(menuItem) ? 'text-primary' : 'text-emphasis-medium']" class="" />
              <span v-if="!isCollapsed" :class="[isActiveMenu(menuItem) ? boldClass : 'text-emphasis-medium ']" class="capitalize text-sm font-medium">{{ menuItem.name }}</span>
            </NuxtLink>
          </li>
          <li v-else class="w-full">
            <h6 v-if="!isCollapsed" class="uppercase p-3 py-4 text-xs text-black font-bold">
              {{ menuItem.name }}
            </h6>
          </li>
        </template>
      </ul>
    </nav>
    <div class="sidebar-footer px-2s pb-4">
      <ul class="rounded-3xl px-1 space-y-2 pb-1 font-roboto bg-surface-200">
        <li class="w-full pl-4" :class="[isCollapsed ? '' : 'py-4']"></li>
      </ul>
    </div>
  </aside>
</template>
<script setup>
const route = useRoute()
const authStore = useAuthStore()
const baseMenu = [{ name: 'home', icon: 'home', section: false, route: 'index' }]

const state = reactive({
  live: false,
  isCollapsed: false,
})

const isCollapsed = computed(() => state.isCollapsed)

const menu = computed(() => {
  // return baseMenu
  return baseMenu.map((item) => {
    if (item.name === 'developers') {
      return {
        ...item,
        route: authStore.business?.tier === 3 ? 'developers-api-keys' : 'developers',
      }
    }
    return item
  })
})

const toggleSidebar = () => {
  state.isCollapsed = !state.isCollapsed
}

const isActiveMenu = computed(() => {
  return (menu) => {
    if (!menu.route) return false
    return route.name === menu.route
  }
})

const boldClass = computed(() => 'text-black')
const activeNav = computed(() => 'bg-primary-100 rounded-2xl')

const signout = () => {
  authStore.logout()
}

console.log(authStore)
</script>
