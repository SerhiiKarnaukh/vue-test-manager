<template>
  <div class="throttle-brake-chart">
    <Line :data="lineData" :options="percentChartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { useChartTheme } from '@/composables/f1/useChartTheme'
import { getTeamColor } from '@/utils/f1/teamColors'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

const props = defineProps({
  labels: {
    type: Array,
    default: () => []
  },
  throttleSeries: {
    type: Array,
    default: () => []
  },
  brakeSeries: {
    type: Array,
    default: () => []
  },
  driversByNumber: {
    type: Object,
    default: () => ({})
  }
})

const { percentChartOptions, createDataset } = useChartTheme()

const lineData = computed(() => {
  const throttleDatasets = props.throttleSeries.map((entry) => {
    const teamColor = getDriverColor(entry.driverNumber)
    return createDataset(`${getDriverLabel(entry.driverNumber)} throttle`, entry.points, teamColor)
  })
  const brakeDatasets = props.brakeSeries.map((entry) => {
    const teamColor = getDriverColor(entry.driverNumber)
    return {
      ...createDataset(`${getDriverLabel(entry.driverNumber)} brake`, entry.points, teamColor),
      borderDash: [6, 4],
      fill: false
    }
  })
  return { labels: props.labels, datasets: [...throttleDatasets, ...brakeDatasets] }
})

function getDriverLabel(driverNumber) {
  const driver = props.driversByNumber[driverNumber]
  return `#${driverNumber} ${driver?.acronym || driver?.last_name || ''}`.trim()
}

function getDriverColor(driverNumber) {
  const driver = props.driversByNumber[driverNumber]
  return getTeamColor(driver?.team_name)
}
</script>

<style lang="scss" scoped>
@use '@/styles/f1/variables' as *;

.throttle-brake-chart {
  height: 260px;
  background: $f1-bg-secondary;
  border: 1px solid $f1-border;
  border-radius: $f1-radius-md;
  padding: $f1-spacing-sm;
}
</style>
