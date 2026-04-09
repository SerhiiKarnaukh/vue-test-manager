<template>
  <div class="telemetry-dashboard">
    <div class="telemetry-dashboard__top">
      <ConnectionStatus :status="WS_STATUS.CONNECTED" />
      <span class="telemetry-dashboard__demo">Demo data</span>
    </div>

    <div class="telemetry-dashboard__charts">
      <SpeedChart
        :labels="chartData.labels"
        :series="chartData.speed"
        :drivers-by-number="driversByNumber"
      />
      <ThrottleBrakeChart
        v-if="!compact"
        :labels="chartData.labels"
        :throttle-series="chartData.throttle"
        :brake-series="chartData.brake"
        :drivers-by-number="driversByNumber"
      />
      <RpmGearChart
        v-if="!compact"
        :labels="chartData.labels"
        :rpm-series="chartData.rpm"
        :drivers-by-number="driversByNumber"
      />
    </div>

    <div class="telemetry-dashboard__cards">
      <MiniTelemetryCard
        v-for="driverNumber in displayedDriverNumbers"
        :key="driverNumber"
        :driver-number="driverNumber"
        :driver="driversByNumber[driverNumber]"
        :data="latestByDriver[driverNumber]"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SpeedChart from '@/components/f1/telemetry/SpeedChart.vue'
import ThrottleBrakeChart from '@/components/f1/telemetry/ThrottleBrakeChart.vue'
import RpmGearChart from '@/components/f1/telemetry/RpmGearChart.vue'
import MiniTelemetryCard from '@/components/f1/telemetry/MiniTelemetryCard.vue'
import ConnectionStatus from '@/components/f1/common/ConnectionStatus.vue'
import { WS_STATUS } from '@/constants/f1'

const props = defineProps({
  compact: { type: Boolean, default: false },
  maxDrivers: { type: Number, default: 4 },
  showSelector: { type: Boolean, default: true },
  showReplay: { type: Boolean, default: true },
})

const MOCK_DRIVER_NUMBERS = [1, 4, 16]

const MOCK_DRIVERS_BY_NUMBER = {
  1: { driver_number: 1, acronym: 'NOR', team_name: 'McLaren' },
  4: { driver_number: 4, acronym: 'PIA', team_name: 'McLaren' },
  16: { driver_number: 16, acronym: 'LEC', team_name: 'Ferrari' },
}

const MOCK_LATEST = {
  1: {
    speed: 287,
    rpm: 11234,
    throttle: 84,
    brake: 0,
    gear: 7,
    n_gear: 7,
    drs: 0,
  },
  4: {
    speed: 276,
    rpm: 10890,
    throttle: 72,
    brake: 0,
    gear: 7,
    n_gear: 7,
    drs: 10,
  },
  16: {
    speed: 291,
    rpm: 11502,
    throttle: 91,
    brake: 3,
    gear: 8,
    n_gear: 8,
    drs: 0,
  },
}

const displayedDriverNumbers = computed(() =>
  MOCK_DRIVER_NUMBERS.slice(0, props.maxDrivers),
)

const driversByNumber = computed(() => {
  const out = {}
  for (const dn of displayedDriverNumbers.value) {
    out[dn] = MOCK_DRIVERS_BY_NUMBER[dn]
  }
  return out
})

const latestByDriver = computed(() => {
  const out = {}
  for (const dn of displayedDriverNumbers.value) {
    out[dn] = MOCK_LATEST[dn]
  }
  return out
})

const chartData = computed(() =>
  buildMockChartData(displayedDriverNumbers.value),
)

function wavePoints(len, base, swing) {
  return Array.from({ length: len }, (_, i) =>
    Math.round(base + swing * Math.sin(i / 4)),
  )
}

function buildMockChartData(driverNumbers) {
  const len = 48
  const labels = Array.from({ length: len }, (_, i) => i + 1)
  return {
    labels,
    speed: driverNumbers.map((dn, idx) => ({
      driverNumber: dn,
      points: wavePoints(len, 220 + idx * 25, 70),
    })),
    throttle: driverNumbers.map((dn, idx) => ({
      driverNumber: dn,
      points: wavePoints(len, 55 + idx * 8, 40),
    })),
    brake: driverNumbers.map((dn, idx) => ({
      driverNumber: dn,
      points: wavePoints(len, 5 + idx * 2, 15),
    })),
    rpm: driverNumbers.map((dn, idx) => ({
      driverNumber: dn,
      points: wavePoints(len, 10200 + idx * 200, 900),
    })),
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/f1/variables' as *;

.telemetry-dashboard {
  display: grid;
  gap: $f1-spacing-md;

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__demo {
    font-size: 11px;
    color: $f1-text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  &__charts {
    display: grid;
    grid-template-columns: 1fr;
    gap: $f1-spacing-md;
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: $f1-spacing-md;
  }
}
</style>
