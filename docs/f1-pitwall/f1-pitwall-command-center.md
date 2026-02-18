# F1 Pit Wall Command Center

## Complete Project Documentation

---

## 1. Product Overview

### 1.1 Vision

F1 Pit Wall Command Center is a real-time race engineering platform that recreates the operational environment of a Formula 1 pit wall — the nerve center where race engineers, strategists, and performance analysts make split-second decisions that determine race outcomes.

The system ingests live and historical telemetry data from real F1 sessions, processes it in real time, runs strategy simulations, and presents everything through a dashboard modeled after the screens F1 engineers actually use during a Grand Prix weekend.

### 1.2 Purpose

The project serves as a learning platform across three professional domains:

- **CyberSecurity** — API penetration testing, threat detection, audit logging, and WAF-like request filtering
- **DevOps** — Prometheus metrics collection, Grafana visualization, alerting, and container orchestration
- **Specialized software development** — real-time data streaming, WebSocket communication, strategy algorithms, and external API integration

### 1.3 Integration

The application is built as a standalone Django app within the existing karnetic-labs platform. It shares the same database, authentication system, Redis cache, Celery workers, and Docker Compose infrastructure — adding its own modules, API endpoints, and WebSocket channels without disrupting any existing functionality.

---

## 2. Domain Context

### 2.1 What Is the Pit Wall

The pit wall is a row of workstations positioned in front of each team's garage during a Formula 1 race. It is staffed by senior technical personnel who monitor the car, communicate with the driver, and orchestrate race strategy.

Key roles on the pit wall:

| Role | Responsibility |
|---|---|
| **Race Engineer** | Direct communication with the driver; monitors car telemetry, lap times, and tire condition |
| **Lead Strategist** | Runs thousands of simulations to decide when to pit, which tires to fit, and whether to undercut or overcut rivals |
| **Performance Engineer** | Analyzes tire degradation curves, fuel consumption, and the effect of changing track conditions |
| **Head of Track Operations** | Coordinates pit stop execution and garage activities |
| **Team Principal** | Oversees the team's overall cohesion and liaises with race control when needed |

Each person has their own configured screen layout showing real-time race data, telemetry streams, weather radar, the international broadcast feed, and proprietary team cameras.

### 2.2 What the Pit Wall Monitors

| Data Category | Examples |
|---|---|
| Car telemetry | Speed, RPM, throttle position, brake pressure, gear, DRS status — sampled at ~3.7 Hz |
| Lap timing | Sector times, lap durations, speed trap readings, personal and session bests |
| Positions and gaps | Live race positions, intervals between cars, gap to leader — updated every ~4 seconds |
| Tire data | Compound type, tire age, stint length, degradation trend |
| Pit stops | Pit lane entry/exit times, stationary duration, tire compound fitted |
| Weather | Air and track temperature, humidity, wind speed and direction, rainfall, weather radar overlay |
| Race control | Flag statuses, safety car deployments, VSC periods, penalties, incident reports |
| Team radio | Driver-to-pit communications (audio recordings) |

### 2.3 Data Source — OpenF1 API

All telemetry and session data comes from the OpenF1 API, a free and open-source service providing real-time and historical Formula 1 data starting from the 2023 season.

Historical data is available without authentication. Real-time data during live sessions requires a paid subscription.

Available endpoints:

| Endpoint | Data Provided |
|---|---|
| `/v1/car_data` | Speed, RPM, throttle, brake, DRS, gear (~3.7 Hz) |
| `/v1/laps` | Sector times, lap durations, speed trap values |
| `/v1/position` | GPS coordinates of each car on track |
| `/v1/intervals` | Time gaps between cars |
| `/v1/pit` | Pit lane timing, stop duration |
| `/v1/stints` | Tire compound and age per stint |
| `/v1/weather` | Temperature, humidity, wind, rainfall |
| `/v1/race_control` | Flags, safety car, incidents, penalties |
| `/v1/team_radio` | Audio recordings of driver communications |
| `/v1/overtakes` | Overtaking events with positions |
| `/v1/sessions` | Session metadata (FP1-3, Qualifying, Sprint, Race) |
| `/v1/meetings` | Grand Prix event information |
| `/v1/drivers` | Driver details and team affiliations |
| `/v1/championship_drivers` | Driver championship standings |
| `/v1/championship_teams` | Constructor championship standings |

---

## 3. Application Architecture

### 3.1 Integration Into karnetic-labs

The F1 Pit Wall is implemented as a new Django application registered in the existing project:

| Aspect | Detail |
|---|---|
| Django app name | `f1_pitwall` |
| Location | `portfolio/apps/f1_pitwall/` |
| URL prefix | `/f1/` |
| WebSocket prefix | `/ws/f1/` |
| Registration | Added to `INSTALLED_APPS` in settings |
| URL inclusion | Added to root `urls.py` via `include()` |

The application uses the platform's existing infrastructure: PostgreSQL for data storage, Redis for caching and as the Channels layer / Celery broker, Celery for background tasks, and Django Channels for WebSocket communication.

### 3.2 Internal Module Structure

The application is organized into the following internal modules:

| Module | Purpose |
|---|---|
| **Services** | Core business logic — telemetry processing, strategy calculations, weather analysis, race control handling, and the OpenF1 API client |
| **Security** | CyberSecurity layer — request filtering middleware, audit logging, threat detection and monitoring, API protection |
| **Monitoring** | DevOps observability — Prometheus custom metrics, health check endpoints, alerting integration |
| **Consumers** | WebSocket consumers for real-time telemetry streaming and race control event broadcasting |
| **Tasks** | Celery background tasks — session synchronization, telemetry snapshots, security analysis, data cleanup |
| **Management commands** | CLI utilities — session sync, built-in penetration test scanner |
| **Frontend** | Vue.js single-page dashboard built with Webpack, following the same pattern as the existing Core and Taberna frontends |

### 3.3 API Endpoints

| Endpoint | Protocol | Purpose |
|---|---|---|
| `/f1/` | HTTP | Main pit wall dashboard (serves the Vue.js SPA) |
| `/f1/api/sessions/` | HTTP | List of available racing sessions with filtering |
| `/f1/api/telemetry/<session>/` | HTTP | Telemetry data for a given session |
| `/f1/api/laps/<session>/` | HTTP | Lap-by-lap timing data |
| `/f1/api/strategy/<session>/` | HTTP | Strategy calculation results |
| `/f1/api/weather/<session>/` | HTTP | Weather data and forecasts |
| `/f1/api/race-control/` | HTTP | Race control messages and flags |
| `/f1/api/drivers/` | HTTP | Driver information and team details |
| `/f1/api/security/audit-log/` | HTTP | Security audit log (admin only) |
| `/f1/api/security/threats/` | HTTP | Detected threat events (admin only) |
| `/f1/api/health/` | HTTP | Application health check |
| `/f1/api/metrics/` | HTTP | Prometheus metrics endpoint |
| `/ws/f1/telemetry/<session>/` | WebSocket | Live telemetry streaming for selected drivers |
| `/ws/f1/race-control/` | WebSocket | Live race control event feed |

### 3.4 WebSocket Communication

The telemetry WebSocket channel accepts commands from the client:

| Command | Payload | Effect |
|---|---|---|
| `subscribe` | `{"action": "subscribe", "drivers": [1, 44, 63]}` | Starts streaming live telemetry for the specified driver numbers |
| `unsubscribe` | `{"action": "unsubscribe"}` | Stops the telemetry stream |
| `replay` | `{"action": "replay", "lap": 15}` | Replays telemetry data for a specific lap |

Messages sent from the server include a `type` field: `telemetry` for data points, `replay` for historical playback, and `error` for stream interruptions.

The race control WebSocket channel is broadcast-only — all connected clients receive flag changes, safety car deployments, penalties, and incident messages in real time.

---

## 4. Data Model

### 4.1 Core Racing Data

| Entity | Description | Key Fields |
|---|---|---|
| **Session** | A racing session (FP1, FP2, FP3, Qualifying, Sprint, Race) | Session key, meeting key, session type, circuit name, country, date, year |
| **Driver** | An F1 driver | Driver number, full name, acronym, team name, team color (hex), country code |
| **TelemetrySnapshot** | A single telemetry reading from a car | Session, driver, timestamp, speed, RPM, throttle, brake, gear, DRS |
| **LapData** | Timing information for one lap | Session, driver, lap number, lap duration, sector 1/2/3, speed trap, pit in/out flags |
| **PitStop** | A pit stop event | Session, driver, lap number, pit duration, timestamp |
| **Stint** | A run on one set of tires | Session, driver, stint number, compound, tire age at start, lap start, lap end |
| **WeatherData** | Track weather conditions at a point in time | Session, timestamp, air/track temperature, humidity, wind speed/direction, rainfall, pressure |
| **RaceControlMessage** | An official message from race control | Session, timestamp, category, message text, flag type, driver number, lap, sector |

### 4.2 Security Data

| Entity | Description | Key Fields |
|---|---|---|
| **APIAuditLog** | A record of every API request to the F1 module | Timestamp, user, HTTP method, path, IP address, user agent, status code, response time, request body hash, suspicious flag, threat indicators |
| **ThreatEvent** | A detected security threat | Timestamp, threat type, severity, source IP, description, sanitized request data, resolution status and notes |

### 4.3 Relationships and Indexing

- Session → TelemetrySnapshot, LapData, PitStop, Stint, WeatherData, RaceControlMessage (one-to-many)
- Driver → TelemetrySnapshot, LapData, PitStop, Stint (one-to-many)
- LapData has a unique constraint on (session, driver, lap_number)
- TelemetrySnapshot is indexed on (session, driver, timestamp) for efficient time-range queries
- APIAuditLog is indexed on (ip_address, timestamp) and (is_suspicious, timestamp)
- All entities use UUID primary keys where appropriate for external reference safety

### 4.4 Tire Compound Types

| Compound | Color | Typical Characteristics |
|---|---|---|
| Soft | Red | Fastest, highest degradation, ~15-20 lap life |
| Medium | Yellow | Balanced pace and durability, ~25-30 lap life |
| Hard | White | Slowest, lowest degradation, ~35-40 lap life |
| Intermediate | Green | Light rain / damp conditions |
| Wet | Blue | Heavy rain / standing water |

### 4.5 Race Control Flag Types

| Flag | Meaning |
|---|---|
| Green | Track clear, racing conditions |
| Yellow | Danger on track, no overtaking in the affected sector |
| Double Yellow | Serious danger, significant speed reduction required |
| Red | Session stopped |
| Blue | Faster car approaching from behind (for lapped cars) |
| Black | Driver disqualified |
| Black and White | Unsportsmanlike behavior warning |
| Chequered | Session ended |

---

## 5. Telemetry Engine

### 5.1 Overview

The Telemetry Engine is the core data pipeline of the application. It connects to the OpenF1 API, retrieves car data, processes it, stores snapshots for historical analysis, and streams live data to the frontend through WebSocket channels.

### 5.2 OpenF1 Client

The API client handles all communication with OpenF1:

| Capability | Detail |
|---|---|
| HTTP client | Asynchronous (async/await) with connection pooling |
| Connection limits | 20 max connections, 10 keepalive |
| Request timeout | 30 seconds |
| Caching | Redis-backed; 5-second TTL for live data, 1-hour TTL for historical data |
| Error handling | Automatic retry with backoff for transient failures |
| Logging | Every API call is logged with endpoint, driver, session, and data point count |

### 5.3 Data Flow

```
OpenF1 API  →  OpenF1 Client  →  Redis Cache  →  WebSocket Consumer  →  Vue.js Dashboard
                    ↓
              PostgreSQL (snapshots for historical analysis)
```

For live sessions, the WebSocket consumer polls the OpenF1 API at 1-second intervals, fetching only new data points (using timestamp-based filtering). Each data point is broadcast to all subscribed clients and optionally persisted for historical analysis.

For historical sessions, all data is fetched in bulk, cached for 1 hour, and served via REST API or WebSocket replay.

### 5.4 Background Tasks

| Task | Schedule | Purpose |
|---|---|---|
| `sync_f1_sessions` | Periodic / manual | Synchronize session metadata from OpenF1 into the local database |
| `collect_telemetry_snapshot` | During live sessions | Capture telemetry snapshots for all drivers and persist to PostgreSQL |
| `cleanup_old_telemetry` | Daily | Remove telemetry records older than 90 days to conserve disk space |

---

## 6. Strategy Engine

### 6.1 Overview

The Strategy Engine models pit stop strategies and predicts race outcomes — replicating the work of real F1 strategists who run thousands of simulations during a race to decide when to pit, which tires to fit, and how to react to competitors.

### 6.2 Tire Degradation Model

Each tire compound has a degradation profile that determines how lap times increase as tires age:

| Parameter | Description |
|---|---|
| Base lap time | The fastest possible lap time on fresh tires of this compound |
| Degradation per lap | How many seconds slower each additional lap becomes |
| Cliff lap | The lap at which degradation accelerates dramatically (3× the normal rate) |
| Optimal pit window | The ideal range of laps to pit on this compound |

Approximate degradation values used in the model:

| Compound | Degradation / lap | Cliff lap | Optimal window |
|---|---|---|---|
| Soft | +0.08s | ~18 | Laps 12–18 |
| Medium | +0.05s | ~28 | Laps 20–28 |
| Hard | +0.03s | ~40 | Laps 30–40 |
| Intermediate | +0.06s | ~25 | Laps 18–25 |
| Wet | +0.07s | ~20 | Laps 14–20 |

The predicted lap time formula accounts for the cliff:

- Before cliff: `base_lap_time + degradation_per_lap × tire_age`
- After cliff: `base_lap_time + degradation_per_lap × cliff_lap + degradation_per_lap × 3 × (tire_age - cliff_lap)`

### 6.3 Strategy Types

Given the current race state, the engine generates 2–4 strategy options:

| Strategy | Description | When Generated |
|---|---|---|
| **One-stop** | Single pit stop within the optimal tire window; second compound chosen based on remaining laps | Always (if mathematically viable) |
| **Two-stop** | Two pit stops splitting the remaining distance into roughly equal thirds | When more than 20 laps remain |
| **Undercut** | Pit immediately to gain time on fresh tires against a close rival ahead | When the gap to the car ahead is less than pit stop time loss |
| **Wet switch** | Transition to intermediate or wet tires based on weather forecast | When rain probability exceeds 50% |

### 6.4 Strategy Evaluation

Each strategy option is scored on:

| Factor | Description |
|---|---|
| Predicted total race time | Sum of all lap times plus pit stop time losses (typically ~22 seconds per stop) |
| Tire risk | Probability of exceeding the cliff and losing significant time |
| Weather risk | Probability that conditions will invalidate the dry-weather strategy |
| Undercut potential | Whether pitting early could gain a position |
| Overcut potential | Whether staying out longer could gain a position |

Strategies are sorted by predicted total time (lowest is best) and presented with human-readable notes explaining the rationale.

### 6.5 Input Parameters

The strategy engine requires:

- Current lap number
- Total race laps
- Current tire compound and tire age
- Base lap time for the circuit
- Weather forecast (rain probability and estimated time of arrival)
- Gap to car ahead and behind (for undercut/overcut calculations)

### 6.6 The 24-Hour Rule Analog

If fewer than 2 laps remain before the optimal pit window opens, the engine skips one-stop strategies and recommends immediate action — similar to how real teams compress decision-making when time is running out.

---

## 7. CyberSecurity Module

### 7.1 Overview

In real Formula 1, cybersecurity is a critical concern — teams invest heavily in protecting telemetry data, strategy models, and inter-team communications from espionage. This module recreates that security posture for the Pit Wall application.

The security layer consists of four components: an API shield (WAF-like request filtering), comprehensive audit logging, automated threat detection, and a built-in penetration testing tool.

### 7.2 API Shield (Request Filtering)

Every request to the `/f1/` URL prefix passes through the API Shield before reaching any view. The shield performs six sequential checks:

| Check | What It Detects | Severity |
|---|---|---|
| **Rate limiting** | Excessive requests from a single IP or user | Medium |
| **SQL injection** | Known SQLi patterns in query parameters and POST data (UNION, SELECT, comment sequences, tautologies) | Critical |
| **Cross-site scripting** | Script tags, javascript: URIs, event handler injections in parameters | High |
| **User agent analysis** | Known security scanner signatures (sqlmap, nikto, burp, etc.) | Medium |
| **Request size** | Payloads exceeding 1 MB | Low |
| **Parameter tampering** | IDOR attempts — a non-admin user requesting data with another user's ID | High |

Rate limits are enforced through Redis using a token-bucket approach:

| User Type | Limit |
|---|---|
| Anonymous | 30 requests per minute |
| Authenticated | 120 requests per minute |
| Telemetry endpoints | 300 requests per minute |

When a Critical or High severity threat is detected, the request is blocked with a 403 response. Medium and Low threats are logged but allowed to pass.

### 7.3 Security Middleware

The middleware wraps all requests to the F1 module and handles:

**On request:**
- Runs all API Shield checks
- Records the start time for response latency measurement
- Logs any detected threats to the audit system

**On response:**
- Adds security headers to every response:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: geolocation=(), camera=(), microphone=()`
  - `Content-Security-Policy` with restrictive directives
- Logs the complete request/response cycle to the audit table

### 7.4 Audit Logging

Every API request to the F1 module is recorded in the audit log:

| Field | Description |
|---|---|
| Timestamp | When the request was received |
| User | Authenticated user (if any) |
| HTTP method | GET, POST, PUT, DELETE, WS |
| Path | The requested URL |
| IP address | Client IP (accounting for proxy headers) |
| User agent | Browser or client identifier |
| Status code | HTTP response code |
| Response time | Processing time in milliseconds |
| Request body hash | SHA-256 hash of the request body (not the body itself, for privacy) |
| Suspicious flag | Whether any API Shield check flagged the request |
| Threat indicators | List of specific threats detected (if any) |

WebSocket connections are also logged — both connect and disconnect events.

### 7.5 Threat Monitor

The Threat Monitor is a background analysis engine that examines audit log patterns over a configurable time window (default: 1 hour) to detect coordinated attacks that individual request checks might miss.

Detection patterns:

| Pattern | Threshold | Severity |
|---|---|---|
| **Brute force** | 10+ failed auth (401/403) from a single IP per hour | Medium (50+ = High) |
| **URL scanning** | 50+ unique paths from a single IP per hour | Medium |
| **Anomalous traffic** | 500+ total requests from a single IP per hour | Low |

Each detection creates a ThreatEvent record with full context. Threats can be resolved by an admin with notes explaining the resolution.

The monitor also provides a dashboard statistics endpoint returning: threat counts (24h, 7d), unresolved and critical threat counts, top threat source IPs, total and blocked request counts, and threat type distribution.

### 7.6 Built-in Penetration Test Scanner

A Django management command that runs automated security tests against the application's own API. It is designed as a learning tool — each test teaches a specific OWASP vulnerability category.

| Test | What It Checks |
|---|---|
| SQL Injection | Sends known SQLi payloads in query parameters; verifies they are blocked |
| XSS | Sends script tags and event handlers; verifies they are not reflected in responses |
| Security Headers | Verifies all required security headers are present |
| Rate Limiting | Sends rapid sequential requests; verifies rate limiting triggers |
| Information Disclosure | Requests non-existent URLs; verifies no stack traces or debug info are exposed |
| CORS | Sends requests with a malicious Origin header; verifies it is not allowed |
| JWT Manipulation | Sends a forged JWT with `alg: none`; verifies it is rejected |
| IDOR | Requests another user's data without admin privileges; verifies access is denied |

Results are presented in a terminal-friendly format with PASS / FAIL / WARN for each test and a summary score.

---

## 8. DevOps Monitoring Stack

### 8.1 Overview

The monitoring stack adds observability to the entire platform — not just the F1 module. It uses industry-standard tools: Prometheus for metrics collection, Grafana for visualization, and AlertManager for incident notification.

### 8.2 Additional Docker Services

| Service | Image | Port | Purpose |
|---|---|---|---|
| Prometheus | `prom/prometheus` | 9090 | Time-series metrics collection and querying |
| Grafana | `grafana/grafana` | 3000 | Dashboard visualization and alerting UI |
| AlertManager | `prom/alertmanager` | 9093 | Alert routing and notification |
| Node Exporter | `prom/node-exporter` | 9100 | Host-level metrics (CPU, RAM, disk, network) |
| Redis Exporter | `oliver006/redis_exporter` | 9121 | Redis-specific metrics (connections, memory, hit rate) |

All services are added to the existing Docker Compose configuration with persistent volumes for Prometheus and Grafana data. Prometheus retains metrics for 30 days.

### 8.3 Metrics Scrape Configuration

| Target | Scrape Path | Interval |
|---|---|---|
| Django application | `/f1/api/metrics` | 15 seconds |
| Node Exporter | `:9100/metrics` | 15 seconds |
| Redis Exporter | `:9121/metrics` | 15 seconds |
| Prometheus self | `:9090/metrics` | 15 seconds |

### 8.4 Custom Application Metrics

**Telemetry metrics:**

| Metric | Type | Labels | Description |
|---|---|---|---|
| `f1_telemetry_requests_total` | Counter | endpoint, status | Total API requests to OpenF1 |
| `f1_telemetry_latency_seconds` | Histogram | endpoint | Latency of OpenF1 API calls |
| `f1_telemetry_data_points_total` | Counter | driver_number, session_key | Total telemetry data points processed |

**WebSocket metrics:**

| Metric | Type | Labels | Description |
|---|---|---|---|
| `f1_ws_connections_active` | Gauge | consumer_type | Currently active WebSocket connections |
| `f1_ws_messages_total` | Counter | consumer_type, direction | Total WebSocket messages sent/received |

**Security metrics:**

| Metric | Type | Labels | Description |
|---|---|---|---|
| `f1_security_threats_total` | Counter | threat_type, severity | Total threats detected |
| `f1_security_requests_blocked_total` | Counter | reason | Total requests blocked by API Shield |
| `f1_api_request_duration_seconds` | Histogram | method, endpoint, status | API request processing time |

**Business metrics:**

| Metric | Type | Description |
|---|---|---|
| `f1_active_sessions` | Gauge | Number of F1 sessions currently being monitored |
| `f1_strategy_calculations_total` | Counter | Total strategy calculations performed (by type) |

### 8.5 Grafana Dashboards

Three pre-provisioned dashboards are deployed automatically with Grafana:

**Dashboard 1 — Telemetry Overview:**
Real-time car speed graphs, RPM and gear visualizations, throttle-vs-brake overlays, timing tower (positions), inter-car intervals, and weather conditions. This dashboard mirrors what a race engineer sees on the pit wall.

**Dashboard 2 — API Security:**
Threat event timeline, source IP geographic distribution, rate limiting statistics, top blocked IPs, threat type distribution (pie chart), and API latency by endpoint. This dashboard is for the security team.

**Dashboard 3 — System Health:**
CPU / RAM / disk usage from Node Exporter, Redis connection count and memory usage and cache hit rate, Celery task queue depth and worker status, active WebSocket connections, Django request rate and error rate and latency percentiles, and Docker container resource usage.

### 8.6 Alerting Rules

| Alert | Condition | Severity |
|---|---|---|
| High API error rate | >5% of requests returning 5xx for 5 minutes | Critical |
| OpenF1 API unreachable | Telemetry requests failing for 2+ minutes | Warning |
| Security threat spike | >10 threats detected in 5 minutes | Critical |
| High memory usage | >85% memory utilization for 10 minutes | Warning |
| Disk space low | <10% free disk space | Critical |
| WebSocket connection spike | >100 concurrent connections | Warning |
| Celery queue backup | >50 tasks pending for 5 minutes | Warning |

Alerts are routed through AlertManager, which can be configured to send notifications via email, Slack, or webhook.

---

## 9. Frontend — Vue.js Dashboard

### 9.1 Overview

The frontend is a Vue.js single-page application built with Webpack, following the same development pattern as the existing Core and Taberna frontends in karnetic-labs. It is styled as a pit wall engineer's display: dark theme, information-dense layout, and team-color accents.

### 9.2 Components

| Component | Description |
|---|---|
| **TelemetryDashboard** | Primary screen — real-time graphs of speed, RPM, throttle, brake, gear, and DRS for selected drivers. Uses Chart.js or ECharts. |
| **TrackMap** | SVG rendering of the circuit with live car positions plotted from GPS data. Cars are color-coded by team. |
| **TimingTower** | Race position table (similar to the TV broadcast timing tower) with clickable drivers to select for telemetry. Shows position, driver name, gap, interval, last lap, tire compound, and number of stops. |
| **StrategyPanel** | Visualization of calculated strategies — stint bars, pit stop markers, tire compound colors, and risk indicators for each option. |
| **TireStrategy** | Degradation chart plotting lap time versus tire age, with the theoretical cliff marked. Overlay of actual versus predicted degradation. |
| **WeatherRadar** | Current conditions display — air and track temperature, humidity, wind speed and direction, rainfall status, and rain probability forecast. |
| **RaceControl** | Scrolling feed of race control messages — flags, safety car, penalties, and incidents, color-coded by severity. |
| **SecurityDashboard** | Threat monitor UI — active threats, audit log browser, statistics cards, and threat type distribution chart. Admin only. |
| **SystemHealth** | Embedded Grafana panels or independent charts showing Prometheus metrics — CPU, memory, API latency, WebSocket connections, Celery queue depth. |

### 9.3 Real-Time Data Flow

The dashboard connects to two WebSocket channels on load:

1. **Telemetry channel** (`/ws/f1/telemetry/<session>/`) — after connecting, the user selects drivers to track; the composable sends a `subscribe` command and begins receiving live data points, updating graphs in real time
2. **Race control channel** (`/ws/f1/race-control/`) — receives all flag changes and incident messages, displayed as a scrolling feed

Both connections implement automatic reconnection with a 3-second delay on disconnect.

### 9.4 Composables

| Composable | Purpose |
|---|---|
| `useWebSocket` | Generic WebSocket connection management — connect, send, receive, auto-reconnect, status tracking |
| `useTelemetry` | Telemetry-specific logic — driver selection, data buffering, chart data formatting |
| `useStrategy` | Strategy calculation requests and result formatting |

### 9.5 Navigation

- If the user navigates to `/f1/`, they see the main dashboard with the session selector
- Session selection loads all relevant data and establishes WebSocket connections
- The dashboard layout is modular — panels can be rearranged or toggled based on the user's role (engineer vs. strategist vs. security)

---

## 10. Celery Task Schedule

| Time (UTC) | Task | Description |
|---|---|---|
| Every 6 hours | `sync_f1_sessions` | Pull latest session metadata from OpenF1 and update the local database |
| During live sessions | `collect_telemetry_snapshot` | Capture and persist telemetry snapshots for all drivers |
| Every hour | `analyze_security_threats` | Scan audit logs for threat patterns and generate ThreatEvent records |
| 01:00 daily | `cleanup_old_telemetry` | Remove telemetry records older than 90 days |

---

## 11. Scheduled Background Tasks — Security Analysis

The `analyze_security_threats` task runs hourly and performs three detection passes:

| Pass | What It Checks | Output |
|---|---|---|
| Brute force detection | Counts 401/403 responses per IP in the analysis window | ThreatEvent with severity based on attempt count |
| URL scanning detection | Counts unique paths requested per IP, with special attention to 404 responses | ThreatEvent flagging likely directory enumeration |
| Anomalous traffic detection | Counts total requests per IP | ThreatEvent for potential DDoS or scraping activity |

All detected threats are persisted and available through both the API and the Security Dashboard.

---

## 12. Additional Infrastructure

### 12.1 Docker Compose Changes

The existing `docker-compose.yml` is extended with five new services (Prometheus, Grafana, AlertManager, Node Exporter, Redis Exporter) and two new persistent volumes (`prometheus-data`, `grafana-data`).

The existing services (app, db, redis, celery, celery-beat, flower) remain unchanged. The F1 Pit Wall module runs within the existing `app` service.

### 12.2 New Configuration Directory

A `monitoring/` directory is added at the repository root:

| Path | Purpose |
|---|---|
| `monitoring/prometheus/prometheus.yml` | Prometheus scrape configuration |
| `monitoring/grafana/provisioning/dashboards/` | Auto-provisioned Grafana dashboard JSON files |
| `monitoring/grafana/provisioning/datasources/` | Prometheus datasource configuration |
| `monitoring/alertmanager/alertmanager.yml` | Alert routing and notification configuration |

### 12.3 Environment Variables

| Variable | Description |
|---|---|
| `GRAFANA_PASSWORD` | Admin password for Grafana (default: `f1pitwall`) |
| `OPENF1_API_URL` | Base URL for OpenF1 API (default: `https://api.openf1.org/v1`) |
| `F1_SECURITY_RATE_LIMIT_ANON` | Rate limit for anonymous users (default: 30/min) |
| `F1_SECURITY_RATE_LIMIT_AUTH` | Rate limit for authenticated users (default: 120/min) |
| `F1_TELEMETRY_CACHE_TTL` | Cache TTL for live telemetry data in seconds (default: 5) |
| `F1_TELEMETRY_HISTORY_TTL` | Cache TTL for historical data in seconds (default: 3600) |
| `F1_CLEANUP_DAYS` | Days of telemetry data to retain (default: 90) |

---

## 13. Skills Development Summary

### 13.1 CyberSecurity Skills

| Skill | How It Is Practiced |
|---|---|
| WAF development | Building the API Shield from scratch — pattern matching, request analysis, blocking logic |
| SQL injection defense | Writing and testing regex-based SQLi detection patterns |
| XSS prevention | Implementing input validation, output encoding, and Content-Security-Policy |
| Rate limiting | Redis-backed token bucket implementation |
| JWT security | Testing and defending against alg:none attacks, token replay, and forged tokens |
| IDOR protection | Implementing object-level permission checks |
| Threat detection | Log analysis algorithms for brute force, scanning, and anomalous traffic |
| Security headers | Configuring CSP, HSTS, X-Frame-Options, Referrer-Policy |
| Audit logging | Comprehensive request/response logging with privacy-preserving hashing |
| Penetration testing | Writing automated security test suites using OWASP methodology |
| CORS security | Proper origin validation and preflight handling |

### 13.2 DevOps Skills

| Skill | How It Is Practiced |
|---|---|
| Prometheus | Custom metric definition, PromQL queries, scrape configuration |
| Grafana | Dashboard creation, panel types, provisioning as code, variables and templating |
| AlertManager | Alert routing, severity-based notification, silencing and inhibition |
| Container orchestration | Multi-service Docker Compose with persistent volumes, health checks, and resource limits |
| Exporters | Configuring Node Exporter and Redis Exporter; creating custom application metrics |
| Observability | Building the full metrics → dashboards → alerts pipeline |
| Health checks | Implementing readiness and liveness probes for the application |

### 13.3 Development Skills

| Skill | How It Is Practiced |
|---|---|
| Real-time systems | WebSocket communication with Django Channels, data streaming, live UI updates |
| Async Python | Using httpx and asyncio for non-blocking API calls |
| External API integration | Building a robust client with caching, retries, error handling, and rate limiting |
| Algorithm design | Tire degradation modeling, strategy simulation, race outcome prediction |
| Data streaming | Processing high-frequency telemetry data (3.7 Hz) and delivering it to clients efficiently |
| Vue.js composables | Reusable reactive logic for WebSocket, telemetry, and strategy state management |
| Celery | Background task design, periodic scheduling, and task chaining |
| Django Channels | Consumer architecture, group messaging, and async database access |

---

## 14. Development Roadmap

### Phase 1: Foundation (Weeks 1–3)

- Create the `f1_pitwall` Django app within karnetic-labs
- Define all models and run migrations
- Build the OpenF1 API client with async HTTP and Redis caching
- Implement basic REST API endpoints for sessions, drivers, and laps
- Create the Celery task for session synchronization
- Scaffold the Vue.js frontend with session selector, TimingTower, and TrackMap

### Phase 2: Real-Time Telemetry (Weeks 4–6)

- Implement the WebSocket consumer for live telemetry streaming
- Build the TelemetryDashboard Vue component with real-time charts
- Implement the race control WebSocket consumer and RaceControl component
- Build the WeatherRadar component
- Add replay mode for reviewing historical session data

### Phase 3: Strategy Engine (Weeks 7–8)

- Implement the tire degradation model
- Build the strategy calculation engine (one-stop, two-stop, undercut, wet switch)
- Create the StrategyPanel and TireStrategy Vue components
- Add the Celery task for background strategy calculations
- Implement strategy API endpoints

### Phase 4: CyberSecurity Layer (Weeks 9–12)

- Build the API Shield with all six check types
- Implement the security middleware
- Set up comprehensive audit logging
- Build the Threat Monitor with all detection patterns
- Create the SecurityDashboard Vue component
- Implement the penetration test management command
- Configure all security headers
- Write security-focused test cases

### Phase 5: DevOps Monitoring (Weeks 13–15)

- Add Prometheus, Grafana, AlertManager, Node Exporter, and Redis Exporter to Docker Compose
- Define all custom Prometheus metrics
- Configure Prometheus scrape targets
- Build and provision the three Grafana dashboards (Telemetry, Security, System Health)
- Configure alerting rules in AlertManager
- Build the SystemHealth Vue component

### Phase 6: Polish and Deploy (Weeks 16–17)

- Write comprehensive unit and integration tests
- Optimize the Dockerfile (multi-stage build)
- Update the production Docker Compose configuration
- Update the GitHub Actions CI/CD pipeline to include new services
- Deploy to AWS EC2
- Update the project README

---

## 15. Technology Additions

The following technologies are added on top of the existing karnetic-labs stack:

| Technology | Purpose | Category |
|---|---|---|
| httpx | Async HTTP client for OpenF1 API calls | Development |
| prometheus_client | Python library for exporting custom Prometheus metrics | DevOps |
| Prometheus | Time-series database and metrics collection server | DevOps |
| Grafana | Metrics visualization and dashboard platform | DevOps |
| AlertManager | Alert routing and notification system | DevOps |
| Node Exporter | Host-level system metrics (CPU, RAM, disk) | DevOps |
| Redis Exporter | Redis-specific metrics | DevOps |
| Chart.js / ECharts | Frontend charting library for telemetry graphs | Development |

Everything else — Django, DRF, Channels, Celery, Redis, PostgreSQL, Vue.js, Webpack, Docker, GitHub Actions — is already part of the existing platform.

---

## 16. Reference Links

| Resource | URL |
|---|---|
| OpenF1 API | https://openf1.org/ |
| OpenF1 Documentation | https://openf1.org/docs/ |
| OpenF1 GitHub | https://github.com/br-g/openf1 |
| FastF1 (Python package) | https://github.com/theOehrly/Fast-F1 |
| Prometheus Documentation | https://prometheus.io/docs/ |
| Grafana Documentation | https://grafana.com/docs/ |
| Django Channels | https://channels.readthedocs.io/ |
| OWASP Top 10 | https://owasp.org/www-project-top-ten/ |

---

*This document describes the complete architecture, business logic, and development plan for the F1 Pit Wall Command Center application. Version: February 2026.*
