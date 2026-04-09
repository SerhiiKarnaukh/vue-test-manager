<template>
  <div class="f1-timing-view">
    <div v-if="!activeSession" class="f1-timing-view__empty">
      Select a session to load timing data.
    </div>

    <template v-else>
      <TimingTower
        :rows="timingRows"
        :selected-drivers="selectedDrivers"
        @select-driver="toggleDriverSelection"
      />
      <LapTimeComparison :rows="timingRows" :selected-drivers="selectedDrivers" />
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import TimingTower from '@/components/f1/timing/TimingTower.vue'
import LapTimeComparison from '@/components/f1/timing/LapTimeComparison.vue'
import { formatGap, formatLapTime } from '@/utils/f1/formatters'
import { getTeamColor } from '@/utils/f1/teamColors'
import { MAX_SELECTED_DRIVERS } from '@/constants/f1'

const store = useStore()

const activeSession = computed(() => store.state.f1Data.sessions.activeSession)
const sessionKey = computed(() => store.getters['f1Data/sessions/activeSessionKey'])
const drivers = computed(() => store.state.f1Data.sessions.drivers)
const lapsByDriver = computed(() => store.state.f1Data.telemetry.laps)
const fastestLaps = computed(() => store.state.f1Data.telemetry.fastestLaps)
const selectedDrivers = computed(() => store.state.f1Data.telemetry.selectedDrivers)

const timingRows = computed(() => buildTimingRows(drivers.value, lapsByDriver.value, fastestLaps.value))

onMounted(() => {
  fetchTimingData(sessionKey.value)
})

watch(sessionKey, (nextSessionKey) => {
  fetchTimingData(nextSessionKey)
})

function fetchTimingData(nextSessionKey) {
  if (!nextSessionKey) return
  store.dispatch('f1Data/sessions/fetchDrivers')
  store.dispatch('f1Data/telemetry/fetchLatest', nextSessionKey)
  store.dispatch('f1Data/telemetry/fetchLaps', nextSessionKey)
  store.dispatch('f1Data/telemetry/fetchFastestLaps', nextSessionKey)
}

function toggleDriverSelection(driverNumber) {
  const hasDriver = selectedDrivers.value.includes(driverNumber)
  if (hasDriver) {
    const next = selectedDrivers.value.filter((value) => value !== driverNumber)
    store.dispatch('f1Data/telemetry/selectDrivers', next)
    return
  }
  if (selectedDrivers.value.length >= MAX_SELECTED_DRIVERS) return
  store.dispatch('f1Data/telemetry/selectDrivers', [...selectedDrivers.value, driverNumber])
}

function buildTimingRows(driverList, groupedLaps, fastestByDriver) {
  const driversByNumber = buildDriversByNumberMap(driverList)
  const driverNumbers = collectDriverNumbers(driversByNumber, groupedLaps, fastestByDriver)
  const rows = driverNumbers.map((driverNumber) =>
    buildDriverRow(driversByNumber[driverNumber], driverNumber, groupedLaps, fastestByDriver)
  )
  const ranked = rankRows(rows)
  return withGapAndInterval(ranked)
}

function buildDriverRow(driver, driverNumber, groupedLaps, fastestByDriver) {
  const laps = groupedLaps[driverNumber] ?? []
  const latestLap = laps[laps.length - 1] ?? null
  const bestLapSeconds = getLapDurationSeconds(fastestByDriver[driverNumber]) ?? getBestLapSeconds(laps)
  return {
    driverNumber,
    shortName: getDriverShortName(driver, driverNumber),
    teamColor: getTeamColor(getTeamName(driver)),
    bestLapSeconds,
    bestLap: formatLapTime(bestLapSeconds),
    lastLap: formatLapTime(getLapDurationSeconds(latestLap)),
    compound: latestLap?.compound || latestLap?.tire_compound || null,
    stops: countPitStops(laps),
    lapCount: laps.length
  }
}

function rankRows(rows) {
  return rows
    .filter((row) => row.lapCount > 0 || row.bestLapSeconds != null)
    .sort((a, b) => compareBestLap(a.bestLapSeconds, b.bestLapSeconds, a.driverNumber, b.driverNumber))
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
    const intervalRaw = index === 0 ? 0 : row.bestLapSeconds - previous.bestLapSeconds
    return {
      ...row,
      gap: formatGap(gapRaw),
      interval: index === 0 ? 'LEADER' : formatGap(intervalRaw)
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
  return laps.reduce((count, lap) => count + (lap.is_pit_in_lap || lap.pit_in_lap ? 1 : 0), 0)
}

function compareBestLap(left, right, leftDriver, rightDriver) {
  if (left == null && right == null) return compareDriverNumbers(leftDriver, rightDriver)
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
    ...Object.keys(fastestByDriver ?? {})
  ]
  const normalized = rawNumbers.map((value) => normalizeDriverNumber(value)).filter((value) => value != null)
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

.f1-timing-view {
  display: grid;
  gap: $f1-spacing-md;

  &__empty {
    color: $f1-text-secondary;
  }
}
</style>
