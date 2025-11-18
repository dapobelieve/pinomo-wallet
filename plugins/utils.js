import { format } from 'date-fns'

const formatDate = (date, f = 'dd MMMM yyyy') => {
  return format(new Date(date), f)
}

const capitalize = (value) => {
  return `${value?.charAt(0)?.toUpperCase()}${value?.slice(1)}`
}

const formatAmountToShortString = (amount) => {
  let divisor, suffix

  if (amount >= 1_000_000_000) {
    divisor = 1_000_000_000
    suffix = 'b'
  } else if (amount >= 1_000_000) {
    divisor = 1_000_000
    suffix = 'm'
  } else if (amount >= 1_000) {
    divisor = 1_000
    suffix = 'k'
  } else {
    return amount.toString()
  }

  let formatted = (amount / divisor).toFixed(2)
  formatted = formatted.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')

  return `${formatted}${suffix}`
}

function formatNumberWithCommas(number) {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
  }).format(number)
}

function slugToString(word) {
  if (!word) return ''
  return word?.split('_')?.join(' ')
}

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      capitalize: capitalize,
      formatAmountToShortString: formatAmountToShortString,
      formatDate: formatDate,
      slugToString: slugToString,
      formatNumber: formatNumberWithCommas,
    },
  }
})
