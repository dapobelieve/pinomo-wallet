import { AppDrawerStore } from '@/stores/drawer'

export function useDrawer() {
  const drawerStore = AppDrawerStore()

  const register = (id, config = {}) => {
    drawerStore.registerDrawer(id, config)
  }

  const open = (id, props = {}) => {
    register(id, props)
    const drawer = document.getElementById(id)
    drawer.checked = true
    drawerStore.openDrawer(id, props)
  }

  const close = (id) => {
    const drawer = document.getElementById(id)
    drawer.checked = false
    drawerStore.closeDrawer(id)
  }

  const isOpen = (id) => {
    const drawer = drawerStore.getDrawerById(id)
    return drawer?.isOpen || false
  }

  return {
    register,
    open,
    close,
    isOpen,
    closeAll: drawerStore.closeAllDrawers,
  }
}
