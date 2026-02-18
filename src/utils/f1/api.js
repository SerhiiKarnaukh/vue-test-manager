import axios from 'axios'

const BASE = '/f1/api'

export const sessions = {
  getAll: (year, type) => axios.get(`${BASE}/sessions/`, { params: { year, type } }),
  getLive: () => axios.get(`${BASE}/sessions/live/`),
  getById: (key) => axios.get(`${BASE}/sessions/${key}/`)
}

export const drivers = {
  getAll: () => axios.get(`${BASE}/drivers/`),
  getById: (driverNumber) => axios.get(`${BASE}/drivers/${driverNumber}/`)
}

export const telemetry = {
  get: (session, driver, range) => axios.get(`${BASE}/telemetry/${session}/`, { params: { driver, ...range } }),
  getLatest: (session) => axios.get(`${BASE}/telemetry/${session}/latest/`)
}

export const laps = {
  getAll: (session, driver) => axios.get(`${BASE}/laps/${session}/`, { params: { driver } }),
  getFastest: (session) => axios.get(`${BASE}/laps/${session}/fastest/`)
}

export const strategy = {
  calculate: (session, input) => axios.post(`${BASE}/strategy/${session}/calculate/`, input),
  getStints: (session) => axios.get(`${BASE}/strategy/${session}/stints/`)
}

export const weather = {
  getCurrent: (session) => axios.get(`${BASE}/weather/${session}/current/`),
  getTimeline: (session) => axios.get(`${BASE}/weather/${session}/`),
  getForecast: (session) => axios.get(`${BASE}/weather/${session}/forecast/`)
}

export const raceControl = {
  getMessages: (session) => axios.get(`${BASE}/race-control/${session}/`),
  getFlags: (session) => axios.get(`${BASE}/race-control/${session}/flags/`)
}

export const security = {
  getAuditLogs: (params) => axios.get(`${BASE}/security/audit-log/`, { params }),
  getThreats: (params) => axios.get(`${BASE}/security/threats/`, { params }),
  resolveThreat: (id, notes) => axios.post(`${BASE}/security/threats/${id}/resolve/`, { resolution_notes: notes }),
  getDashboardStats: () => axios.get(`${BASE}/security/dashboard/`)
}

export const health = {
  check: () => axios.get(`${BASE}/health/`)
}
