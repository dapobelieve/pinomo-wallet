import { ref, onUnmounted } from 'vue'

export const usePusherConnection = () => {
  const { $echo } = useNuxtApp()
  const transactionStore = useTransactionStore()
  const walletStore = useWalletStore()
  const toastStore = useToastStore()

  const connectionStatus = ref('disconnected')
  const channel = ref(null)
  const userId = ref(null)

  const getUserId = () => {
    const authStore = useAuthStore()
    if (authStore.user) {
      try {
        const user = typeof authStore.user === 'string' ? JSON.parse(authStore.user) : authStore.user
        return user.id
      } catch (error) {
        console.error('Error parsing user data:', error)
        return null
      }
    }
    return null
  }

  const handleTransactionProcessed = (event) => {
    console.log('Transaction processed event received:', event)

    try {
      if (event.transaction) {
        transactionStore.prependTransaction(event.transaction)

        const transactionType = event.transaction.type === 'incoming' ? 'received' : 'sent'
        const message = `Transaction ${transactionType}: ${event.transaction.currency} ${event.transaction.amount}`

        toastStore.success({
          message,
          duration: 5000,
        })
      }

      if (event.wallet_id && event.balance) {
        walletStore.updateWalletBalance(event.wallet_id, event.balance)
      }
    } catch (error) {
      console.error('Error handling transaction event:', error)
    }
  }

  const connect = () => {
    if (!$echo) {
      console.warn('Echo instance not available. Real-time features disabled.')
      connectionStatus.value = 'unavailable'
      return
    }

    userId.value = getUserId()
    if (!userId.value) {
      console.warn('User ID not found. Cannot connect to Pusher.')
      connectionStatus.value = 'error'
      return
    }

    try {
      connectionStatus.value = 'connecting'

      const channelName = `user.${userId.value}`
      channel.value = $echo.private(channelName)

      console.log(`[Pusher Debug] Attempting to subscribe to: ${channelName}`)
      console.log(`[Pusher Debug] Listening for event: .transaction.processed`)

      channel.value.listen('.transaction.processed', handleTransactionProcessed)

      channel.value.notification((notification) => {
        console.log('[Pusher Debug] Notification received:', notification)
      })

      channel.value.listenToAll((eventName, data) => {
        console.log('[Pusher Debug] Event received - Name:', eventName, 'Data:', data)
      })

      channel.value.subscribed(() => {
        console.log(`Successfully subscribed to ${channelName}`)
        console.log(`[Pusher Debug] User ID: ${userId.value}`)
        connectionStatus.value = 'connected'
      })

      channel.value.error((error) => {
        console.error('Channel subscription error:', error)
        connectionStatus.value = 'error'
      })
    } catch (error) {
      console.error('Error connecting to Pusher:', error)
      connectionStatus.value = 'error'
    }
  }

  const disconnect = () => {
    if (channel.value && userId.value) {
      try {
        const channelName = `user.${userId.value}`
        $echo.leave(channelName)
        channel.value = null
        connectionStatus.value = 'disconnected'
        console.log('Disconnected from Pusher')
      } catch (error) {
        console.error('Error disconnecting from Pusher:', error)
      }
    }
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    connectionStatus,
    connect,
    disconnect,
  }
}
