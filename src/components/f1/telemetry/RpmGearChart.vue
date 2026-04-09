<template>
  <div class="rpm-gear-chart">
    <Line :data="lineData" :options="rpmChartOptions" />
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
  rpmSeries: {
    type: Array,
    default: () => []
  },
  driversByNumber: {
    type: Object,
    default: () => ({})
  }
})

const { rpmChartOptions, createDataset } = useChartTheme()

const lineData = computed(() => ({
  labels: props.labels,
  datasets: props.rpmSeries.map((entry) => {
    const driver = props.driversByNumber[entry.driverNumber]
    const teamColor = getTeamColor(driver?.team_name)
    const label = `#${entry.driverNumber} ${driver?.acronym || driver?.last_name || ''}`.trim()
    return createDataset(label, entry.points, teamColor)
  })
}))
</script>

<style lang="scss" scoped>
@use '@/styles/f1/variables' as *;

.rpm-gear-chart {
  height: 260px;
  background: $f1-bg-secondary;
  border: 1px solid $f1-border;
  border-radius: $f1-radius-md;
  padding: $f1-spacing-sm;
}
</style>
