// Tire compound color and label mapping

export const COMPOUND_COLORS = {
  SOFT: '#FF1801',
  MEDIUM: '#FFC906',
  HARD: '#FFFFFF',
  INTERMEDIATE: '#39B54A',
  WET: '#00AEEF'
}

export const COMPOUND_LABELS = {
  SOFT: 'S',
  MEDIUM: 'M',
  HARD: 'H',
  INTERMEDIATE: 'I',
  WET: 'W'
}

export function getCompoundColor(compound) {
  return COMPOUND_COLORS[compound] ?? '#8B949E'
}

export function getCompoundLabel(compound) {
  return COMPOUND_LABELS[compound] ?? '?'
}
