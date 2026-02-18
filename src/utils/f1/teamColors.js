// F1 team color mapping — updated seasonally

export const TEAM_COLORS = {
  'Red Bull Racing': '#3671C6',
  'Ferrari': '#E80020',
  'McLaren': '#FF8000',
  'Mercedes': '#27F4D2',
  'Aston Martin': '#229971',
  'Alpine': '#FF87BC',
  'Williams': '#64C4FF',
  'RB': '#6692FF',
  'Kick Sauber': '#52E252',
  'Haas F1 Team': '#B6BABD'
}

export function getTeamColor(teamName) {
  return TEAM_COLORS[teamName] ?? '#8B949E'
}
