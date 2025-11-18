<template>
  <div class="loading-container" :style="cssVariables">
    <div class="circles">
      <div class="bg-primary rounded-full" v-for="(circle, index) in circleConfig" :key="index" :class="['circle', circle.size]" :style="{ animationDelay: `${index * animationDelay}s` }"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormProgress',
  props: {
    total: {
      type: Number,
      default: 5,
      validator: (value) => value > 0,
    },
    completed: {
      type: Number,
      default: 0,
      validator: (value) => value >= 0,
    },
    animationDuration: {
      type: Number,
      default: 1.5,
      validator: (value) => value > 0,
    },
    animationDelay: {
      type: Number,
      default: 0.2,
      validator: (value) => value >= 0,
    },
    color: {
      type: String,
      default: '#8b5cf6',
    },
  },
  computed: {
    circleConfig() {
      const circles = []
      // Add circles based on total prop
      for (let i = 0; i < this.total; i++) {
        const size = i < this.completed ? 'large' : 'small'
        circles.push({ size, id: `circle-${i}` })
      }

      return circles
    },
    cssVariables() {
      return {
        '--animation-duration': `${this.animationDuration}s`,
        '--circle-color': this.color,
      }
    },
  },
}
</script>

<style scoped>
.circles {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.circle {
  background-size: 6px 6px;
  animation: pulse var(--animation-duration, 1.5s) infinite ease-in-out;
  transition: all 0.3s ease;
}

.large {
  width: 10px;
  height: 10px;
}

.small {
  width: 5px;
  height: 5px;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

/* Animation variations for different circle counts */
.loading-container:has(.circles > :nth-child(n + 8)) .circle {
  animation-duration: calc(var(--animation-duration, 1.5s) * 0.8);
}
</style>
