# F1 Pit Wall Command Center — Frontend Development Plan

## Vue.js Module within the karnetic-labs Frontend Application

---

## 0. Context & Starting Point

### Existing Frontend Summary

The karnetic-labs frontend is a Vue 3.5 application using Vuetify 3.11 (Material Design), Vuex 4 (namespaced modules with vuex-persist + CryptoJS AES encryption), Pinia (newer modules), Vue Router 5, Vite 7, Axios 1.13, and Vuelidate 2. The project follows Composition API patterns, uses SCSS styling, and deploys to Firebase Hosting via GitHub Actions.

### Relevant Existing Architecture

- **Layouts:** Each sub-application has its own layout — `MainAppsManagerLayout`, `MainTabernaLayout`, `MainSocialLayout`, `MainAILabLayout`, `MainHyper3dLayout`
- **Routing:** Central `router/index.js` with per-app route groups, global `beforeEach` guard for JWT auth
- **State:** Namespaced Vuex modules (`authJWT`, `tabernaCartData`, `socialPostData`, `aiLabChatData`, etc.) + Pinia for newer modules
- **API Layer:** Axios with interceptor for JWT attachment and auto-refresh on 401
- **WebSocket:** Already used by Social Network (chat) and AI Lab (real-time chat) — provides reference implementation
- **Styling:** Vuetify theme + Sass/SCSS + Roboto + Material Design Icons + GSAP animations
- **3D:** Three.js used by Hyper 3D module

### Module URL

The F1 Pit Wall lives at `https://our-app/f1/*` as a module within the existing frontend application. All F1 routes are prefixed with `/f1`.

### What This Plan Covers

A new `f1` module within the existing Vue project: a dedicated dark-theme layout, real-time dashboard views, WebSocket-driven components, Vuex store modules for telemetry and strategy data, Chart.js visualizations, and an SVG track map — all following the established project patterns.

---

## 1. Module Structure

### 1.1 New Files & Directories

```
src/
├── layouts/
│   └── f1/
│       └── MainF1Layout.vue              # NEW — F1 pit wall dark-theme shell
│
├── components/
│   └── f1/                               # NEW — all F1-specific components
│       ├── layout/
│       │   ├── F1Header.vue                    # Top bar (session selector, live indicator, clock)
│       │   ├── F1Sidebar.vue                   # Left sidebar navigation (collapsible)
│       │   └── F1StatusBar.vue                 # Bottom status bar (connection status, data rate, session info)
│       │
│       ├── telemetry/
│       │   ├── TelemetryDashboard.vue          # Primary telemetry screen container
│       │   ├── SpeedChart.vue                  # Real-time speed vs time chart
│       │   ├── ThrottleBrakeChart.vue          # Throttle/brake overlay chart
│       │   ├── RpmGearChart.vue                # RPM with gear indicator chart
│       │   ├── DrsIndicator.vue                # DRS status badge per driver
│       │   ├── DriverSelector.vue              # Multi-select driver chips for telemetry
│       │   └── MiniTelemetryCard.vue           # Compact single-driver telemetry summary
│       │
│       ├── timing/
│       │   ├── TimingTower.vue                 # Race position table (full timing tower)
│       │   ├── TimingTowerRow.vue              # Single driver row in timing tower
│       │   └── LapTimeComparison.vue           # Lap time delta comparison panel
│       │
│       ├── track/
│       │   ├── TrackMap.vue                    # SVG circuit with live car positions
│       │   ├── CarMarker.vue                   # Single car dot on track (team-colored)
│       │   └── TrackOverlay.vue                # Sector/DRS zone overlay on track
│       │
│       ├── strategy/
│       │   ├── StrategyPanel.vue               # Strategy calculator container
│       │   ├── StrategyOption.vue              # Single strategy card (stint bars, times, risks)
│       │   ├── TireDegradationChart.vue        # Lap time vs tyre age degradation curve
│       │   ├── StintTimeline.vue               # Horizontal stint bars (compound colors)
│       │   └── StrategyInputForm.vue           # Input form for strategy calculation parameters
│       │
│       ├── weather/
│       │   ├── WeatherRadar.vue                # Weather conditions display panel
│       │   ├── WeatherTimeline.vue             # Temperature/humidity over time
│       │   └── RainForecast.vue                # Rain probability badge with ETA
│       │
│       ├── racecontrol/
│       │   ├── RaceControlFeed.vue             # Scrolling race control message list
│       │   ├── RaceControlMessage.vue          # Single message (flag-colored)
│       │   └── FlagIndicator.vue               # Current track flag status badge
│       │
│       ├── security/
│       │   ├── SecurityDashboard.vue           # Security overview panel container
│       │   ├── ThreatTimeline.vue              # Threat events timeline chart
│       │   ├── ThreatCard.vue                  # Single threat event card
│       │   ├── AuditLogTable.vue               # Paginated audit log data table
│       │   ├── SecurityStatsCards.vue          # Summary stat cards (threats, blocked, etc.)
│       │   └── ThreatTypeChart.vue             # Threat type distribution pie/donut chart
│       │
│       ├── monitoring/
│       │   ├── SystemHealth.vue                # System health overview panel
│       │   ├── MetricCard.vue                  # Single metric display card (CPU, RAM, etc.)
│       │   ├── ServiceStatus.vue               # Service connectivity status list
│       │   └── GrafanaEmbed.vue                # Iframe embed for Grafana dashboard panels
│       │
│       └── common/
│           ├── F1Loader.vue                    # Dark-themed loading spinner/skeleton
│           ├── F1EmptyState.vue                # Empty state placeholder (no data for session)
│           ├── F1ErrorState.vue                # Error state with retry button
│           ├── TeamColorDot.vue                # Small team-colored circle indicator
│           ├── CompoundBadge.vue               # Tire compound badge (S/M/H/I/W with color)
│           └── ConnectionStatus.vue            # WebSocket connection status indicator
│
├── views/
│   └── f1/                               # NEW — page-level view components
│       ├── F1DashboardView.vue                 # Main pit wall dashboard (default)
│       ├── F1TelemetryView.vue                 # Dedicated telemetry analysis page
│       ├── F1TimingView.vue                    # Full timing tower + lap comparison
│       ├── F1StrategyView.vue                  # Strategy calculator page
│       ├── F1WeatherView.vue                   # Weather monitoring page
│       ├── F1RaceControlView.vue               # Race control feed page
│       ├── F1SecurityView.vue                  # Security dashboard (admin only)
│       └── F1SystemHealthView.vue              # System health monitoring (admin only)
│
├── store/
│   └── modules/
│       └── f1Data/                        # NEW — F1 Pit Wall store modules
│           ├── index.js                        # Module registration
│           ├── sessions.js                     # Sessions & drivers state
│           ├── telemetry.js                    # Telemetry data state
│           ├── strategy.js                     # Strategy calculations state
│           ├── weather.js                      # Weather data state
│           ├── raceControl.js                  # Race control messages state
│           ├── security.js                     # Security dashboard state
│           └── websocket.js                    # WebSocket connection state
│
├── composables/
│   └── f1/                                # NEW — F1-specific composables
│       ├── useWebSocket.js                     # WebSocket connection management
│       ├── useTelemetry.js                     # Telemetry data buffering + chart formatting
│       ├── useStrategy.js                      # Strategy calculation API interaction
│       ├── useRaceControl.js                   # Race control WebSocket feed
│       ├── useSessionSelector.js               # Session selection and state
│       └── useChartTheme.js                    # Shared Chart.js dark theme configuration
│
├── router/
│   └── f1Routes.js                        # NEW — all /f1/* routes
│
├── constants/
│   └── f1.js                              # NEW — F1-specific constants
│
├── utils/
│   └── f1/
│       ├── chartConfig.js                      # Chart.js default options for dark theme
│       ├── teamColors.js                       # Team color mapping (team name → hex)
│       ├── compoundColors.js                   # Tire compound → color mapping
│       ├── flagColors.js                       # Race control flag → color mapping
│       ├── formatters.js                       # Time formatting (1:23.456), speed, gaps
│       └── trackSvg.js                         # SVG path data for supported circuits
│
└── styles/
    └── f1/
        ├── _variables.scss                     # F1 dark theme color/spacing tokens
        ├── _f1-layout.scss                     # Dark layout shell styles
        ├── _charts.scss                        # Chart container and tooltip styles
        ├── _timing-tower.scss                  # Timing tower table styles
        ├── _track-map.scss                     # SVG track map styles
        └── _pit-wall.scss                      # Dashboard grid and panel styles
```

### 1.2 Integration with Existing Project

The F1 module integrates into the existing project at the following points:

| Integration Point | Action |
|---|---|
| `src/router/index.js` | Import and merge `f1Routes.js` into the router |
| `src/store/index.js` | Register new Vuex modules under `f1Data/` namespace |
| `src/plugins/vuetify.js` | Add F1 dark theme variant |
| `src/axios-interceptor.js` | Reuse existing JWT interceptor for F1 API calls |
| `.env` / `.env.example` | Add `VITE_F1_API_BASE` and `VITE_F1_WS_BASE` variables |

### 1.3 External Libraries

| Library | Already Installed | Purpose |
|---|---|---|
| Chart.js | No — add via `npm install chart.js vue-chartjs` | Telemetry and strategy graphs |
| vue-chartjs | No — add with Chart.js | Vue 3 wrapper for Chart.js |

No other new dependencies. Vuetify, Axios, Vuex, SCSS, Material Design Icons — all already available.

---

## 2. Route Configuration

### 2.1 Route Definitions

All F1 routes are nested under the `/f1` prefix.

```
/f1                                      → redirect to /f1/dashboard
/f1/dashboard                            → F1DashboardView (main pit wall)
/f1/telemetry                            → F1TelemetryView
/f1/timing                               → F1TimingView
/f1/strategy                             → F1StrategyView
/f1/weather                              → F1WeatherView
/f1/race-control                         → F1RaceControlView
/f1/security                             → F1SecurityView (admin only)
/f1/system-health                        → F1SystemHealthView (admin only)
```

### 2.2 Layout & Route Meta

| Route Group | Layout | Meta Flags |
|---|---|---|
| All `/f1/*` routes | `MainF1Layout` | `{ auth: true, f1: true }` |
| `/f1/security`, `/f1/system-health` | `MainF1Layout` | `{ auth: true, f1: true, admin: true }` |

### 2.3 Navigation Guards

| Guard | Logic |
|---|---|
| **Authentication guard** | If route has `meta.auth: true` and no valid JWT → redirect to main login |
| **Admin guard** | If route has `meta.admin: true` and user is not staff → redirect to `/f1/dashboard` |
| **Session restore** | On entering any `/f1/*` route, attempt to restore the last selected session from `f1Data/sessions` store |

### 2.4 Default Redirect

`/f1` → redirects to `/f1/dashboard`.

---

## 3. State Management (Vuex Modules)

### 3.1 `f1Data/sessions`

Manages session list, driver list, and active session selection.

**State:**

```
{
  sessions: [],
  sessionsLoading: false,
  drivers: [],
  driversLoading: false,
  activeSession: null,         // the currently selected session object
  liveSession: null,           // auto-detected live session (if any)
  selectedYear: 2025,
  selectedSessionType: null    // null = all, 'race', 'qualifying', 'practice'
}
```

**Actions:**

| Action | API Call | Description |
|---|---|---|
| `fetchSessions` | GET `/f1/api/sessions/?year=X&type=Y` | Load sessions with filters |
| `fetchDrivers` | GET `/f1/api/drivers/` | Load all active drivers |
| `selectSession` | — (mutation) | Set active session, trigger data loading in other modules |
| `detectLiveSession` | GET `/f1/api/sessions/live/` | Check for currently live session |

**Getters:**

| Getter | Returns |
|---|---|
| `sessionsByDate` | Sessions sorted by date descending |
| `raceSessionsOnly` | Filtered to races only |
| `isLiveSession` | Boolean — active session is currently live |
| `activeSessionKey` | Session key of the active session (shortcut) |

### 3.2 `f1Data/telemetry`

Real-time telemetry data managed via WebSocket.

**State:**

```
{
  selectedDrivers: [],           // driver numbers currently being tracked [1, 44, 63]
  latestData: {},                // { driverNumber: { speed, rpm, throttle, brake, gear, drs, timestamp } }
  chartBuffers: {},              // { driverNumber: { speed: [...last 60 points], rpm: [...], ... } }
  bufferSize: 60,               // seconds of data to keep in chart buffers
  laps: {},                      // { driverNumber: [{ lap_number, lap_duration, sectors, ... }] }
  fastestLaps: {},               // { driverNumber: { lap_number, lap_duration } }
  isStreaming: false,
  replayLap: null                // lap number if in replay mode
}
```

**Actions:**

| Action | API Call / WS | Description |
|---|---|---|
| `selectDrivers` | WS send `subscribe` | Update driver selection, send subscribe command |
| `removeDriver` | WS send `subscribe` (updated list) | Remove a driver from selection |
| `clearDrivers` | WS send `unsubscribe` | Deselect all drivers, stop stream |
| `processIncomingData` | — (from WS message) | Parse telemetry message, update latestData and chartBuffers |
| `fetchLaps` | GET `/f1/api/laps/<session>/` | Load lap data for the active session |
| `fetchFastestLaps` | GET `/f1/api/laps/<session>/fastest/` | Load fastest laps per driver |
| `requestReplay` | WS send `replay` | Request historical lap data playback |

**Getters:**

| Getter | Returns |
|---|---|
| `speedChartData` | Chart.js dataset formatted for SpeedChart (one series per driver, team-colored) |
| `throttleBrakeData` | Chart.js dataset for ThrottleBrakeChart |
| `rpmChartData` | Chart.js dataset for RpmGearChart |
| `latestForDriver(n)` | Latest telemetry snapshot for driver number n |
| `isDriverSelected(n)` | Boolean — driver n is in selectedDrivers |

### 3.3 `f1Data/strategy`

Strategy calculation state.

**State:**

```
{
  strategies: [],                // list of StrategyOption objects from the API
  strategiesLoading: false,
  stints: {},                    // { driverNumber: [{ stint_number, compound, tyre_age, lap_start, lap_end }] }
  stintsLoading: false,
  calculationInput: {
    currentLap: 1,
    totalLaps: 57,
    currentCompound: 'MEDIUM',
    tyreAge: 0,
    baseLapTime: 90.0,
    rainProbability: 0,
    gapAhead: 0,
    gapBehind: 0
  }
}
```

**Actions:**

| Action | API Call | Description |
|---|---|---|
| `calculateStrategies` | POST `/f1/api/strategy/<session>/calculate/` | Submit calculation input, receive strategy options |
| `fetchStints` | GET `/f1/api/strategy/<session>/stints/` | Load current stint data for all drivers |
| `updateInput` | — (mutation) | Update a single input parameter |
| `resetInput` | — (mutation) | Reset to defaults |

**Getters:**

| Getter | Returns |
|---|---|
| `bestStrategy` | Strategy with lowest predicted total time |
| `sortedStrategies` | Strategies sorted by predicted time |
| `stintsByDriver(n)` | Stint list for a specific driver |
| `currentCompoundForDriver(n)` | Active tire compound for a driver |

### 3.4 `f1Data/weather`

Weather data state.

**State:**

```
{
  currentWeather: null,          // { air_temperature, track_temperature, humidity, wind_speed, wind_direction, rainfall }
  weatherTimeline: [],           // array of weather readings over time
  rainForecast: {
    probability: 0,
    etaLaps: null
  },
  weatherLoading: false
}
```

**Actions:**

| Action | API Call | Description |
|---|---|---|
| `fetchCurrentWeather` | GET `/f1/api/weather/<session>/current/` | Load latest reading |
| `fetchWeatherTimeline` | GET `/f1/api/weather/<session>/` | Load full timeline |
| `fetchRainForecast` | GET `/f1/api/weather/<session>/forecast/` | Load rain probability |

### 3.5 `f1Data/raceControl`

Race control messages state (WebSocket-driven).

**State:**

```
{
  messages: [],                  // all messages for the session, newest first
  currentFlag: 'GREEN',
  isSafetyCarActive: false,
  isConnected: false
}
```

**Actions:**

| Action | API Call / WS | Description |
|---|---|---|
| `fetchMessages` | GET `/f1/api/race-control/<session>/` | Load historical messages for a session |
| `processIncomingMessage` | — (from WS message) | Append new message, update currentFlag if flag-type |
| `fetchCurrentFlag` | GET `/f1/api/race-control/<session>/flags/` | Load current flag status |

**Getters:**

| Getter | Returns |
|---|---|
| `latestMessages` | Last 50 messages |
| `flagMessages` | Only flag-type messages |
| `penaltyMessages` | Only penalty-type messages |
| `flagColor` | CSS color for current flag status |

### 3.6 `f1Data/security`

Security dashboard state (admin only).

**State:**

```
{
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
}
```

**Actions:**

| Action | API Call | Description |
|---|---|---|
| `fetchAuditLogs` | GET `/f1/api/security/audit-log/?page=X&...` | Load paginated, filterable audit logs |
| `fetchThreats` | GET `/f1/api/security/threats/?...` | Load paginated threats |
| `resolveThreat` | POST `/f1/api/security/threats/<id>/resolve/` | Mark threat resolved |
| `fetchDashboardStats` | GET `/f1/api/security/dashboard/` | Load aggregated stats |

### 3.7 `f1Data/websocket`

WebSocket connection management state.

**State:**

```
{
  telemetryStatus: 'disconnected',   // 'connecting', 'connected', 'disconnected', 'error'
  raceControlStatus: 'disconnected',
  telemetryWs: null,                 // WebSocket instance reference
  raceControlWs: null,
  reconnectAttempts: 0,
  lastMessageTimestamp: null,
  dataRate: 0                        // messages per second (for status bar)
}
```

**Actions:**

| Action | Description |
|---|---|
| `connectTelemetry(sessionKey)` | Open WebSocket to `/ws/f1/telemetry/<session>/?token=<jwt>` |
| `disconnectTelemetry` | Close telemetry WebSocket |
| `connectRaceControl` | Open WebSocket to `/ws/f1/race-control/?token=<jwt>` |
| `disconnectRaceControl` | Close race control WebSocket |
| `sendTelemetryCommand(payload)` | Send JSON message to telemetry WebSocket |
| `handleReconnect(channel)` | Auto-reconnect with 3-second delay |

---

## 4. Composables

### 4.1 `useWebSocket`

Generic WebSocket connection composable used by both telemetry and race control.

**Parameters:** `url`, `options: { autoReconnect: true, reconnectDelay: 3000, maxRetries: 10 }`

**Returns:**

| Property / Method | Type | Description |
|---|---|---|
| `status` | Ref | Connection status: `connecting`, `connected`, `disconnected`, `error` |
| `data` | Ref | Last received message (parsed JSON) |
| `error` | Ref | Last error event |
| `connect()` | Function | Open WebSocket connection |
| `disconnect()` | Function | Close connection |
| `send(payload)` | Function | Send JSON payload |

**Behavior:**

- On connect: append JWT token as query parameter from `authJWT` store
- On message: JSON.parse, update `data` ref
- On close/error: if `autoReconnect` is true, schedule reconnect after `reconnectDelay`
- On max retries: set status to `error`, stop reconnecting

**Implementation note:** This composable mirrors the WebSocket handling used in the existing `SocialChatConsumer` frontend — same JWT query param authentication pattern, same auto-reconnect logic.

### 4.2 `useTelemetry`

Telemetry-specific composable built on top of `useWebSocket`.

**Returns:**

| Property / Method | Type | Description |
|---|---|---|
| `status` | Ref | WebSocket connection status |
| `subscribe(driverNumbers)` | Function | Send subscribe command with driver list |
| `unsubscribe()` | Function | Send unsubscribe command |
| `replay(lapNumber)` | Function | Send replay command |
| `latestData` | ComputedRef | Latest telemetry point per selected driver |
| `chartData` | ComputedRef | Rolling buffer formatted for Chart.js |

**Buffer management:**

- Maintains a sliding window of `bufferSize` data points per driver (default: 60 seconds × ~4 Hz = 240 points)
- Older points are dropped from the front of the array when new points arrive
- Chart data is formatted as Chart.js datasets with team colors applied
- When switching sessions, all buffers are cleared

### 4.3 `useStrategy`

Strategy calculation composable.

**Returns:**

| Property / Method | Type | Description |
|---|---|---|
| `strategies` | Ref | List of calculated strategy options |
| `isLoading` | Ref | Calculation in progress |
| `calculate(input)` | Function | POST to strategy endpoint, populate results |
| `bestStrategy` | ComputedRef | Lowest total time option |

### 4.4 `useRaceControl`

Race control WebSocket feed composable.

**Returns:**

| Property / Method | Type | Description |
|---|---|---|
| `messages` | Ref | All received messages |
| `currentFlag` | ComputedRef | Current track flag status |
| `isSafetyCar` | ComputedRef | Safety car active |

### 4.5 `useSessionSelector`

Session selection logic shared across views.

**Returns:**

| Property / Method | Type | Description |
|---|---|---|
| `sessions` | Ref | Available sessions |
| `activeSession` | Ref | Currently selected session |
| `isLive` | ComputedRef | Active session is live |
| `selectSession(session)` | Function | Set session, trigger data loading, connect WebSockets |
| `filters` | Reactive | Year, session type filters |

### 4.6 `useChartTheme`

Shared Chart.js configuration for the dark pit wall theme.

**Returns:**

| Property | Description |
|---|---|
| `defaultOptions` | Chart.js options: dark background, light grid lines, Roboto font, team-colored datasets |
| `createDataset(label, data, color)` | Factory for creating a Chart.js dataset with consistent styling |
| `speedChartOptions` | Pre-configured options for speed charts (y-axis 0–370 km/h) |
| `rpmChartOptions` | Pre-configured options for RPM charts (y-axis 0–15000) |
| `percentChartOptions` | Pre-configured options for throttle/brake (y-axis 0–100%) |

---

## 5. Layout & Shell Components

### 5.1 MainF1Layout.vue

The pit wall shell for all F1 pages. Completely different from other app layouts — dark theme, dense layout, engineering aesthetic.

**Structure:**

```
<template>
  <div class="f1-layout" :class="{ 'f1-layout--sidebar-collapsed': sidebarCollapsed }">
    <F1Header />
    <div class="f1-layout__body">
      <F1Sidebar />
      <main class="f1-layout__content">
        <router-view />
      </main>
    </div>
    <F1StatusBar />
  </div>
</template>
```

**Responsibilities:**

- Render dark-themed header, sidebar, and status bar
- Manage sidebar collapsed/expanded state
- On mount: dispatch `f1Data/sessions/fetchSessions` and `f1Data/sessions/detectLiveSession`
- On destroy: dispatch `f1Data/websocket/disconnectTelemetry` and `disconnectRaceControl`

### 5.2 F1Header.vue

**Elements:**

- F1 Pit Wall logo / title (left)
- Session selector dropdown (center) — year filter, session type filter, session list
- Live indicator: pulsing red dot + "LIVE" text when active session is live
- UTC clock display (right)

**Data source:** `f1Data/sessions` store

### 5.3 F1Sidebar.vue

**Items:**

```javascript
const sidebarItems = computed(() => {
  const items = [
    { label: 'Dashboard', route: '/f1/dashboard', icon: 'mdi-view-dashboard' },
    { label: 'Telemetry', route: '/f1/telemetry', icon: 'mdi-chart-line' },
    { label: 'Timing', route: '/f1/timing', icon: 'mdi-timer' },
    { label: 'Strategy', route: '/f1/strategy', icon: 'mdi-chess-queen' },
    { label: 'Weather', route: '/f1/weather', icon: 'mdi-weather-partly-cloudy' },
    { label: 'Race Control', route: '/f1/race-control', icon: 'mdi-flag-checkered' },
  ]
  if (store.getters['authJWT/isAdmin']) {
    items.push(
      { label: 'Security', route: '/f1/security', icon: 'mdi-shield-lock' },
      { label: 'System Health', route: '/f1/system-health', icon: 'mdi-heart-pulse' }
    )
  }
  return items
})
```

**Active state:** Neon accent border-left + lightened background on current route.

**Collapsible:** Sidebar collapses to icon-only mode. Toggle via a button or responsive breakpoint.

### 5.4 F1StatusBar.vue

Bottom bar displaying:

- WebSocket connection status (green dot = connected, red = disconnected)
- Data rate (messages/second)
- Active session name and circuit
- Last data timestamp
- Current flag status (colored dot)

---

## 6. View Implementation Details

### 6.1 F1DashboardView.vue

**Layout:** MainF1Layout

**Components:** Compact arrangement of key panels — mini TimingTower, mini TelemetryDashboard (top 3 drivers), WeatherRadar, RaceControlFeed (last 10 messages), FlagIndicator

**On mount:**

1. If no session selected → show session selector prompt
2. If session selected → dispatch data fetches for all modules, connect WebSockets
3. Auto-detect live session and prompt user to switch if available

**Grid layout:** CSS Grid with responsive panels — 3-column on desktop, 2-column on tablet, 1-column on mobile

### 6.2 F1TelemetryView.vue

**Layout:** MainF1Layout

**Components:** DriverSelector, SpeedChart, ThrottleBrakeChart, RpmGearChart, DrsIndicator, MiniTelemetryCard (per selected driver)

**On mount:** If telemetry WebSocket not connected → connect and subscribe to previously selected drivers

**Behavior:**

- DriverSelector allows selecting up to 4 drivers for comparison
- Charts update in real-time from WebSocket data via `useTelemetry` composable
- Each chart has one line per selected driver, colored by team
- Replay button opens lap number input → sends replay command

### 6.3 F1TimingView.vue

**Layout:** MainF1Layout

**Components:** TimingTower, LapTimeComparison

**On mount:** Dispatch `f1Data/telemetry/fetchLaps`

**TimingTower columns:** Position, Driver (name + team color dot), Gap (to leader), Interval (to car ahead), Last Lap, Best Lap, Compound (CompoundBadge), Stops

**Behavior:**

- Click a driver row → select that driver for telemetry tracking
- Rows animate on position change (move up/down with transition)
- Pit in/out laps highlighted with pit lane icon

### 6.4 F1StrategyView.vue

**Layout:** MainF1Layout

**Components:** StrategyInputForm, StrategyPanel (contains multiple StrategyOption cards), TireDegradationChart, StintTimeline

**Behavior:**

- StrategyInputForm: number inputs for current lap, total laps, tyre age, gaps; dropdown for current compound; display rain forecast
- "Calculate" button → dispatch `f1Data/strategy/calculateStrategies`
- Results displayed as cards: each StrategyOption shows stint bars, predicted time, risk indicators
- TireDegradationChart: plot lap time vs tyre age for each compound, with cliff line marked
- StintTimeline: horizontal bars showing each stint with compound colors for all drivers

### 6.5 F1WeatherView.vue

**Layout:** MainF1Layout

**Components:** WeatherRadar, WeatherTimeline, RainForecast

**On mount:** Dispatch `f1Data/weather/fetchCurrentWeather`, `fetchWeatherTimeline`, `fetchRainForecast`

**WeatherRadar:** Current conditions — temperature gauges (air + track), humidity bar, wind arrow with speed, rainfall indicator

**WeatherTimeline:** Chart.js line chart — temperature and humidity over time for the session

**RainForecast:** Prominent badge showing rain probability percentage and "ETA in N laps" if applicable

### 6.6 F1RaceControlView.vue

**Layout:** MainF1Layout

**Components:** RaceControlFeed (full page), FlagIndicator

**On mount:** Dispatch `f1Data/raceControl/fetchMessages`, connect race control WebSocket

**RaceControlFeed:** Scrolling list of messages — newest at top. Each message shows timestamp, category badge, message text, and affected driver (if any). Color-coded by flag type: yellow background for yellows, red for red flags, etc.

**Auto-scroll:** New messages during live sessions auto-scroll to top (with user override)

### 6.7 F1SecurityView.vue (admin only)

**Layout:** MainF1Layout

**Components:** SecurityStatsCards, ThreatTimeline, ThreatTypeChart, ThreatCard list, AuditLogTable

**On mount:** Dispatch `f1Data/security/fetchDashboardStats`, `fetchThreats`

**SecurityStatsCards:** 4 metric cards — Threats (24h), Unresolved, Requests Blocked, Total Requests

**ThreatTimeline:** Chart.js bar chart — threats per hour over the last 24 hours, colored by severity

**AuditLogTable:** Vuetify data table — timestamp, method, path, IP, status code, response time, suspicious flag. Filterable by IP, method, suspicious flag.

**Resolve action:** Click a threat → modal with details → "Resolve" button with notes field → dispatch `f1Data/security/resolveThreat`

### 6.8 F1SystemHealthView.vue (admin only)

**Layout:** MainF1Layout

**Components:** ServiceStatus, MetricCard (CPU, RAM, Disk), GrafanaEmbed

**ServiceStatus:** Green/red indicators for: Database, Redis, Celery, OpenF1 API — fetched from `/f1/api/health/`

**GrafanaEmbed:** Optional iframe embedding Grafana dashboard panels. Falls back to MetricCard display if Grafana is not accessible from the browser.

---

## 7. API Service Layer

### 7.1 F1 API Client

Extend the existing Axios instance with F1-specific methods. All F1 endpoints are prefixed with `/f1/api/`.

**`src/utils/f1/api.js`:**

Uses the same base URL (`VITE_REMOTE_HOST`) and JWT interceptor as the main app.

### 7.2 API Method Mapping

| Service Method | HTTP | Endpoint | Used By |
|---|---|---|---|
| `sessions.getAll(year, type)` | GET | `/f1/api/sessions/?year=X&type=Y` | F1Header, useSessionSelector |
| `sessions.getLive()` | GET | `/f1/api/sessions/live/` | F1Header (live detection) |
| `sessions.getById(key)` | GET | `/f1/api/sessions/<key>/` | Session detail |
| `drivers.getAll()` | GET | `/f1/api/drivers/` | DriverSelector, TimingTower |
| `telemetry.get(session, driver, range)` | GET | `/f1/api/telemetry/<session>/?driver=X` | Historical telemetry |
| `telemetry.getLatest(session)` | GET | `/f1/api/telemetry/<session>/latest/` | Initial dashboard load |
| `laps.getAll(session, driver)` | GET | `/f1/api/laps/<session>/?driver=X` | TimingTower, LapTimeComparison |
| `laps.getFastest(session)` | GET | `/f1/api/laps/<session>/fastest/` | TimingTower |
| `strategy.calculate(session, input)` | POST | `/f1/api/strategy/<session>/calculate/` | StrategyPanel |
| `strategy.getStints(session)` | GET | `/f1/api/strategy/<session>/stints/` | StintTimeline |
| `weather.getCurrent(session)` | GET | `/f1/api/weather/<session>/current/` | WeatherRadar |
| `weather.getTimeline(session)` | GET | `/f1/api/weather/<session>/` | WeatherTimeline |
| `weather.getForecast(session)` | GET | `/f1/api/weather/<session>/forecast/` | RainForecast |
| `raceControl.getMessages(session)` | GET | `/f1/api/race-control/<session>/` | RaceControlFeed |
| `raceControl.getFlags(session)` | GET | `/f1/api/race-control/<session>/flags/` | FlagIndicator |
| `security.getAuditLogs(params)` | GET | `/f1/api/security/audit-log/?...` | AuditLogTable |
| `security.getThreats(params)` | GET | `/f1/api/security/threats/?...` | ThreatTimeline |
| `security.resolveThreat(id, notes)` | POST | `/f1/api/security/threats/<id>/resolve/` | ThreatCard |
| `security.getDashboardStats()` | GET | `/f1/api/security/dashboard/` | SecurityStatsCards |
| `health.check()` | GET | `/f1/api/health/` | ServiceStatus |

---

## 8. Styling Approach

### 8.1 Design Tokens

The F1 module uses a completely different visual language from the rest of the app — dark pit wall engineering aesthetic:

| Token | Value | Usage |
|---|---|---|
| `$f1-bg-primary` | `#0D1117` | Main background (near-black) |
| `$f1-bg-secondary` | `#161B22` | Panel/card background |
| `$f1-bg-tertiary` | `#21262D` | Elevated surfaces, inputs |
| `$f1-border` | `#30363D` | Panel borders, dividers |
| `$f1-text-primary` | `#E6EDF3` | Primary text |
| `$f1-text-secondary` | `#8B949E` | Secondary/muted text |
| `$f1-accent` | `#58A6FF` | Links, active states, highlights |
| `$f1-success` | `#3FB950` | Green flag, healthy status, connected |
| `$f1-warning` | `#D29922` | Yellow flag, warning status |
| `$f1-danger` | `#F85149` | Red flag, error, disconnected |
| `$f1-sidebar-width` | `56px` (collapsed) / `200px` (expanded) | Sidebar width |
| `$f1-header-height` | `48px` | Header height |
| `$f1-statusbar-height` | `28px` | Status bar height |
| `$f1-soft` | `#FF1801` | Soft tire compound (Pirelli red) |
| `$f1-medium` | `#FFC906` | Medium compound (Pirelli yellow) |
| `$f1-hard` | `#FFFFFF` | Hard compound (Pirelli white) |
| `$f1-intermediate` | `#39B54A` | Intermediate (Pirelli green) |
| `$f1-wet` | `#00AEEF` | Wet compound (Pirelli blue) |

### 8.2 Team Color Mapping

Defined in `utils/f1/teamColors.js` — updated seasonally:

| Team | Color |
|---|---|
| Red Bull Racing | `#3671C6` |
| Ferrari | `#E80020` |
| McLaren | `#FF8000` |
| Mercedes | `#27F4D2` |
| Aston Martin | `#229971` |
| Alpine | `#FF87BC` |
| Williams | `#64C4FF` |
| RB (VCARB) | `#6692FF` |
| Kick Sauber | `#52E252` |
| Haas | `#B6BABD` |

### 8.3 Component Styling Strategy

- Dark Vuetify theme override applied within `MainF1Layout` scope
- Scoped styles in components with SCSS variables imported
- Charts: dark canvas background, light-colored grid lines, team-colored data lines
- No gradient backgrounds — flat, information-dense engineering aesthetic
- Dense spacing: small padding, compact tables, reduced font sizes where appropriate
- Monospace font (`JetBrains Mono` or `Roboto Mono`) for timing data and telemetry values

### 8.4 Responsive Considerations

- **Desktop (>1440px):** Full 3-column dashboard layout, expanded sidebar, all panels visible
- **Laptop (1024–1440px):** 2-column dashboard, sidebar collapsed to icon-only
- **Tablet (768–1024px):** 1-column layout, sidebar hidden (hamburger), panels stacked
- **Mobile (<768px):** Simplified views — TimingTower only shows top 10, charts simplified, sidebar hidden

---

## 9. Development Phases & Backend Dependencies

> **How to read this section:** Each frontend phase lists a **Backend Dependency** block specifying which backend phase/tasks must be complete before integration testing with real APIs. Frontend scaffolding and UI work can always start independently using mock data.

---

### Phase 1: Scaffolding, Layout & Sessions (Weeks 1–2)

**Goal:** Module structure, dark-theme layout, routing, session selector, driver list.

**Backend Dependency: Backend Phase 1, tasks 1–6, 9–11**

| What you need from backend | Backend Phase | Backend Task # | Endpoint |
|---|---|---|---|
| F1 app registered, database tables created | Phase 1 | #1–5 | — |
| Session list endpoint | Phase 1 | #10 | GET `/f1/api/sessions/` |
| Driver list endpoint | Phase 1 | #10 | GET `/f1/api/drivers/` |
| Sessions synced into database | Phase 1 | #12 | — (management command run) |

**Can start immediately (no backend needed):**

- Directory structure creation (task 1)
- MainF1Layout, F1Header, F1Sidebar, F1StatusBar (tasks 2–4) — mock data
- Route configuration with guards (task 5)
- Dark theme SCSS variables and global styles (task 7)
- Session selector UI (task 9) — mock session list
- F1 constants and utility files (task 10)

**Needs backend to test:**

- Session list with real data — needs backend Phase 1, task 10
- Driver list with real data — needs backend Phase 1, task 10

**Tasks:**

1. Create full directory structure for components, views, store, composables, styles, utils
2. Implement `MainF1Layout.vue` with dark-themed shell
3. Implement `F1Header.vue` with session selector dropdown and live indicator
4. Implement `F1Sidebar.vue` with navigation items and collapsed/expanded modes
5. Configure all routes in `f1Routes.js` with auth and admin guards
6. Implement `f1Data/sessions` Vuex module
7. Create all SCSS variable files and dark theme tokens
8. Implement `F1StatusBar.vue` with connection and session info
9. Build session selector in header — year filter, session type filter, session list dropdown
10. Create `constants/f1.js`, `utils/f1/teamColors.js`, `utils/f1/compoundColors.js`, `utils/f1/formatters.js`
11. Add `VITE_F1_WS_BASE` to `.env.example`, install `chart.js` and `vue-chartjs`

**Deliverables:**

- F1 module accessible at `/f1/dashboard` with dark layout shell
- Session selector showing real or mock sessions
- Navigation between all pages working
- Dark theme consistent across all shell components

---

### Phase 2: Telemetry & WebSocket (Weeks 3–5)

**Goal:** Real-time telemetry charts, WebSocket connection, driver selection.

**Backend Dependency: Backend Phase 2, tasks 1–7**

| What you need from backend | Backend Phase | Backend Task # | Endpoint |
|---|---|---|---|
| Telemetry WebSocket consumer | Phase 2 | #1 | WS `/ws/f1/telemetry/<session>/` |
| Race control WebSocket consumer | Phase 2 | #2 | WS `/ws/f1/race-control/` |
| Telemetry REST endpoints | Phase 2 | #6 | GET `/f1/api/telemetry/<session>/` |
| Lap data REST endpoints | Phase 2 | #7 | GET `/f1/api/laps/<session>/` |

**Can start immediately (no backend needed):**

- `useWebSocket` composable (task 1) — test with mock WS server or existing social chat WS
- All chart components: SpeedChart, ThrottleBrakeChart, RpmGearChart (tasks 3–5) — static mock data
- DriverSelector component (task 6) — mock driver list
- `useChartTheme` composable (task 7) — static charts
- TimingTower and TimingTowerRow (tasks 10–11) — mock lap data
- MiniTelemetryCard (task 8) — mock telemetry snapshot

**Needs backend to test:**

- WebSocket telemetry streaming — needs backend Phase 2, tasks 1–3
- Live chart updates — needs streaming data
- Race control feed — needs backend Phase 2, task 5
- Replay mode — needs backend Phase 2 (WebSocket replay command)

**Tasks:**

1. Implement `useWebSocket` composable with connect, send, reconnect, JWT auth
2. Implement `useTelemetry` composable with data buffering and Chart.js formatting
3. Build `SpeedChart.vue` — real-time speed line chart (one line per driver, team-colored)
4. Build `ThrottleBrakeChart.vue` — stacked area / overlay chart
5. Build `RpmGearChart.vue` — RPM line with gear number annotations
6. Build `DriverSelector.vue` — multi-select chips for up to 4 drivers
7. Implement `useChartTheme` composable with dark theme defaults
8. Build `MiniTelemetryCard.vue` — compact driver summary card
9. Build `DrsIndicator.vue` — DRS status badge
10. Build `TimingTower.vue` and `TimingTowerRow.vue` — full position table
11. Build `LapTimeComparison.vue` — delta comparison panel
12. Build `F1TelemetryView.vue` — assemble telemetry page
13. Build `F1TimingView.vue` — assemble timing page
14. Implement `f1Data/telemetry` and `f1Data/websocket` Vuex modules
15. Implement `f1Data/raceControl` Vuex module
16. Build `ConnectionStatus.vue` — WebSocket indicator for status bar

**Deliverables:**

- Real-time telemetry charts updating via WebSocket
- Driver selection and multi-driver comparison
- TimingTower with live positions and lap times
- Replay mode for historical laps
- Auto-reconnect on WebSocket disconnection

---

### Phase 3: Strategy & Weather (Weeks 6–7)

**Goal:** Strategy calculator, tire degradation visualization, weather display.

**Backend Dependency: Backend Phase 3, tasks 1–10**

| What you need from backend | Backend Phase | Backend Task # | Endpoint |
|---|---|---|---|
| Strategy calculation endpoint | Phase 3 | #8 | POST `/f1/api/strategy/<session>/calculate/` |
| Stint data endpoint | Phase 3 | #10 | GET `/f1/api/strategy/<session>/stints/` |
| Weather endpoints (current, timeline, forecast) | Phase 3 | #9 | GET `/f1/api/weather/<session>/*` |

**Can start immediately (no backend needed):**

- StrategyInputForm UI (task 1) — all inputs and dropdowns
- StrategyOption card layout (task 2) — mock strategy results
- TireDegradationChart (task 3) — static degradation curves
- StintTimeline (task 4) — mock stint data with compound colors
- WeatherRadar UI (task 6) — temperature gauges, wind arrow, rain indicator
- WeatherTimeline chart (task 7) — mock temperature data
- RainForecast badge (task 8) — static percentage display
- CompoundBadge component (task 5) — tire compound badges

**Needs backend to test:**

- Strategy calculations with real data — needs backend Phase 3, task 8
- Real weather data — needs backend Phase 3, task 9
- Real stint data — needs backend Phase 3, task 10

**Tasks:**

1. Build `StrategyInputForm.vue` — number inputs, compound dropdown, calculate button
2. Build `StrategyOption.vue` — strategy card with stint bars, time, risks
3. Build `TireDegradationChart.vue` — Chart.js line chart (lap time vs tyre age per compound)
4. Build `StintTimeline.vue` — horizontal bars with compound colors
5. Build `CompoundBadge.vue` — colored badge for S/M/H/I/W
6. Build `WeatherRadar.vue` — temperature, humidity, wind, rainfall display
7. Build `WeatherTimeline.vue` — Chart.js line chart for temperature/humidity over time
8. Build `RainForecast.vue` — rain probability badge with ETA
9. Build `F1StrategyView.vue` — assemble strategy page
10. Build `F1WeatherView.vue` — assemble weather page
11. Implement `f1Data/strategy` and `f1Data/weather` Vuex modules
12. Implement `useStrategy` composable

**Deliverables:**

- Strategy calculator taking inputs and displaying strategy options
- Tire degradation curves for all compounds
- Stint timeline for all drivers
- Weather display with rain forecast
- All strategy and weather data from API

---

### Phase 4: Race Control & Security (Weeks 8–9)

**Goal:** Race control feed, security dashboard, track map.

**Backend Dependency: Backend Phase 2, task 5 + Backend Phase 4, tasks 9–14**

| What you need from backend | Backend Phase | Backend Task # | Endpoint |
|---|---|---|---|
| Race control REST endpoint | Phase 2 | #5 | GET `/f1/api/race-control/<session>/` |
| Race control WebSocket (already built in Phase 2) | Phase 2 | #2 | WS `/ws/f1/race-control/` |
| Security audit log endpoint | Phase 4 | #13 | GET `/f1/api/security/audit-log/` |
| Security threats endpoint | Phase 4 | #13 | GET `/f1/api/security/threats/` |
| Threat resolve endpoint | Phase 4 | #13 | POST `/f1/api/security/threats/<id>/resolve/` |
| Security dashboard stats endpoint | Phase 4 | #13 | GET `/f1/api/security/dashboard/` |

**Can start immediately (no backend needed):**

- RaceControlFeed and RaceControlMessage UI (tasks 1–2) — mock messages
- FlagIndicator component (task 3) — static flag display
- TrackMap SVG rendering (tasks 4–5) — hardcoded car positions
- SecurityStatsCards layout (task 7) — mock stats
- AuditLogTable with Vuetify data table (task 8) — mock log entries
- ThreatCard and ThreatTimeline (tasks 9–10) — mock threat data
- ThreatTypeChart (task 11) — mock distribution

**Needs backend to test:**

- Race control with live WebSocket — needs backend Phase 2, task 2
- Security data — needs backend Phase 4, tasks 9–14
- Threat resolution — needs backend Phase 4, task 13

**Tasks:**

1. Build `RaceControlFeed.vue` — scrolling message list with auto-scroll
2. Build `RaceControlMessage.vue` — flag-colored message card
3. Build `FlagIndicator.vue` — current flag status badge
4. Build `TrackMap.vue` — SVG circuit rendering with car position dots
5. Build `CarMarker.vue` — team-colored car marker on track
6. Build `F1RaceControlView.vue` — assemble race control page
7. Build `SecurityStatsCards.vue` — 4 metric summary cards
8. Build `AuditLogTable.vue` — paginated data table with filters
9. Build `ThreatCard.vue` — threat detail card with resolve action
10. Build `ThreatTimeline.vue` — Chart.js bar chart (threats per hour)
11. Build `ThreatTypeChart.vue` — Doughnut chart for threat distribution
12. Build `SecurityDashboard.vue` — container assembling all security components
13. Build `F1SecurityView.vue` — assemble security page
14. Implement `f1Data/security` Vuex module
15. Implement `useRaceControl` composable

**Deliverables:**

- Race control feed with live WebSocket updates
- Track map with car positions
- Full security dashboard (admin only)
- Audit log browsing with filters
- Threat resolution workflow

---

### Phase 5: System Health, Dashboard & Polish (Weeks 10–11)

**Goal:** System health view, main dashboard assembly, loading/error states, responsive design.

**Backend Dependency: Backend Phase 5 complete (monitoring stack running)**

| What you need from backend | Backend Phase | Backend Task # | Endpoint |
|---|---|---|---|
| Health check endpoint | Phase 5 | #5 | GET `/f1/api/health/` |
| Prometheus metrics (for Grafana) | Phase 5 | #6 | — (Grafana accessible via browser) |
| All endpoints from Phases 1–4 operational | Phases 1–4 | All | All F1 endpoints |

**Can start immediately (no backend needed):**

- ServiceStatus component UI (task 1)
- MetricCard layout (task 2)
- GrafanaEmbed with placeholder (task 3)
- F1DashboardView layout with grid panels (task 5)
- F1Loader, F1EmptyState, F1ErrorState (tasks 7–8)
- Responsive design pass (task 11)

**Needs backend to test:**

- Health check with real data — needs backend Phase 5
- Grafana iframe — needs Grafana running and accessible
- Full dashboard integration — needs all backend phases complete

**Tasks:**

1. Build `ServiceStatus.vue` — green/red indicators for DB, Redis, Celery, OpenF1
2. Build `MetricCard.vue` — single metric display (value + label + trend)
3. Build `GrafanaEmbed.vue` — iframe wrapper with loading state and fallback
4. Build `F1SystemHealthView.vue` — assemble system health page
5. Build `F1DashboardView.vue` — assemble main dashboard with mini-panels from all modules
6. Build `F1RaceControlView.vue` integration — connect WebSocket on mount
7. Implement `F1Loader.vue` — dark skeleton loader matching panel sizes
8. Implement `F1EmptyState.vue` and `F1ErrorState.vue` with retry button
9. Add loading skeletons to all views
10. Add error states and empty states to all views
11. Responsive design pass — sidebar collapse, panel stacking, chart resizing
12. Cross-browser testing (Chrome, Firefox, Safari, Edge)
13. Performance audit: Chart.js render optimization, WebSocket message throttling, lazy route loading

**Deliverables:**

- System health page functional
- Main dashboard showing data from all modules
- All loading and error states implemented
- Responsive design working across breakpoints

---

### Phase 6: QA & Launch Preparation (Week 12)

**Goal:** Final QA, full integration testing, production deployment.

**Backend Dependency: All backend phases 1–6 complete.**

| What you need from backend | Backend Phase | Backend Task # | Detail |
|---|---|---|---|
| All endpoints operational | Phases 1–5 | All | Full API + WebSocket surface working |
| Monitoring stack deployed | Phase 5 | All | Prometheus + Grafana accessible |
| Production deployment complete | Phase 6 | All | AWS EC2 with all services running |

**Tasks:**

1. End-to-end testing: session select → telemetry stream → strategy calculate → race control → security
2. WebSocket stress testing (multiple simultaneous driver subscriptions, reconnect scenarios)
3. Chart performance testing with high-frequency data (verify no memory leaks)
4. Edge case testing: session with no data, disconnected OpenF1, expired JWT during stream
5. Cross-flow testing: switch sessions → verify all modules reload, WebSocket reconnects
6. Production environment configuration (API URLs, WebSocket URLs)
7. Update CI/CD pipeline for F1 module (linting, build verification)
8. Documentation: component catalog, store module docs, WebSocket protocol doc
9. Final code review and merge

**Deliverables:**

- Production-ready F1 Pit Wall dashboard
- All real-time flows tested and verified
- Deployment documentation complete

---

## 10. Cross-Team Parallel Development Timeline

### 10.1 Gantt-Style Overview

```
Week:        1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17   18

BACKEND:     ├─── Phase 1: Foundation ───┤├──── Phase 2: Telemetry/WS ────┤├── Phase 3: Strategy ──┤
                                                                           ├───── Phase 4: Security ──────┤
                                                                                                   ├── Phase 5: DevOps ──┤
                                                                                                                  ├── Ph6 ──┤

FRONTEND:    ├── Phase 1: Layout ──┤├───── Phase 2: Telemetry/Charts ──────┤├── Phase 3: Strategy ──┤
                                                                            ├── Phase 4: RC/Security ──┤
                                                                                          ├── Phase 5: Polish ──┤
                                                                                                         ├─ Ph6 ─┤

INTEGRATION:      ↑ Sessions        ↑ WebSocket         ↑ Strategy    ↑ Security     ↑ Full E2E
TESTING:          Week 3            Week 5               Week 8        Week 12        Week 15
POINTS:           (BE Ph1.10)       (BE Ph2.1-3)         (BE Ph3.8)    (BE Ph4.13)    (BE Ph5 done)
```

### 10.2 Integration Milestones

| Milestone | Week (approx.) | Frontend Ready | Backend Required | What Can Be Tested |
|---|---|---|---|---|
| **Sessions & Drivers** | Week 3 | FE Phase 1 complete | BE Phase 1, tasks 10–12 | Session selector with real data, driver list |
| **Live Telemetry** | Week 5 | FE Phase 2, tasks 1–9 | BE Phase 2, tasks 1–3 | WebSocket connect → subscribe → receive telemetry → charts update |
| **Timing Tower** | Week 5 | FE Phase 2, tasks 10–13 | BE Phase 2, tasks 6–7 | Lap data in timing tower, fastest laps |
| **Strategy Calculator** | Week 8 | FE Phase 3 complete | BE Phase 3, task 8 | Submit strategy input → receive options |
| **Weather Data** | Week 8 | FE Phase 3, tasks 6–8 | BE Phase 3, task 9 | Real weather in WeatherRadar |
| **Race Control Feed** | Week 9 | FE Phase 4, tasks 1–6 | BE Phase 2, task 5 | WebSocket race control messages |
| **Security Dashboard** | Week 12 | FE Phase 4, tasks 7–14 | BE Phase 4, tasks 13–14 | Audit logs, threats, resolve |
| **System Health** | Week 14 | FE Phase 5, tasks 1–4 | BE Phase 5, tasks 5–6 | Health check, Grafana embeds |
| **Full Integration** | Week 15 | FE Phase 5 complete | BE Phases 1–5 complete | All flows end-to-end |
| **Production Ready** | Week 17–18 | FE Phase 6 complete | BE Phase 6 complete | Production deployment, full QA |

### 10.3 Critical Path

The **longest dependency chain** is the telemetry WebSocket:

```
BE Phase 1 (models, OpenF1 client) → BE Phase 2 (WebSocket consumers) → FE Phase 2 (chart integration with live data)
```

The **earliest** the live telemetry can be tested end-to-end is approximately **week 5** (backend Phase 2 delivers WebSocket consumers around backend week 5, frontend charts are ready from frontend week 3).

**Mitigation strategies:**

1. **Mock WebSocket server.** During frontend weeks 3–4, create a simple Node.js script that simulates the telemetry WebSocket — sends random telemetry data at 1 Hz. This allows full chart integration testing without the backend.

2. **Static fixture data.** Record one real OpenF1 API response for Bahrain 2024 Race and use it as a JSON fixture for chart rendering tests.

3. **Prioritize backend Phase 2, tasks 1–3.** The WebSocket consumer is the most critical backend deliverable for frontend velocity.

### 10.4 Recommended Backend Task Prioritization for Frontend Unblocking

| Priority | Endpoint | Backend Phase/Task | Unblocks |
|---|---|---|---|
| 1 | GET `/f1/api/sessions/`, GET `/f1/api/drivers/` | Phase 1, #10 | FE session selector and driver list |
| 2 | WS `/ws/f1/telemetry/<session>/` | Phase 2, #1 | FE live telemetry charts |
| 3 | GET `/f1/api/laps/<session>/` | Phase 2, #7 | FE timing tower |
| 4 | WS `/ws/f1/race-control/` | Phase 2, #2 | FE race control feed |
| 5 | POST `/f1/api/strategy/<session>/calculate/` | Phase 3, #8 | FE strategy calculator |
| 6 | GET `/f1/api/weather/<session>/current/` | Phase 3, #9 | FE weather display |
| 7 | GET `/f1/api/security/audit-log/`, `/threats/`, `/dashboard/` | Phase 4, #13 | FE security dashboard |
| 8 | GET `/f1/api/health/` | Phase 5, #5 | FE system health page |

---

## 11. Key Technical Decisions

| Decision | Options | Recommendation |
|---|---|---|
| Chart library | (a) Chart.js (b) ECharts (c) D3.js (d) Plotly | **(a) Chart.js** via `vue-chartjs` — lightweight, sufficient for telemetry line charts, large community, easy dark theming |
| WebSocket composable | (a) Standalone composable (b) Vuex actions only (c) Library (vue-native-websocket) | **(a) Composable** — `useWebSocket` provides reactive refs, Vuex for persistent state. More flexible than library. |
| State management | (a) Vuex only (b) Pinia only (c) Mix | **(a) Vuex** — consistent with existing app modules (authJWT, tabernaData, etc.). Pinia possible for new-only modules but Vuex avoids mixing patterns. |
| Telemetry buffering | (a) All data in Vuex (b) Composable-local buffer, summary in Vuex | **(b) Composable-local** — high-frequency data (4 Hz) should not transit Vuex reactivity. Keep rolling buffer in composable, push summaries to Vuex. |
| Track map rendering | (a) SVG with manual path data (b) Canvas with D3 (c) Leaflet/map | **(a) SVG** — circuits are static shapes, car markers are simple dots. SVG is the lightest approach, no extra dependency. |
| Dark theme scope | (a) Global dark mode toggle (b) Scoped to F1 layout only | **(b) Scoped** — F1 module has its own dark theme; other modules keep their existing light themes. Applied via CSS class on MainF1Layout root element. |
| Grafana integration | (a) Iframe embed (b) Grafana API + custom charts (c) Skip, custom only | **(a) Iframe** as primary with **(c) custom fallback** — simplest integration. If Grafana is not browser-accessible, fall back to MetricCard with health check data. |
| Chart update frequency | (a) Every WS message (~4 Hz) (b) Throttled to 1 Hz (c) requestAnimationFrame | **(b) Throttled to 1 Hz** — Chart.js re-render at 4 Hz is too expensive. Buffer 4 messages, render once per second. |

---

## 12. Risk Mitigation

| Risk | Mitigation |
|---|---|
| Chart.js performance with high-frequency data | Throttle chart updates to 1 Hz. Use `animation: false` option. Limit chart buffer to 60 seconds. Destroy and recreate charts on session switch. |
| WebSocket disconnection during live session | Auto-reconnect with 3-second delay via `useWebSocket`. Visual indicator in status bar. Cached data remains visible during reconnection. |
| Memory leaks from long telemetry sessions | Fixed-size rolling buffers (240 points per driver). Clear all buffers on session switch. Disconnect WebSocket on route leave. |
| SVG track map rendering for unknown circuits | Start with 3–5 most popular circuits (Bahrain, Monza, Silverstone, Spa, Monaco). Show a generic oval for unsupported circuits. Community SVG sources available. |
| Dark theme conflicts with Vuetify global theme | F1 dark theme scoped to `.f1-layout` CSS class, not global. Vuetify dark theme variant applied only within F1 routes via layout component. |
| OpenF1 API returning unexpected data format | Defensive parsing in all services — fallback to null/empty for missing fields. Log warnings for unexpected shapes. Static fixtures for testing. |
| Multiple drivers overwhelming chart readability | Limit driver selection to 4 maximum. Each driver gets a unique team color. Provide "solo" mode to view one driver at a time. |

---

*Frontend Development Plan for the F1 Pit Wall Command Center. Based on existing karnetic-labs frontend architecture, F1 project specification, and backend API plan. February 2026.*
