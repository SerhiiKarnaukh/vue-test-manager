const F1DashboardView = () => import('@/views/f1/F1DashboardView.vue')
const F1TelemetryView = () => import('@/views/f1/F1TelemetryView.vue')
const F1TimingView = () => import('@/views/f1/F1TimingView.vue')
const F1StrategyView = () => import('@/views/f1/F1StrategyView.vue')
const F1WeatherView = () => import('@/views/f1/F1WeatherView.vue')
const F1RaceControlView = () => import('@/views/f1/F1RaceControlView.vue')
const F1SecurityView = () => import('@/views/f1/F1SecurityView.vue')
const F1SystemHealthView = () => import('@/views/f1/F1SystemHealthView.vue')

const f1Routes = [
  {
    path: '/f1',
    redirect: '/f1/dashboard'
  },
  {
    path: '/f1/dashboard',
    name: 'F1Dashboard',
    component: F1DashboardView,
    meta: { layout: 'mainF1', authJWT: true }
  },
  {
    path: '/f1/telemetry',
    name: 'F1Telemetry',
    component: F1TelemetryView,
    meta: { layout: 'mainF1', authJWT: true }
  },
  {
    path: '/f1/timing',
    name: 'F1Timing',
    component: F1TimingView,
    meta: { layout: 'mainF1', authJWT: true }
  },
  {
    path: '/f1/strategy',
    name: 'F1Strategy',
    component: F1StrategyView,
    meta: { layout: 'mainF1', authJWT: true }
  },
  {
    path: '/f1/weather',
    name: 'F1Weather',
    component: F1WeatherView,
    meta: { layout: 'mainF1', authJWT: true }
  },
  {
    path: '/f1/race-control',
    name: 'F1RaceControl',
    component: F1RaceControlView,
    meta: { layout: 'mainF1', authJWT: true }
  },
  {
    path: '/f1/security',
    name: 'F1Security',
    component: F1SecurityView,
    meta: { layout: 'mainF1', authJWT: true, admin: true }
  },
  {
    path: '/f1/system-health',
    name: 'F1SystemHealth',
    component: F1SystemHealthView,
    meta: { layout: 'mainF1', authJWT: true, admin: true }
  }
]

export default f1Routes
