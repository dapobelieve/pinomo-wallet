import { onMounted, onUnmounted } from 'vue'

export function useClickOutside(elementRef, callback) {
  const listener = (event) => {
    if (!elementRef.value || elementRef.value.contains(event.target)) {
      return
    }
    callback(event)
  }

  onMounted(() => {
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
  })

  onUnmounted(() => {
    document.removeEventListener('mousedown', listener)
    document.removeEventListener('touchstart', listener)
  })
}
