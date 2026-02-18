// F1 Pit Wall — Application Constants

export const SESSION_TYPES = {
  PRACTICE: 'practice',
  QUALIFYING: 'qualifying',
  SPRINT: 'sprint',
  RACE: 'race'
}

export const TIRE_COMPOUNDS = ['SOFT', 'MEDIUM', 'HARD', 'INTERMEDIATE', 'WET']

export const FLAG_TYPES = [
  'GREEN', 'YELLOW', 'DOUBLE_YELLOW', 'RED',
  'BLUE', 'BLACK', 'BLACK_WHITE', 'CHEQUERED'
]

export const THREAT_SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

export const THREAT_TYPES = [
  'BRUTE_FORCE', 'SQL_INJECTION', 'XSS', 'RATE_LIMIT',
  'INVALID_TOKEN', 'SUSPICIOUS_PATTERN', 'DATA_EXFIL', 'PARAMETER_TAMPERING'
]

export const WS_STATUS = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error'
}

export const WS_RECONNECT_DELAY = 3000
export const WS_MAX_RETRIES = 10
export const TELEMETRY_BUFFER_SIZE = 60
export const MAX_SELECTED_DRIVERS = 4
export const CHART_UPDATE_INTERVAL = 1000

export const DRS_STATUS = {
  OFF: [0, 1, 2, 3],
  ELIGIBLE: [8],
  ACTIVE: [10, 11, 12, 13, 14]
}

export const PIT_STOP_TIME_LOSS = 22

export const API_ENDPOINTS = {
  SESSIONS: '/f1/api/sessions/',
  DRIVERS: '/f1/api/drivers/',
  TELEMETRY: '/f1/api/telemetry/',
  LAPS: '/f1/api/laps/',
  STRATEGY: '/f1/api/strategy/',
  WEATHER: '/f1/api/weather/',
  RACE_CONTROL: '/f1/api/race-control/',
  SECURITY_AUDIT: '/f1/api/security/audit-log/',
  SECURITY_THREATS: '/f1/api/security/threats/',
  SECURITY_DASHBOARD: '/f1/api/security/dashboard/',
  HEALTH: '/f1/api/health/'
}

export const WS_ENDPOINTS = {
  TELEMETRY: '/ws/f1/telemetry/',
  RACE_CONTROL: '/ws/f1/race-control/'
}
