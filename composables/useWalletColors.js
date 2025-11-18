export const useWalletColors = () => {
  const colors = ['bg-rose-200', 'bg-amber-200', 'bg-sky-200', 'bg-blue-200', 'bg-emerald-200', 'bg-green-200', 'bg-lime-200', 'bg-cyan-200']

  const getWeekKey = () => {
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const weekNumber = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7)
    return `wallet-colors-${now.getFullYear()}-week-${weekNumber}`
  }

  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const getWeeklyColors = () => {
    if (process.server) return colors

    const weekKey = getWeekKey()
    const stored = localStorage.getItem(weekKey)

    if (stored) {
      return JSON.parse(stored)
    }

    const shuffledColors = shuffleArray(colors)
    localStorage.setItem(weekKey, JSON.stringify(shuffledColors))

    const currentWeekKey = getWeekKey()
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('wallet-colors-') && key !== currentWeekKey) {
        localStorage.removeItem(key)
      }
    })

    return shuffledColors
  }

  const getColorForIndex = (index) => {
    const weeklyColors = getWeeklyColors()
    return weeklyColors[index % weeklyColors.length]
  }

  return {
    colors,
    getWeeklyColors,
    getColorForIndex,
  }
}
