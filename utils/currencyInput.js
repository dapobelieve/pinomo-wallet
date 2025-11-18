export const useCurrencyInput = (stateRef, path) => {
  return computed({
    get() {
      const amount = getNestedValue(stateRef, path)
      if (!amount) return ''
      return new Intl.NumberFormat('en-US', {
        style: 'decimal',
      }).format(amount)
    },
    set(newVal) {
      setNestedValue(stateRef, path, Number(newVal.replace(/[^0-9.]/g, '')))
    },
  })
}

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((o, p) => (o || {})[p], obj)
}

const setNestedValue = (obj, path, value) => {
  const keys = path.split('.')
  keys.slice(0, -1).reduce((o, p) => (o[p] = o[p] || {}), obj)[keys.pop()] = value
}
