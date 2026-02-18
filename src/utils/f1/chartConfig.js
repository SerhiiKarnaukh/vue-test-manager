// Chart.js default options for F1 dark theme

export const CHART_COLORS = {
  grid: '#30363D',
  tick: '#8B949E',
  text: '#E6EDF3',
  background: '#161B22'
}

export const CHART_FONT = {
  family: "'Roboto Mono', monospace",
  size: 11
}

export const DEFAULT_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    legend: {
      labels: {
        color: CHART_COLORS.text,
        font: CHART_FONT,
        boxWidth: 12
      }
    },
    tooltip: {
      backgroundColor: '#21262D',
      titleColor: CHART_COLORS.text,
      bodyColor: CHART_COLORS.tick,
      borderColor: '#30363D',
      borderWidth: 1
    }
  },
  scales: {
    x: {
      grid: { color: CHART_COLORS.grid },
      ticks: { color: CHART_COLORS.tick, font: CHART_FONT }
    },
    y: {
      grid: { color: CHART_COLORS.grid },
      ticks: { color: CHART_COLORS.tick, font: CHART_FONT }
    }
  }
}
