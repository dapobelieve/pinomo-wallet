<template>
  <div class="w-full">
    <!--    <h2 class="text-lg font-semibold text-gray-800 mb-4"></h2>-->
    <div class="relative h-[30rem]">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, reactive } from 'vue'
import Chart from 'chart.js/auto'

const state = reactive({
  chartData: null,
  chartOptions: {},
})

const chartCanvas = ref(null)
let chart = null

const initializeChart = () => {
  if (chart) {
    chart.destroy()
  }

  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        cornerRadius: 4,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          padding: 5,
          stepSize: 20,
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        // barThickness: 2,
        // barPercentage: 0.2,
        categoryPercentage: 0.2,
        grid: {
          display: false,
        },
      },
    },
  }

  chart = new Chart(
    ctx,
    {
      type: 'bar',
      data: state.chartData,
      options: { ...defaultOptions, ...state.chartOptions },
    },
  )
}

const Utils = {
  months({ count }) {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    return labels.slice(0, count)
  },
  numbers({ count, min, max }) {
    const data = []
    for (let i = 0; i < count; i++) {
      data.push(Math.floor(Math.random() * (max - min + 1)) + min)
    }
    return data
  },
  CHART_COLORS: {
    red: 'rgb(255, 99, 132)',
    blue: 'rgb(54, 162, 235)',
    green: 'rgb(75, 192, 192)',
    orange: 'rgb(255, 159, 64)',
    purple: 'rgb(153, 102, 255)',
    yellow: 'rgb(255, 205, 86)',
  },
  transparentize(color, alpha) {
    return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`)
  },
}

// for switching between charts
// watch(activeChart, () => {
//   initializeChart();
// });
// const initializeChart = () => {
//   if (chart) {
//     chart.destroy();
//   }
//
//   if (!chartCanvas.value) return;
//
//   const ctx = chartCanvas.value.getContext('2d');
//   const currentData = activeChart.value === 'chart1' ? state.chart1Data : state.chart2Data;
//
//   if (!currentData) return;
//
//   chart = new Chart(ctx, {
//     type: 'bar',
//     data: currentData,
//     options: state.chartOptions
//   });
// };

onMounted(() => {
  const DATA_COUNT = 12
  const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 }
  const labels = Utils.months({ count: 12 })

  state.chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Bank Wallet',
        data: Utils.numbers(NUMBER_CFG),
        borderColor: Utils.CHART_COLORS.red,
        backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
        borderRadius: Number.MAX_VALUE,
        borderSkipped: false,
      },
      {
        label: 'Mobile Money',
        data: Utils.numbers(NUMBER_CFG),
        backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
        borderRadius: Number.MAX_VALUE,
        borderSkipped: false,
      },
    ],
  }

  state.chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  setTimeout(() => {
    initializeChart()
  }, 0)
})

watch(
  () => state.chartData,
  () => {
    initializeChart()
  },
  { deep: true },
)

watch(
  () => state.chartOptions,
  () => {
    initializeChart()
  },
  { deep: true },
)
</script>
