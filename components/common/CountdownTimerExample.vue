<template>
  <div class="p-4 space-y-4">
    <h3 class="text-lg font-semibold">Countdown Timer Example</h3>
    
    <div class="space-y-2">
      <label class="block text-sm font-medium">Timer Duration (minutes):</label>
      <input 
        v-model.number="timerMinutes" 
        type="number" 
        min="1" 
        class="input input-bordered w-32"
        placeholder="5"
      >
      <button 
        @click="restartTimer" 
        class="btn btn-primary btn-sm ml-2"
      >
        Restart Timer
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="card bg-base-200 p-4">
        <h4 class="font-medium mb-2">Custom Duration</h4>
        <AppCountTimer 
          :key="timerKey"
          :minutes="timerMinutes" 
          @time-up="handleTimeUp" 
        />
      </div>
      
      <div class="card bg-base-200 p-4">
        <h4 class="font-medium mb-2">30 seconds</h4>
        <AppCountTimer 
          :key="`short-${timerKey}`"
          :minutes="0.5" 
          @time-up="() => console.log('30 seconds up!')" 
        />
      </div>
      
      <div class="card bg-base-200 p-4">
        <h4 class="font-medium mb-2">75 minutes</h4>
        <AppCountTimer 
          :key="`long-${timerKey}`"
          :minutes="75" 
          @time-up="() => console.log('75 minutes up!')" 
        />
      </div>
    </div>

    <div v-if="timeUpMessage" class="alert alert-success">
      <span>{{ timeUpMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppCountTimer from './AppCountTimer.vue'

const timerMinutes = ref(2)
const timerKey = ref(0)
const timeUpMessage = ref('')

const handleTimeUp = () => {
  timeUpMessage.value = `Timer finished at ${new Date().toLocaleTimeString()}!`
  setTimeout(() => {
    timeUpMessage.value = ''
  }, 5000)
}

const restartTimer = () => {
  timerKey.value++
  timeUpMessage.value = ''
}
</script>