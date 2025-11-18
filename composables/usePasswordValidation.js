export const usePasswordValidation = (password) => {
  const hasMinLength = computed(() => {
    return password.value && password.value.length >= 8
  })

  const hasUppercase = computed(() => {
    return password.value && /[A-Z]/.test(password.value)
  })

  const hasNumber = computed(() => {
    return password.value && /[0-9]/.test(password.value)
  })

  const hasSpecialChar = computed(() => {
    return password.value && /[!@#$%^&*(),.?":{}|<>]/.test(password.value)
  })

  const isPasswordValid = computed(() => {
    return hasMinLength.value && hasUppercase.value && hasNumber.value && hasSpecialChar.value
  })

  const getValidationClass = (isValid) => {
    return isValid ? 'text-green-500' : 'text-emphasis-low'
  }

  return {
    hasMinLength,
    hasUppercase,
    hasNumber,
    hasSpecialChar,
    isPasswordValid,
    getValidationClass
  }
}