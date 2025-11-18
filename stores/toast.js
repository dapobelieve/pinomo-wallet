import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    isVisible: false,
    message: '',
    color: 'blue',
    duration: 5000,
    actionText: '',
    timeoutId: null,
  }),
  actions: {
    show(config) {
      this.isVisible = true
      this.message = config.message
      this.color = config.color || 'green'
      this.duration = config.duration ?? 9000
      this.actionText = config.actionText || ''

      if (this.timeoutId !== null) {
        window.clearTimeout(this.timeoutId)
      }

      if (this.duration > 0) {
        this.timeoutId = window.setTimeout(() => this.hide(), this.duration)
      }
    },
    success(config) {
      this.isVisible = true
      this.message = config.message
      this.color = 'green'
      this.duration = config.duration ?? 5000

      if (this.timeoutId !== null) {
        window.clearTimeout(this.timeoutId)
      }

      if (this.duration > 0) {
        this.timeoutId = window.setTimeout(() => this.hide(), this.duration)
      }
    },
    error(config) {
      this.isVisible = true
      this.message = config.message
      this.color = 'red'
      this.duration = config.duration ?? 5000

      if (this.timeoutId !== null) {
        window.clearTimeout(this.timeoutId)
      }

      if (this.duration > 0) {
        this.timeoutId = window.setTimeout(() => this.hide(), this.duration)
      }
    },
    hide() {
      this.isVisible = false
      this.reset()
    },
    reset() {
      this.message = ''
      this.color = 'blue'
      this.duration = 5000
      this.actionText = ''
      this.timeoutId = null
    },
  },
})
