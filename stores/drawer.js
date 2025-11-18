import { defineStore } from 'pinia'

export const AppDrawerStore = defineStore('drawer', {
  state: () => ({
    drawers: {},
    activeDrawers: new Set(),
  }),
  actions: {
    registerDrawer(id, config = {}) {
      this.drawers[id] = {
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
      delete this.drawers[id]
      this.activeDrawers.delete(id)
    },

    openDrawer(id, props = {}) {
      if (!this.drawers[id]) {
        console.warn(`Drawer with id "${id}" not registered`)
        return
      }

      // Merge any runtime props with registered config
      this.drawers[id] = {
        ...this.drawers[id],
        ...props,
        isOpen: true,
        // Store wallet selection props for transaction drawers
        ...(props.selectedWallet && { preSelectedWallet: props.selectedWallet }),
        ...(props.fromWallet && { preSelectedFromWallet: props.fromWallet }),
      }

      this.activeDrawers.add(id)
    },

    closeDrawer(id) {
      if (!this.drawers[id]) return

      const drawer = this.drawers[id]

      // Run beforeClose hook if provided
      if (drawer.beforeClose && typeof drawer.beforeClose === 'function') {
        const shouldClose = drawer.beforeClose()
        if (shouldClose === false) return
      }

      drawer.isOpen = false
      this.activeDrawers.delete(id)
    },

    closeAllDrawers() {
      Object.keys(this.drawers).forEach((id) => {
        this.closeDrawer(id)
      })
    },
  },

  getters: {
    isAnyDrawerOpen: (state) => state.activeDrawers.size > 0,
    getDrawerById: (state) => (id) => state.drawers[id],
  },
})
