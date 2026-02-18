export function useChartTheme() {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        labels: { color: '#E6EDF3', font: { family: 'Roboto Mono' } }
      }
    },
    scales: {
      x: {
        grid: { color: '#30363D' },
        ticks: { color: '#8B949E' }
      },
      y: {
        grid: { color: '#30363D' },
        ticks: { color: '#8B949E' }
      }
    }
  }

  const speedChartOptions = {
    ...defaultOptions,
    scales: {
      ...defaultOptions.scales,
      y: { ...defaultOptions.scales.y, min: 0, max: 370, title: { display: true, text: 'km/h', color: '#8B949E' } }
    }
  }

  const rpmChartOptions = {
    ...defaultOptions,
    scales: {
      ...defaultOptions.scales,
      y: { ...defaultOptions.scales.y, min: 0, max: 15000, title: { display: true, text: 'RPM', color: '#8B949E' } }
    }
  }

  const percentChartOptions = {
    ...defaultOptions,
    scales: {
      ...defaultOptions.scales,
      y: { ...defaultOptions.scales.y, min: 0, max: 100, title: { display: true, text: '%', color: '#8B949E' } }
    }
  }

  function createDataset(label, data, color) {
    return {
      label,
      data,
      borderColor: color,
      backgroundColor: `${color}20`,
      borderWidth: 1.5,
      pointRadius: 0,
      tension: 0.2,
      fill: false
    }
  }

  return { defaultOptions, speedChartOptions, rpmChartOptions, percentChartOptions, createDataset }
}
