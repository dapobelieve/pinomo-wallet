import { AppModalStore } from '@/stores/modal'

export function useModal() {
  const modalStore = AppModalStore()

  const register = (id, config = {}) => {
    modalStore.registerDrawer(id, config)
  }

  const open = (id, props = {}) => {
    register(id, props)
    const modal = document.getElementById(id)
    modal.checked = true
    modalStore.openDrawer(id, props)
  }

  const close = (id) => {
    const modal = document.getElementById(id)
    modal.checked = false
    modalStore.closeDrawer(id)
  }

  const isOpen = (id) => {
    const modal = modalStore.getDrawerById(id)
    return modal?.isOpen || false
  }

  return {
    register,
    open,
    close,
    isOpen,
    closeAll: modalStore.closeAllDrawers,
  }
}
