import { defineStore } from 'pinia'

export const AppModalStore = defineStore('modal', {
  state: () => ({
    modals: {},
    activeDrawers: new Set(),
  }),
  actions: {
    registerDrawer(id, config = {}) {
      this.modals[id] = {
        isOpen: false,
        title: config.title || '',
        width: config.width || '400px',
        position: config.position || 'right',
        closeOnEsc: config.closeOnEsc !== false,
        closeOnOutsideClick: config.closeOnOutsideClick !== false,
        beforeClose: config.beforeClose || null,
        ...config,
      }
    },

    unregisterDrawer(id) {
      delete this.modals[id]
      this.activeDrawers.delete(id)
    },

    openDrawer(id, props = {}) {
      if (!this.modals[id]) {
        console.warn(`Drawer with id "${id}" not registered`)
        return
      }

      // Merge any runtime props with registered config
      this.modals[id] = {
        ...this.modals[id],
        ...props,
        isOpen: true,
      }

      this.activeDrawers.add(id)
    },

    closeDrawer(id) {
      if (!this.modals[id]) return

      const drawer = this.modals[id]

      // Run beforeClose hook if provided
      if (drawer.beforeClose && typeof drawer.beforeClose === 'function') {
        const shouldClose = drawer.beforeClose()
        if (shouldClose === false) return
      }

      drawer.isOpen = false
      this.activeDrawers.delete(id)
    },

    closeAllDrawers() {
      Object.keys(this.modals).forEach((id) => {
        this.closeDrawer(id)
      })
    },
  },

  getters: {
    isAnyDrawerOpen: (state) => state.activeDrawers.size > 0,
    getDrawerById: (state) => (id) => state.modals[id],
  },
})
