import { filename } from 'pathe/utils'
import { computed, reactive } from 'vue'

export function useImages() {
  const state = reactive({
    flagsGlob: import.meta.glob('~/assets/images/flags/*.svg', { eager: true }),
    patternsGlob: import.meta.glob('~/assets/images/patterns/*.svg', { eager: true }),
    glob: import.meta.glob('~/assets/images/*.svg', { eager: true }),
    images: computed(() => Object.fromEntries(Object.entries(state.glob).map(([key, value]) => [filename(key), value.default]))),
    countries: [
      {
        name: 'Canada',
        flag: 'canada',
        currency: 'cad',
        code: 'ca',
      },
      {
        name: 'United States',
        flag: 'unitedstates',
        currency: 'usd',
        code: 'us',
      },
      {
        name: 'Nigeria',
        flag: 'nigeria',
        currency: 'ngn',
        code: 'ng',
      },
      {
        name: 'China',
        flag: 'china',
        currency: 'cny',
        code: 'cn',
      },
      {
        name: 'United Kingdom',
        flag: 'unitedkingdom',
        currency: 'gbp',
        code: 'gb',
      },
      {
        name: 'France',
        flag: 'france',
        currency: 'eur',
        code: 'fr',
      },
      {
        name: 'Germany',
        flag: 'germany',
        currency: 'eur',
        code: 'de',
      },
      {
        name: 'India',
        flag: 'india',
        currency: 'inr',
        code: 'in',
      },
      {
        name: 'Australia',
        flag: 'australia',
        currency: 'aud',
        code: 'au',
      },
      {
        name: 'Benin',
        flag: 'benin',
        currency: 'xof',
        currencyName: 'West Africcan CFA Franc',
        code: 'bj',
      },
      {
        name: 'Burkina Faso',
        flag: 'burkinafaso',
        currency: 'xof',
        currencyName: 'West Africcan CFA Franc',
        code: 'bf',
      },
      {
        name: "Côte d'Ivoire",
        flag: 'cotedivoire',
        currency: 'xof',
        currencyName: 'West Africcan CFA Franc',
        code: 'ci',
      },
      {
        name: 'Guinea-Bissau',
        flag: 'guineabissau',
        currency: 'xof',
        currencyName: 'West Africcan CFA Franc',
        code: 'gw',
      },
      {
        name: 'Mali',
        flag: 'mali',
        currency: 'xof',
        currencyName: 'West Africcan CFA Franc',
        code: 'ml',
      },
      {
        name: 'Niger',
        flag: 'niger',
        currency: 'xof',
        currencyName: 'West Africcan CFA Franc',
        code: 'ne',
      },
      {
        name: 'Senegal',
        flag: 'senegal',
        currency: 'xof',
        currencyName: 'West Africcan CFA Franc',
        code: 'sn',
      },
      {
        name: 'Togo',
        flag: 'togo',
        currency: 'xof',
        currencyName: 'West African CFA Franc',
        code: 'tg',
      },
    ],
    flags: computed(() => Object.fromEntries(Object.entries(state.flagsGlob).map(([key, value]) => [filename(key), value.default]))),
    patterns: computed(() => Object.fromEntries(Object.entries(state.patternsGlob).map(([key, value]) => [filename(key), value.default]))),
    currencies: [
      {
        name: 'West African CFA Franc',
        value: 'XOF',
        code: 'XOF',
        symbol: 'CFA',
        flagSrc: 'https://res.cloudinary.com/believe/image/upload/v1748276901/maraboo/client/bcao.svg',
        flag: 'https://res.cloudinary.com/believe/image/upload/v1748276901/maraboo/client/bcao.svg',
      },
      {
        name: 'Canadian Dollar',
        value: 'CAD',
        code: 'CAD',
        symbol: '$',
        flagSrc: 'https://res.cloudinary.com/believe/image/upload/v1752297698/maraboo/client/canada.svg',
        flag: 'https://res.cloudinary.com/believe/image/upload/v1752297698/maraboo/client/canada.svg',
      },
    ],
  })

  onMounted(() => {
    state.countries.forEach((country) => {
      country.flagImage = state.flags[country.flag] || null
    })
  })

  function getCurrencyByCode(code) {
    return state.currencies.find((currency) => currency.code.toLowerCase() === code.toLowerCase())
  }

  function getImageFromCountryCode(code) {
    let country = state.countries.find((country) => country.code.toLowerCase() === code)
    return {
      flag: state.flags[country.flag],
      name: country.name,
    }
  }

  return {
    images: state.images,
    flags: state.flags,
    patterns: state.patterns,
    countries: state.countries,
    currencies: state.currencies,
    getCountry: getImageFromCountryCode,
    currency: getCurrencyByCode,
  }
}
