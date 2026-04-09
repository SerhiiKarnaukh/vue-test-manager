<template>
  <div class="f1-dashboard-view">
    <div v-if="!activeSession" class="f1-dashboard-view__empty">
      Select a session to load pit wall panels.
    </div>

    <div v-else class="f1-dashboard-view__grid">
      <section
        class="f1-dashboard-view__panel f1-dashboard-view__panel--timing"
      >
        <div class="f1-dashboard-view__title">Timing (Top 10)</div>
        <TimingTower
          :rows="timingRows.slice(0, 10)"
          :selected-drivers="selectedDrivers"
          @select-driver="toggleDriverSelection"
        />
      </section>

      <section
        class="f1-dashboard-view__panel f1-dashboard-view__panel--telemetry"
      >
        <div class="f1-dashboard-view__title">Telemetry (Top 3)</div>
        <TelemetryDashboard
          compact
          :max-drivers="3"
          :show-selector="false"
          :show-replay="false"
        />
      </section>

      <section class="f1-dashboard-view__panel">
        <WeatherRadar
          :current-weather="currentWeather"
          :rain-forecast="rainForecast"
        />
      </section>

      <section class="f1-dashboard-view__panel">
        <FlagIndicator
          :flag="currentFlag"
          :color="flagColor"
          :is-safety-car="isSafetyCarActive"
        />
        <RaceControlFeed
          :messages="messages"
          :limit="10"
          :show-toolbar="false"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import TimingTower from '@/components/f1/timing/TimingTower.vue'
import TelemetryDashboard from '@/components/f1/telemetry/TelemetryDashboard.vue'
import WeatherRadar from '@/components/f1/weather/WeatherRadar.vue'
import RaceControlFeed from '@/components/f1/racecontrol/RaceControlFeed.vue'
import FlagIndicator from '@/components/f1/racecontrol/FlagIndicator.vue'
import { formatGap, formatLapTime } from '@/utils/f1/formatters'
import { getTeamColor } from '@/utils/f1/teamColors'
import { MAX_SELECTED_DRIVERS } from '@/constants/f1'

const store = useStore()

const activeSession = computed(() => store.state.f1Data.sessions.activeSession)
const sessionKey = computed(
  () => store.getters['f1Data/sessions/activeSessionKey'],
)
const drivers = computed(() => store.state.f1Data.sessions.drivers)
const lapsByDriver = computed(() => store.state.f1Data.telemetry.laps)
const fastestLaps = computed(() => store.state.f1Data.telemetry.fastestLaps)
const selectedDrivers = computed(
  () => store.state.f1Data.telemetry.selectedDrivers,
)
const currentWeather = computed(() => store.state.f1Data.weather.currentWeather)
const rainForecast = computed(() => store.state.f1Data.weather.rainForecast)
const messages = computed(
  () => store.getters['f1Data/raceControl/latestMessages'],
)
const currentFlag = computed(() => store.state.f1Data.raceControl.currentFlag)
const flagColor = computed(() => store.getters['f1Data/raceControl/flagColor'])
const isSafetyCarActive = computed(
  () => store.state.f1Data.raceControl.isSafetyCarActive,
)

const timingRows = computed(() =>
  buildTimingRows(drivers.value, lapsByDriver.value, fastestLaps.value),
)

onMounted(() => {
  bootstrapData(sessionKey.value)
})

watch(sessionKey, (nextSessionKey) => {
  bootstrapData(nextSessionKey)
})

function bootstrapData(nextSessionKey) {
  if (!nextSessionKey) return
  store.dispatch('f1Data/sessions/fetchDrivers')
  store.dispatch('f1Data/telemetry/fetchLatest', nextSessionKey)
  store.dispatch('f1Data/telemetry/fetchLaps', nextSessionKey)
  store.dispatch('f1Data/telemetry/fetchFastestLaps', nextSessionKey)
  store.dispatch('f1Data/weather/fetchCurrentWeather', nextSessionKey)
  store.dispatch('f1Data/weather/fetchRainForecast', nextSessionKey)
  store.dispatch('f1Data/raceControl/fetchMessages', nextSessionKey)
}

function toggleDriverSelection(driverNumber) {
  const hasDriver = selectedDrivers.value.includes(driverNumber)
  if (hasDriver) {
    const next = selectedDrivers.value.filter((value) => value !== driverNumber)
    store.dispatch('f1Data/telemetry/selectDrivers', next)
    return
  }
  if (selectedDrivers.value.length >= MAX_SELECTED_DRIVERS) return
  store.dispatch('f1Data/telemetry/selectDrivers', [
    ...selectedDrivers.value,
    driverNumber,
  ])
}

function buildTimingRows(driverList, groupedLaps, fastestByDriver) {
  const driversByNumber = buildDriversByNumberMap(driverList)
  const driverNumbers = collectDriverNumbers(
    driversByNumber,
    groupedLaps,
    fastestByDriver,
  )
  const rows = driverNumbers.map((driverNumber) =>
    buildDriverRow(
      driversByNumber[driverNumber],
      driverNumber,
      groupedLaps,
      fastestByDriver,
    ),
  )
  return withGapAndInterval(rankRows(rows))
}

function buildDriverRow(driver, driverNumber, groupedLaps, fastestByDriver) {
  const laps = groupedLaps[driverNumber] ?? []
  const latestLap = laps[laps.length - 1] ?? null
  const bestLapSeconds =
    getLapDurationSeconds(fastestByDriver[driverNumber]) ??
    getBestLapSeconds(laps)
  return {
    driverNumber,
    shortName: getDriverShortName(driver, driverNumber),
    teamColor: getTeamColor(getTeamName(driver)),
    bestLapSeconds,
    bestLap: formatLapTime(bestLapSeconds),
    lastLap: formatLapTime(getLapDurationSeconds(latestLap)),
    compound: latestLap?.compound || latestLap?.tire_compound || null,
    stops: countPitStops(laps),
    lapCount: laps.length,
  }
}

function rankRows(rows) {
  return rows
    .filter((row) => row.lapCount > 0 || row.bestLapSeconds != null)
    .sort((a, b) =>
      compareBestLap(
        a.bestLapSeconds,
        b.bestLapSeconds,
        a.driverNumber,
        b.driverNumber,
      ),
    )
    .map((row, index) => ({ ...row, position: index + 1 }))
}

function withGapAndInterval(rows) {
  const leader = rows[0]
  return rows.map((row, index) => {
    if (!leader || row.bestLapSeconds == null) {
      return { ...row, gap: '---', interval: '---' }
    }
    const previous = rows[index - 1]
    const gapRaw = row.bestLapSeconds - leader.bestLapSeconds
    const intervalRaw =
      index === 0 ? 0 : row.bestLapSeconds - previous.bestLapSeconds
    return {
      ...row,
      gap: formatGap(gapRaw),
      interval: index === 0 ? 'LEADER' : formatGap(intervalRaw),
    }
  })
}

function getBestLapSeconds(laps) {
  return laps.reduce((best, lap) => {
    const duration = getLapDurationSeconds(lap)
    if (duration == null) return best
    if (best == null || duration < best) return duration
    return best
  }, null)
}

function countPitStops(laps) {
  return laps.reduce(
    (count, lap) => count + (lap.is_pit_in_lap || lap.pit_in_lap ? 1 : 0),
    0,
  )
}

function compareBestLap(left, right, leftDriver, rightDriver) {
  if (left == null && right == null)
    return compareDriverNumbers(leftDriver, rightDriver)
  if (left == null) return 1
  if (right == null) return -1
  if (left !== right) return left - right
  return compareDriverNumbers(leftDriver, rightDriver)
}

function compareDriverNumbers(left, right) {
  const leftParsed = Number(left)
  const rightParsed = Number(right)
  if (Number.isFinite(leftParsed) && Number.isFinite(rightParsed)) {
    return leftParsed - rightParsed
  }
  return String(left).localeCompare(String(right))
}

function getDriverNumber(driver) {
  return driver?.driver_number ?? driver?.number ?? driver?.driver
}

function buildDriversByNumberMap(driverList) {
  return driverList.reduce((acc, driver) => {
    const driverNumber = normalizeDriverNumber(getDriverNumber(driver))
    if (driverNumber == null) return acc
    acc[driverNumber] = driver
    return acc
  }, {})
}

function collectDriverNumbers(driversByNumber, groupedLaps, fastestByDriver) {
  const rawNumbers = [
    ...Object.keys(driversByNumber),
    ...Object.keys(groupedLaps ?? {}),
    ...Object.keys(fastestByDriver ?? {}),
  ]
  const normalized = rawNumbers
    .map((value) => normalizeDriverNumber(value))
    .filter((value) => value != null)
  return [...new Set(normalized)]
}

function normalizeDriverNumber(value) {
  if (value == null) return null
  const parsed = Number(value)
  if (Number.isFinite(parsed)) return parsed
  const asString = String(value).trim()
  return asString.length > 0 ? asString : null
}

function getDriverShortName(driver, fallbackNumber) {
  return (
    driver?.acronym ||
    driver?.name_acronym ||
    driver?.last_name ||
    driver?.surname ||
    driver?.full_name ||
    `Driver ${fallbackNumber}`
  )
}

function getTeamName(driver) {
  return driver?.team_name || driver?.team || driver?.constructor_name
}

function getLapDurationSeconds(lap) {
  if (!lap) return null
  return lap.lap_duration ?? lap.lap_time ?? lap.duration ?? null
}
</script>

<style lang="scss" scoped>
@use '@/styles/f1/variables' as *;
@use '@/styles/f1/pit-wall' as *;

.f1-dashboard-view {
  &__empty {
    color: $f1-text-secondary;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $f1-spacing-md;
  }

  &__panel {
    display: grid;
    gap: $f1-spacing-sm;
  }

  &__title {
    color: $f1-text-primary;
    font-weight: 600;
    font-size: 13px;
  }

  &__panel--timing,
  &__panel--telemetry {
    align-content: start;
  }
}

@media (max-width: 1200px) {
  .f1-dashboard-view__grid {
    grid-template-columns: 1fr;
  }
}
</style>
