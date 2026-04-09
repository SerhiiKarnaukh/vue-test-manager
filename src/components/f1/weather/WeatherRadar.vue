<template>
  <div class="weather-radar">
    <div class="weather-radar__title">Weather</div>
    <div class="weather-radar__grid">
      <div class="weather-radar__item">
        <span>Air</span>
        <strong>{{ valueOrDash(currentWeather?.air_temperature) }}&deg;C</strong>
      </div>
      <div class="weather-radar__item">
        <span>Track</span>
        <strong>{{ valueOrDash(currentWeather?.track_temperature) }}&deg;C</strong>
      </div>
      <div class="weather-radar__item">
        <span>Humidity</span>
        <strong>{{ valueOrDash(currentWeather?.humidity) }}%</strong>
      </div>
      <div class="weather-radar__item">
        <span>Wind</span>
        <strong>{{ valueOrDash(currentWeather?.wind_speed) }} km/h</strong>
      </div>
      <div class="weather-radar__item">
        <span>Rain</span>
        <strong>{{ rainForecast?.probability ?? 0 }}%</strong>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentWeather: {
    type: Object,
    default: null
  },
  rainForecast: {
    type: Object,
    default: () => ({ probability: 0, etaLaps: null })
  }
})

function valueOrDash(value) {
  return value == null ? '--' : value
}
</script>

<style lang="scss" scoped>
@use '@/styles/f1/variables' as *;

.weather-radar {
  background: $f1-bg-secondary;
  border: 1px solid $f1-border;
  border-radius: $f1-radius-md;
  padding: $f1-spacing-md;
  font-family: $f1-font-mono;

  &__title {
    color: $f1-text-primary;
    margin-bottom: $f1-spacing-sm;
    font-weight: 600;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $f1-spacing-sm;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    color: $f1-text-secondary;
    font-size: 12px;

    strong {
      color: $f1-text-primary;
    }
  }
}
</style>
