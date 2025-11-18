import { defineNuxtPlugin } from '#app'
import VueTelInput from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueTelInput, { defaultCountry: 'CA', validCharactersOnly: true, dropdownOptions: { showDialCodeInSelection: true } })
})
