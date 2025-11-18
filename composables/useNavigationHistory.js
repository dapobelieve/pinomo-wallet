import { onMounted, ref, watch } from 'vue'

const HISTORY_KEY = 'navigation_history'
const MAX_HISTORY = 10

// Reactive navigation history
const navigationHistory = ref([])

export const useNavigationHistory = () => {
  const route = useRoute()

  // Initialize history from sessionStorage
  onMounted(() => {
    const stored = sessionStorage.getItem(HISTORY_KEY)
    if (stored) {
      try {
        navigationHistory.value = JSON.parse(stored)
      } catch (e) {
        navigationHistory.value = []
      }
    }

    // Add current route if not already in history
    addToHistory(route.path)
  })

  // Watch route changes to track navigation
  watch(
    () => route.path,
    (newPath) => {
      addToHistory(newPath)
    },
  )

  const addToHistory = (path) => {
    // Don't add if it's the same as the last entry
    if (navigationHistory.value[navigationHistory.value.length - 1] === path) {
      return
    }

    navigationHistory.value.push(path)

    // Keep only the last MAX_HISTORY entries
    if (navigationHistory.value.length > MAX_HISTORY) {
      navigationHistory.value = navigationHistory.value.slice(-MAX_HISTORY)
    }

    // Persist to sessionStorage
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(navigationHistory.value))
  }

  const getLastPages = (count = 2) => {
    return navigationHistory.value.slice(-count)
  }

  const hasVisitedRoute = (routePath, withinLastPages = 2) => {
    const lastPages = getLastPages(withinLastPages)
    return lastPages.some((path) => path === routePath || path.includes(routePath))
  }

  const hasVisitedLoginInLastPages = (pageCount = 2) => {
    return hasVisitedRoute('/login', pageCount)
  }

  const clearHistory = () => {
    navigationHistory.value = []
    sessionStorage.removeItem(HISTORY_KEY)
  }

  const getHistory = () => {
    return [...navigationHistory.value]
  }

  return {
    navigationHistory: readonly(navigationHistory),
    addToHistory,
    getLastPages,
    hasVisitedRoute,
    hasVisitedLoginInLastPages,
    clearHistory,
    getHistory,
  }
}
