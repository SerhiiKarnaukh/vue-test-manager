// Time, speed, and gap formatting utilities

/**
 * Format lap time in seconds to M:SS.mmm (e.g. 90.123 → "1:30.123")
 */
export function formatLapTime(seconds) {
  if (seconds == null) return '--:--.---'
  const mins = Math.floor(seconds / 60)
  const secs = (seconds % 60).toFixed(3).padStart(6, '0')
  return `${mins}:${secs}`
}

/**
 * Format gap/interval in seconds (e.g. 1.234 → "+1.234")
 */
export function formatGap(seconds) {
  if (seconds == null) return '---'
  if (seconds === 0) return 'LEADER'
  return `+${seconds.toFixed(3)}`
}

/**
 * Format speed in km/h
 */
export function formatSpeed(speed) {
  if (speed == null) return '---'
  return `${speed} km/h`
}

/**
 * Format timestamp to HH:MM:SS UTC
 */
export function formatTimestamp(isoString) {
  if (!isoString) return '--:--:--'
  const date = new Date(isoString)
  return date.toISOString().slice(11, 19)
}

/**
 * Format sector time in seconds (e.g. 28.456 → "28.456")
 */
export function formatSectorTime(seconds) {
  if (seconds == null) return '--.---'
  return seconds.toFixed(3)
}
