// Race control flag color mapping

export const FLAG_COLORS = {
  GREEN: '#3FB950',
  YELLOW: '#D29922',
  DOUBLE_YELLOW: '#D29922',
  RED: '#F85149',
  BLUE: '#58A6FF',
  BLACK: '#1C1C1C',
  BLACK_WHITE: '#8B949E',
  CHEQUERED: '#E6EDF3'
}

export const FLAG_LABELS = {
  GREEN: 'Green',
  YELLOW: 'Yellow',
  DOUBLE_YELLOW: 'Double Yellow',
  RED: 'Red',
  BLUE: 'Blue',
  BLACK: 'Black',
  BLACK_WHITE: 'Black & White',
  CHEQUERED: 'Chequered'
}

export function getFlagColor(flag) {
  return FLAG_COLORS[flag] ?? '#8B949E'
}
