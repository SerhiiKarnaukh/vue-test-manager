export default {
  namespaced: true,

  state: () => ({
    auditLogs: [],
    auditLogsLoading: false,
    auditPagination: { page: 1, pageSize: 50, total: 0 },
    threats: [],
    threatsLoading: false,
    dashboardStats: {
      threats24h: 0,
      threats7d: 0,
      unresolvedCount: 0,
      criticalCount: 0,
      topIps: [],
      totalRequests: 0,
      blockedRequests: 0,
      threatTypeDistribution: {}
    },
    statsLoading: false,
    filters: {
      severity: null,
      threatType: null,
      isResolved: null,
      ip: '',
      dateFrom: null,
      dateTo: null
    }
  }),

  getters: {},

  mutations: {
    SET_AUDIT_LOGS(state, logs) { state.auditLogs = logs },
    SET_AUDIT_LOGS_LOADING(state, val) { state.auditLogsLoading = val },
    SET_AUDIT_PAGINATION(state, pagination) { Object.assign(state.auditPagination, pagination) },
    SET_THREATS(state, threats) { state.threats = threats },
    SET_THREATS_LOADING(state, val) { state.threatsLoading = val },
    SET_DASHBOARD_STATS(state, stats) { state.dashboardStats = stats },
    SET_STATS_LOADING(state, val) { state.statsLoading = val },
    SET_FILTERS(state, filters) { Object.assign(state.filters, filters) }
  },

  actions: {
    async fetchAuditLogs() { /* TODO: implement */ },
    async fetchThreats() { /* TODO: implement */ },
    async resolveThreat() { /* TODO: implement */ },
    async fetchDashboardStats() { /* TODO: implement */ }
  }
}
