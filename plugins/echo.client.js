import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  if (!config.public.pusherKey || !config.public.pusherCluster) {
    console.warn('Pusher credentials not configured. Real-time features will be disabled.')
    return
  }

  window.Pusher = Pusher

  if (config.public.environment === 'development') {
    Pusher.logToConsole = true
  }

  const echo = new Echo({
    broadcaster: 'pusher',
    key: config.public.pusherKey,
    cluster: config.public.pusherCluster,
    forceTLS: true,
    authEndpoint: `${config.public.baseUrl}/broadcasting/auth`,
    authorizer: (channel) => {
      return {
        authorize: (socketId, callback) => {
          nuxtApp.$api.post('/api/broadcasting/auth', {
            socket_id: socketId,
            channel_name: channel.name
          })
          .then(response => callback(null, response))
          .catch(error => callback(error))
        }
      }
    }
  })

  return {
    provide: {
      echo,
    },
  }
})
