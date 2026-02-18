# F1 Pit Wall Command Center — Backend Development Plan

## Django Application within the karnetic-labs Platform

---

## 0. Context & Starting Point

### Existing Platform Summary

The karnetic-labs backend is a Django 6.0.1 / DRF 3.16.1 project on Python 3.12 with PostgreSQL 17, Redis 7.4.2, Celery 5.6.2 + Beat, Django Channels 4.3.2, Simple JWT + Djoser auth, Docker Compose deployment on AWS. The project is organized into apps: `core`, `accounts`, `taberna_product`, `taberna_cart`, `taberna_orders`, `taberna_profiles`, `social_profiles`, `social_posts`, `social_chat`, `social_notification`, `ai_lab`, `donation`.

### Relevant Existing Infrastructure

- JWT auth (Simple JWT 5.5.1 + Djoser 2.3.3) with email-based user model
- Django Channels 4.3.2 with Channels-Redis for WebSocket support (already used by `social_chat` and `social_notification`)
- Celery Beat scheduled tasks (daily cleanup of AI media, carts, trends, friend suggestions)
- Redis 7.4.2 for caching, Channels layer, and Celery broker
- ASGI via Uvicorn 0.40.0 (WebSocket support already configured)
- Webpack-based frontend builds (used by `core` and `taberna_product`)
- Nginx reverse proxy with WebSocket proxying (`/ws/`, `/wss/`)
- GitHub Actions CI/CD pipeline
- Makefile-based deployment automation

### Relevant Existing Patterns

- **WebSocket consumers:** `SocialChatConsumer` and `NotificationConsumer` provide a reference implementation for the new telemetry and race control consumers
- **Celery tasks:** Existing scheduled tasks in `celery.py` provide the pattern for adding new periodic tasks
- **Frontend build:** The `_dev/` directory pattern in `core` and `taberna_product` provides the template for the new Vue.js frontend module
- **ASGI routing:** `asgi.py` already includes WebSocket routing — new consumers will be added to the existing router

### What This Plan Covers

A new Django app `f1_pitwall` that implements the complete F1 Pit Wall Command Center as defined in the project specification. The app handles real-time telemetry ingestion from OpenF1 API, strategy calculation, security monitoring, and DevOps observability — all served through DRF endpoints, WebSocket channels, and a Vue.js dashboard.

---

## 1. Application Structure

### 1.1 New Django App

Create `portfolio/apps/f1_pitwall/` with the following structure:

```
f1_pitwall/
├── migrations/
├── admin.py
├── apps.py
├── models/
│   ├── __init__.py
│   ├── session.py
│   ├── driver.py
│   ├── telemetry.py
│   ├── lap.py
│   ├── pit_stop.py
│   ├── stint.py
│   ├── weather.py
│   ├── race_control.py
│   └── security.py
├── serializers/
│   ├── __init__.py
│   ├── session.py
│   ├── driver.py
│   ├── telemetry.py
│   ├── strategy.py
│   ├── weather.py
│   ├── race_control.py
│   └── security.py
├── views/
│   ├── __init__.py
│   ├── session.py
│   ├── telemetry.py
│   ├── laps.py
│   ├── strategy.py
│   ├── weather.py
│   ├── race_control.py
│   ├── drivers.py
│   ├── security.py
│   ├── health.py
│   └── metrics.py
├── services/
│   ├── __init__.py
│   ├── openf1_client.py
│   ├── telemetry_engine.py
│   ├── strategy_engine.py
│   ├── weather_service.py
│   ├── race_control_service.py
│   └── session_sync.py
├── security/
│   ├── __init__.py
│   ├── api_shield.py
│   ├── middleware.py
│   ├── audit.py
│   ├── threat_monitor.py
│   └── pentest_patterns.py
├── monitoring/
│   ├── __init__.py
│   ├── metrics.py
│   ├── health.py
│   └── alerts.py
├── consumers/
│   ├── __init__.py
│   ├── telemetry.py
│   └── race_control.py
├── tasks/
│   ├── __init__.py
│   ├── sync_sessions.py
│   ├── collect_telemetry.py
│   ├── analyze_threats.py
│   └── cleanup.py
├── management/
│   └── commands/
│       ├── sync_f1_sessions.py
│       └── run_pentest.py
├── permissions.py
├── validators.py
├── routing.py
├── urls.py
├── constants.py
├── exceptions.py
└── tests/
    ├── __init__.py
    ├── test_openf1_client.py
    ├── test_telemetry_engine.py
    ├── test_strategy_engine.py
    ├── test_api_shield.py
    ├── test_threat_monitor.py
    ├── test_consumers.py
    ├── test_session_sync.py
    ├── test_metrics.py
    └── test_security_middleware.py
```

### 1.2 Integration with Existing Apps

The f1_pitwall app will **import from** but **not modify** existing apps:

- Read `Account` model for user authentication in security audit logs
- Reuse existing JWT auth for all API endpoints
- Reuse existing Django Channels ASGI routing (add new WebSocket paths)
- Reuse existing Redis instance for caching, Channels layer, and rate limiting
- Reuse existing Celery worker and Beat scheduler (add new tasks)
- Follow the same Webpack `_dev/` pattern for the Vue.js frontend build

### 1.3 External Dependencies to Add

| Package | Version | Purpose |
|---|---|---|
| `httpx` | ≥0.27 | Async HTTP client for OpenF1 API |
| `prometheus_client` | ≥0.21 | Custom Prometheus metrics export |

Both are added to `requirements.txt`. No changes to existing dependencies.

---

## 2. Data Model Design

### 2.1 Session

Stores F1 racing sessions synchronized from OpenF1 API. Reference data — updated periodically.

**Fields:**

- `id` (UUID primary key)
- `session_key` (IntegerField, unique, db_index — OpenF1's session identifier)
- `meeting_key` (IntegerField, db_index — OpenF1's Grand Prix identifier)
- `session_name` (CharField, max_length=50 — "Race", "Qualifying", "Practice 1", etc.)
- `session_type` (CharField choices: `practice`, `qualifying`, `sprint`, `race`)
- `circuit_name` (CharField, max_length=100)
- `circuit_short_name` (CharField, max_length=20)
- `country_name` (CharField, max_length=100)
- `country_code` (CharField, max_length=3 — ISO 3166-1 alpha-3)
- `date_start` (DateTimeField)
- `date_end` (DateTimeField, nullable)
- `year` (IntegerField, db_index)
- `is_live` (BooleanField, default=False — currently in progress)
- `created_at` / `updated_at` (DateTimeField)

**Constraints:**

- Unique on `session_key`
- Index on `year` for filtering
- Index on `date_start` for ordering
- Default ordering: `['-date_start']`

**Notes:**

- Sessions are populated via the `sync_f1_sessions` Celery task or `sync_f1_sessions` management command
- The `is_live` flag is managed by the telemetry engine when a session is actively streaming data
- Historical data available from 2023 onwards (OpenF1 API limitation)

### 2.2 Driver

Stores F1 driver information. Reference data — updated when session data is synced.

**Fields:**

- `id` (UUID primary key)
- `driver_number` (IntegerField, unique — the car number, e.g., 1 for Verstappen, 44 for Hamilton)
- `full_name` (CharField, max_length=100)
- `name_acronym` (CharField, max_length=3 — "VER", "HAM", "NOR", etc.)
- `team_name` (CharField, max_length=100)
- `team_colour` (CharField, max_length=7 — hex color, e.g., "#3671C6" for Red Bull)
- `headshot_url` (URLField, blank=True)
- `country_code` (CharField, max_length=3, blank=True)
- `is_active` (BooleanField, default=True — currently competing in the championship)
- `created_at` / `updated_at` (DateTimeField)

**Notes:**

- Driver numbers are stable within a season but can change between seasons
- Team affiliations can change during transfer windows
- The `is_active` flag is used to filter the driver list for the current season

### 2.3 TelemetrySnapshot

A single telemetry reading from a car. High-volume data — indexed for time-range queries.

**Fields:**

- `id` (UUID primary key)
- `session` (ForeignKey → Session, on_delete=CASCADE, related_name='telemetry')
- `driver` (ForeignKey → Driver, on_delete=CASCADE, related_name='telemetry')
- `timestamp` (DateTimeField, db_index)
- `speed` (IntegerField — km/h, range 0–370)
- `rpm` (IntegerField — engine revolutions per minute, range 0–15000)
- `throttle` (IntegerField — 0–100 percentage)
- `brake` (IntegerField — 0–100 percentage)
- `gear` (IntegerField — 0 for neutral, 1–8)
- `drs` (IntegerField — DRS status code from OpenF1)
- `created_at` (DateTimeField, auto_now_add=True)

**Constraints:**

- Compound index on `(session, driver, timestamp)` for efficient range queries
- This is the highest-volume table — expect ~200 data points per driver per lap (3.7 Hz × ~55 seconds per lap)
- Cleanup task removes records older than 90 days

**Notes:**

- Data arrives at ~3.7 Hz from OpenF1 — approximately 4 readings per second per driver
- For a race with 20 drivers and 57 laps, this is approximately 200 × 20 × 57 = ~228,000 rows per session
- The `drs` field uses OpenF1 encoding: 0–3 = off, 8 = eligible, 10–14 = active

### 2.4 LapData

Timing data for a single lap by a single driver. One row per driver per lap.

**Fields:**

- `id` (UUID primary key)
- `session` (ForeignKey → Session, on_delete=CASCADE, related_name='laps')
- `driver` (ForeignKey → Driver, on_delete=CASCADE, related_name='laps')
- `lap_number` (IntegerField)
- `lap_duration` (FloatField, nullable — total lap time in seconds, null for incomplete laps)
- `sector_1` (FloatField, nullable — sector 1 time in seconds)
- `sector_2` (FloatField, nullable — sector 2 time in seconds)
- `sector_3` (FloatField, nullable — sector 3 time in seconds)
- `speed_trap` (FloatField, nullable — speed at the speed trap in km/h)
- `is_pit_out_lap` (BooleanField, default=False)
- `is_pit_in_lap` (BooleanField, default=False)
- `is_personal_best` (BooleanField, default=False)
- `created_at` (DateTimeField, auto_now_add=True)

**Constraints:**

- Unique together on `(session, driver, lap_number)`
- Default ordering: `['lap_number']`

**Notes:**

- Pit out laps and pit in laps have abnormally long times and are excluded from pace analysis
- `is_personal_best` is calculated locally by comparing against all previous laps for that driver in the session

### 2.5 PitStop

Records each time a driver enters the pit lane.

**Fields:**

- `id` (UUID primary key)
- `session` (ForeignKey → Session, on_delete=CASCADE, related_name='pit_stops')
- `driver` (ForeignKey → Driver, on_delete=CASCADE, related_name='pit_stops')
- `lap_number` (IntegerField — the lap on which the pit stop occurred)
- `pit_duration` (FloatField — time stationary in pit box, seconds)
- `timestamp` (DateTimeField)
- `created_at` (DateTimeField, auto_now_add=True)

**Constraints:**

- Default ordering: `['timestamp']`

### 2.6 Stint

A continuous run on one set of tires between pit stops.

**Fields:**

- `id` (UUID primary key)
- `session` (ForeignKey → Session, on_delete=CASCADE, related_name='stints')
- `driver` (ForeignKey → Driver, on_delete=CASCADE, related_name='stints')
- `stint_number` (IntegerField — 1 for first stint, 2 after first pit, etc.)
- `compound` (CharField choices: `SOFT`, `MEDIUM`, `HARD`, `INTERMEDIATE`, `WET`)
- `tyre_age_at_start` (IntegerField, default=0 — non-zero if starting on used tires)
- `lap_start` (IntegerField)
- `lap_end` (IntegerField, nullable — null if stint is in progress)
- `created_at` (DateTimeField, auto_now_add=True)

**Constraints:**

- Default ordering: `['stint_number']`

### 2.7 WeatherData

Track weather conditions recorded at intervals during a session.

**Fields:**

- `id` (UUID primary key)
- `session` (ForeignKey → Session, on_delete=CASCADE, related_name='weather')
- `timestamp` (DateTimeField)
- `air_temperature` (FloatField — degrees Celsius)
- `track_temperature` (FloatField — degrees Celsius)
- `humidity` (FloatField — percentage, 0–100)
- `wind_speed` (FloatField — meters per second)
- `wind_direction` (IntegerField — degrees, 0–360)
- `rainfall` (BooleanField, default=False)
- `pressure` (FloatField, nullable — atmospheric pressure in millibars)
- `created_at` (DateTimeField, auto_now_add=True)

**Constraints:**

- Default ordering: `['timestamp']`

### 2.8 RaceControlMessage

Official messages from the FIA race director during a session.

**Fields:**

- `id` (UUID primary key)
- `session` (ForeignKey → Session, on_delete=CASCADE, related_name='rc_messages')
- `timestamp` (DateTimeField)
- `category` (CharField, max_length=50 — "Flag", "SafetyCar", "Penalty", etc.)
- `message` (TextField — full message text)
- `flag` (CharField, max_length=20, choices: `GREEN`, `YELLOW`, `DOUBLE_YELLOW`, `RED`, `BLUE`, `BLACK`, `BLACK_WHITE`, `CHEQUERED`, blank=True)
- `driver_number` (IntegerField, nullable — the driver the message concerns, if any)
- `lap_number` (IntegerField, nullable)
- `sector` (IntegerField, nullable — 1, 2, or 3)
- `created_at` (DateTimeField, auto_now_add=True)

**Constraints:**

- Default ordering: `['timestamp']`

### 2.9 APIAuditLog

Records every API request to the F1 module for security auditing.

**Fields:**

- `id` (UUID primary key)
- `timestamp` (DateTimeField, auto_now_add=True, db_index)
- `user` (ForeignKey → Account, on_delete=SET_NULL, nullable — null for anonymous requests)
- `method` (CharField, max_length=10 — "GET", "POST", "WS", etc.)
- `path` (CharField, max_length=500)
- `ip_address` (GenericIPAddressField)
- `user_agent` (TextField, blank=True)
- `status_code` (IntegerField)
- `response_time_ms` (FloatField)
- `request_body_hash` (CharField, max_length=64, blank=True — SHA-256 hash, not the actual body)
- `is_suspicious` (BooleanField, default=False, db_index)
- `threat_indicators` (JSONField, default=list, blank=True)

**Constraints:**

- Index on `(ip_address, timestamp)` for threat detection queries
- Index on `(is_suspicious, timestamp)` for security dashboard filtering
- Default ordering: `['-timestamp']`

**Notes:**

- Request body is hashed, not stored, for privacy
- The `threat_indicators` field is a list of strings identifying which API Shield checks flagged the request (e.g., `["SQL_INJECTION", "SUSPICIOUS_UA"]`)

### 2.10 ThreatEvent

A detected security threat, created by the Threat Monitor analysis task.

**Fields:**

- `id` (UUID primary key)
- `timestamp` (DateTimeField, auto_now_add=True, db_index)
- `threat_type` (CharField, max_length=30, choices: `BRUTE_FORCE`, `SQL_INJECTION`, `XSS`, `RATE_LIMIT`, `INVALID_TOKEN`, `SUSPICIOUS_PATTERN`, `DATA_EXFIL`, `PARAMETER_TAMPERING`)
- `severity` (CharField, max_length=10, choices: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
- `source_ip` (GenericIPAddressField)
- `description` (TextField)
- `raw_request` (JSONField — sanitized request data, no sensitive information)
- `is_resolved` (BooleanField, default=False)
- `resolved_at` (DateTimeField, nullable)
- `resolution_notes` (TextField, blank=True)

**Constraints:**

- Default ordering: `['-timestamp']`

---

## 3. Service Layer Design

All business logic lives in the `services/` and `security/` directories. Views are thin — they validate input, call a service, and return a response.

### 3.1 OpenF1Client (`openf1_client.py`)

The core HTTP client for all communication with the OpenF1 API.

**Responsibilities:**

- Make async HTTP requests to all OpenF1 endpoints
- Manage connection pooling (20 max connections, 10 keepalive)
- Implement Redis-based caching (5s TTL for live data, 3600s for historical)
- Handle timeouts (30 seconds), retries (3 attempts with exponential backoff), and rate limiting
- Log every API call with endpoint, driver, session, and result count
- Provide a clean async interface for all other services to consume

**Key methods:**

- `get_car_data(session_key, driver_number, date_gt=None)` — telemetry at ~3.7 Hz
- `get_lap_data(session_key, driver_number=None)` — lap times and sectors
- `get_positions(session_key)` — GPS positions of all cars
- `get_intervals(session_key)` — time gaps between cars
- `get_pit_data(session_key, driver_number=None)` — pit stop events
- `get_stints(session_key, driver_number=None)` — tire compound data per stint
- `get_weather(session_key)` — track weather conditions
- `get_race_control(session_key)` — flags, safety car, incidents
- `get_sessions(year=None)` — session metadata
- `get_drivers(session_key=None)` — driver information
- `get_team_radio(session_key, driver_number=None)` — audio URLs
- `get_overtakes(session_key)` — overtaking events
- `close()` — clean shutdown of the connection pool

**Design decisions:**

- Uses `httpx.AsyncClient` for non-blocking I/O — essential for WebSocket consumers that poll rapidly
- All methods follow the same pattern: build params → check Redis cache → call API → cache result → return
- Cache keys follow the format `f1:{endpoint}:{session_key}:{driver_number}:{date_gt}`
- The client is instantiated per WebSocket connection and per Celery task — not as a singleton

### 3.2 TelemetryEngine (`telemetry_engine.py`)

Orchestrates telemetry data flow from OpenF1 to the database and WebSocket channels.

**Responsibilities:**

- Poll OpenF1 for new telemetry data during live sessions
- Transform raw API responses into TelemetrySnapshot model instances
- Broadcast telemetry updates to WebSocket channel groups via Redis pub/sub
- Persist telemetry snapshots for historical analysis (optional — configurable per session)
- Track which sessions are currently live

**Key methods:**

- `start_live_session(session_key)` — begin tracking a live session
- `stop_live_session(session_key)` — stop tracking
- `poll_telemetry(session_key, driver_numbers, since_timestamp)` — fetch new data points
- `snapshot_all_drivers(session_key)` — capture a full snapshot for all drivers and persist to DB
- `get_session_status(session_key)` — returns whether a session is live, complete, or not started

### 3.3 StrategyEngine (`strategy_engine.py`)

Pure calculation logic for race strategy modeling — no side effects, fully testable.

**Responsibilities:**

- Model tire degradation curves per compound
- Calculate predicted lap times based on tire age and compound
- Generate 2–4 strategy options (one-stop, two-stop, undercut, wet switch)
- Score each strategy on total time, tire risk, weather risk, and position gain potential
- Accept race state as input: current lap, total laps, current tires, weather forecast, gaps to rivals

**Key methods:**

- `calculate_strategies(current_lap, total_laps, current_compound, tyre_age, base_lap_time, weather_forecast, gap_ahead, gap_behind)` — returns sorted list of StrategyOption
- `predict_lap_time(compound, tyre_age, base_lap_time)` — returns predicted time for one lap
- `simulate_race_time(start_lap, total_laps, stops)` — returns total time for a strategy
- `calculate_undercut_window(gap_ahead, pit_time_loss)` — returns whether undercut is viable

**Design decisions:**

- The engine is a pure Python class with no Django dependencies — it can be unit tested without the database
- Degradation profiles are stored as class-level constants, not in the database — they are modeling assumptions, not user-configurable data
- The typical pit stop time loss is set to 22 seconds as a constant, adjustable per circuit in the future

### 3.4 WeatherService (`weather_service.py`)

**Responsibilities:**

- Fetch and cache weather data from OpenF1
- Calculate rain probability from weather trends (increasing humidity, falling pressure, rising wind)
- Estimate "rain ETA" in laps based on weather pattern analysis
- Provide weather data formatted for the WeatherRadar frontend component

**Key methods:**

- `get_current_weather(session_key)` — latest weather reading
- `get_weather_history(session_key)` — full weather timeline
- `calculate_rain_forecast(session_key)` — returns probability and estimated arrival in laps
- `is_rain_likely(session_key, within_laps=10)` — boolean check used by StrategyEngine

### 3.5 RaceControlService (`race_control_service.py`)

**Responsibilities:**

- Fetch race control messages from OpenF1
- Parse and categorize messages (flag changes, safety car, penalties, investigations)
- Broadcast new messages to the race control WebSocket channel
- Detect session-critical events (red flag, safety car) and notify the strategy engine

**Key methods:**

- `get_messages(session_key)` — all messages for a session
- `get_latest_flag(session_key)` — current flag status
- `is_safety_car_active(session_key)` — boolean check
- `broadcast_new_messages(session_key, since_timestamp)` — push to WebSocket channel group

### 3.6 SessionSyncService (`session_sync.py`)

**Responsibilities:**

- Synchronize session and driver metadata from OpenF1 into the local database
- Detect new sessions and new/transferred drivers
- Update `is_live` status based on session timing
- Provide session discovery for the frontend (list of available sessions with metadata)

**Key methods:**

- `sync_sessions(year=None)` — pull all sessions, create/update local records
- `sync_drivers(session_key=None)` — pull driver info, create/update
- `get_available_sessions(year, session_type=None)` — filtered list for the frontend
- `detect_live_session()` — returns the currently live session, if any

---

## 4. Security Layer Design

### 4.1 APIShield (`api_shield.py`)

A WAF-like request filtering engine. Every request to `/f1/` passes through the shield before reaching any view.

**Responsibilities:**

- Execute six sequential checks on every request
- Return a threat descriptor if any check fails, or None if the request is clean
- Maintain rate limit counters in Redis

**Checks (executed in order):**

| # | Check | What It Detects | Blocking Severity |
|---|---|---|---|
| 1 | Rate limiting | Excessive requests per IP/user via Redis token bucket | Medium → log only; if 3× limit exceeded → block |
| 2 | SQL injection | UNION/SELECT/INSERT/DROP patterns, comment sequences, tautologies | Critical → block |
| 3 | XSS | `<script>`, `javascript:`, event handler attributes in parameters | High → block |
| 4 | User agent | Known scanner signatures (sqlmap, nikto, burp, dirbuster, gobuster, wfuzz) | Medium → log only |
| 5 | Request size | Body exceeding 1 MB | Low → log only |
| 6 | Parameter tampering | Non-admin user requesting data with another user's ID (IDOR check) | High → block |

**Key methods:**

- `check_request(request)` — main entry point, returns threat dict or None
- `_check_rate_limit(request)` — Redis-backed counter with per-endpoint limits
- `_check_sql_injection(request)` — regex pattern matching on all parameters
- `_check_xss(request)` — regex pattern matching for script/handler injection
- `_check_user_agent(request)` — string matching against known scanners
- `_check_request_size(request)` — content-length validation
- `_check_parameter_tampering(request)` — IDOR detection for authenticated requests
- `_get_client_ip(request)` — extracts real IP accounting for X-Forwarded-For proxy header

**Rate limit tiers:**

| User Type | Requests per Minute |
|---|---|
| Anonymous | 30 |
| Authenticated | 120 |
| Telemetry endpoints | 300 |

### 4.2 F1SecurityMiddleware (`middleware.py`)

Django middleware that wraps all requests to the `/f1/` URL prefix.

**Responsibilities:**

- On request: run API Shield checks, start timing, log threats
- On response: add security headers, log to audit table, record Prometheus metrics

**Security headers added to every response:**

| Header | Value |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `geolocation=(), camera=(), microphone=()` |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' wss: https://api.openf1.org` |

**Blocking behavior:**

- CRITICAL and HIGH severity threats → return 403 JSON response, request never reaches the view
- MEDIUM and LOW severity threats → log and allow through

### 4.3 AuditLogger (`audit.py`)

**Responsibilities:**

- Record every API request to the APIAuditLog table
- Record WebSocket connect/disconnect events
- Hash request bodies with SHA-256 (store hash, not body)
- Mark suspicious requests based on API Shield results

**Key methods:**

- `log_request(request, response, elapsed_ms)` — create APIAuditLog entry
- `log_threat(request, threat_data)` — create ThreatEvent + mark audit log as suspicious
- `log_ws_event(scope, event_type)` — log WebSocket connection events

### 4.4 ThreatMonitor (`threat_monitor.py`)

Background analysis engine that examines audit log patterns over a configurable time window.

**Responsibilities:**

- Detect brute force attacks (10+ failed auth per IP per hour)
- Detect URL scanning (50+ unique paths per IP per hour)
- Detect anomalous traffic volume (500+ requests per IP per hour)
- Create ThreatEvent records for each detection
- Provide aggregated statistics for the security dashboard

**Key methods:**

- `analyze_recent_activity(hours=1)` — run all detection passes, return list of new threats
- `_detect_brute_force(logs, since)` — count 401/403 per IP
- `_detect_scanning(logs, since)` — count unique paths per IP, especially 404s
- `_detect_anomalous_traffic(logs, since)` — count total requests per IP
- `get_dashboard_stats()` — returns threat counts, top IPs, type distribution for the Security Dashboard

### 4.5 Pentest Scanner (`management/commands/run_pentest.py`)

Django management command for automated security testing.

**Responsibilities:**

- Run eight security tests against the application's own API
- Report results in terminal-friendly format (PASS / FAIL / WARN)
- Serve as a learning tool — each test demonstrates a specific OWASP vulnerability class

**Tests:**

| # | Test | OWASP Category |
|---|---|---|
| 1 | SQL injection payloads in query params | A03:2021 – Injection |
| 2 | XSS payloads reflected in responses | A03:2021 – Injection |
| 3 | Required security headers present | A05:2021 – Security Misconfiguration |
| 4 | Rate limiting triggers under load | A04:2021 – Insecure Design |
| 5 | No debug info in error responses | A05:2021 – Security Misconfiguration |
| 6 | CORS rejects arbitrary origins | A05:2021 – Security Misconfiguration |
| 7 | Forged JWT (alg:none) rejected | A07:2021 – Identification and Authentication Failures |
| 8 | IDOR access denied | A01:2021 – Broken Access Control |

---

## 5. WebSocket Consumer Design

### 5.1 TelemetryConsumer (`consumers/telemetry.py`)

AsyncWebsocketConsumer for real-time telemetry data streaming.

**Connection URL:** `/ws/f1/telemetry/<session_key>/`

**Lifecycle:**

1. **connect:** Extract `session_key` from URL, join channel group `telemetry_{session_key}`, instantiate OpenF1Client, log WS connection to audit
2. **receive:** Parse JSON commands (`subscribe`, `unsubscribe`, `replay`), manage driver selection and streaming state
3. **disconnect:** Leave channel group, stop streaming loop, close OpenF1Client, log WS disconnect

**Client commands:**

| Command | Payload | Server response |
|---|---|---|
| `subscribe` | `{"action": "subscribe", "drivers": [1, 44, 63]}` | Starts polling loop; sends `{"type": "telemetry", "driver": 44, "data": {...}}` for each update |
| `unsubscribe` | `{"action": "unsubscribe"}` | Stops polling loop |
| `replay` | `{"action": "replay", "lap": 15}` | Fetches historical lap data; sends `{"type": "replay", "driver": 44, "lap": 15, "data": {...}}` |

**Polling loop design:**

- Uses `asyncio.create_task()` to run the polling loop concurrently with message receiving
- Polls OpenF1 every 1 second using timestamp-based filtering (`date_gt` parameter)
- Sends only the latest data point per driver per poll cycle (not the entire batch)
- On error: sends `{"type": "error", "message": "..."}` and retries after 5 seconds
- On disconnect: `self.streaming = False` flag stops the loop

**Implementation note:** This consumer follows the same pattern as the existing `SocialChatConsumer` — async, group-based, with channel layer broadcasting. The main difference is the polling loop instead of user-triggered messages.

### 5.2 RaceControlConsumer (`consumers/race_control.py`)

AsyncWebsocketConsumer for broadcasting race control messages.

**Connection URL:** `/ws/f1/race-control/`

**Design:** Broadcast-only — no client commands. All connected clients receive every race control message.

**Lifecycle:**

1. **connect:** Join channel group `race_control`, accept connection
2. **race_control_message:** Handler for group broadcasts — sends message to the client
3. **disconnect:** Leave channel group

**Broadcasting:** The RaceControlService calls `channel_layer.group_send('race_control', {'type': 'race_control_message', 'data': {...}})` when new messages arrive from OpenF1.

### 5.3 WebSocket Routing (`routing.py`)

```
/ws/f1/telemetry/<session_key>/  →  TelemetryConsumer
/ws/f1/race-control/             →  RaceControlConsumer
```

Added to the existing ASGI router in `portfolio/asgi.py` alongside the existing `social_chat` and `social_notification` WebSocket routes.

---

## 6. API Endpoint Design

### 6.1 Public Endpoints (authenticated via JWT)

**Sessions:**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/f1/api/sessions/` | List sessions with filtering by year, type, circuit. Paginated. |
| GET | `/f1/api/sessions/<session_key>/` | Single session details with metadata |
| GET | `/f1/api/sessions/live/` | Returns the currently live session (if any) |

**Drivers:**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/f1/api/drivers/` | List all active drivers with team info |
| GET | `/f1/api/drivers/<driver_number>/` | Single driver details |

**Telemetry:**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/f1/api/telemetry/<session_key>/` | Telemetry snapshots for a session, filtered by driver and time range |
| GET | `/f1/api/telemetry/<session_key>/latest/` | Latest telemetry reading per driver (for initial dashboard load) |

**Laps:**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/f1/api/laps/<session_key>/` | Lap data for a session, filterable by driver |
| GET | `/f1/api/laps/<session_key>/fastest/` | Fastest lap per driver in the session |

**Strategy:**

| Method | Endpoint | Description |
|---|---|---|
| POST | `/f1/api/strategy/<session_key>/calculate/` | Calculate strategies given current race state (lap, tires, gaps) |
| GET | `/f1/api/strategy/<session_key>/stints/` | Current stint data for all drivers (tire compound, age) |

**Weather:**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/f1/api/weather/<session_key>/` | Weather timeline for a session |
| GET | `/f1/api/weather/<session_key>/current/` | Latest weather reading |
| GET | `/f1/api/weather/<session_key>/forecast/` | Rain probability and ETA |

**Race Control:**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/f1/api/race-control/<session_key>/` | All race control messages for a session |
| GET | `/f1/api/race-control/<session_key>/flags/` | Current flag status |

### 6.2 Security Endpoints (admin-only)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/f1/api/security/audit-log/` | Paginated, filterable audit log. Query params: `ip`, `method`, `is_suspicious`, `date_from`, `date_to` |
| GET | `/f1/api/security/threats/` | Paginated threat events. Query params: `severity`, `threat_type`, `is_resolved`, `date_from`, `date_to` |
| POST | `/f1/api/security/threats/<id>/resolve/` | Mark a threat as resolved, with resolution notes |
| GET | `/f1/api/security/dashboard/` | Aggregated security stats: threat counts, top IPs, type distribution, request volume |

### 6.3 Monitoring Endpoints (unauthenticated — for Prometheus scraping)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/f1/api/health/` | Application health check (DB, Redis, Celery connectivity) |
| GET | `/f1/api/metrics/` | Prometheus metrics endpoint (text format) |

---

## 7. Celery Tasks

### 7.1 Scheduled Tasks (Celery Beat)

| Task | Schedule | Description |
|---|---|---|
| `sync_f1_sessions` | Every 6 hours | Pull session and driver metadata from OpenF1, update local DB |
| `analyze_security_threats` | Every hour | Run threat detection on audit logs from the past hour |
| `cleanup_old_telemetry` | Daily 01:00 UTC | Delete TelemetrySnapshot records older than `F1_CLEANUP_DAYS` (default: 90) |
| `cleanup_old_audit_logs` | Daily 02:00 UTC | Delete APIAuditLog records older than 180 days |

### 7.2 Event-Triggered Tasks

| Task | Trigger | Description |
|---|---|---|
| `collect_telemetry_snapshot` | Called by TelemetryEngine during live sessions | Bulk-create TelemetrySnapshot records for all drivers in a session |
| `broadcast_race_control` | Called by RaceControlService | Send new race control messages to the WebSocket channel group |

---

## 8. Monitoring Layer Design

### 8.1 Custom Prometheus Metrics (`monitoring/metrics.py`)

**Telemetry metrics:**

| Metric Name | Type | Labels | Description |
|---|---|---|---|
| `f1_telemetry_requests_total` | Counter | `endpoint`, `status` | Total HTTP requests to OpenF1 API |
| `f1_telemetry_latency_seconds` | Histogram | `endpoint` | Response time of OpenF1 API calls. Buckets: 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0 |
| `f1_telemetry_data_points_total` | Counter | `driver_number`, `session_key` | Total telemetry data points processed |

**WebSocket metrics:**

| Metric Name | Type | Labels | Description |
|---|---|---|---|
| `f1_ws_connections_active` | Gauge | `consumer_type` | Currently open WebSocket connections |
| `f1_ws_messages_total` | Counter | `consumer_type`, `direction` | WebSocket messages sent and received |

**Security metrics:**

| Metric Name | Type | Labels | Description |
|---|---|---|---|
| `f1_security_threats_total` | Counter | `threat_type`, `severity` | Threats detected by API Shield and Threat Monitor |
| `f1_security_requests_blocked_total` | Counter | `reason` | Requests blocked (HTTP 403) by API Shield |
| `f1_api_request_duration_seconds` | Histogram | `method`, `endpoint`, `status` | Time to process each API request. Buckets: 0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5 |

**Business metrics:**

| Metric Name | Type | Description |
|---|---|---|
| `f1_active_sessions` | Gauge | Number of sessions currently being monitored |
| `f1_strategy_calculations_total` | Counter | Strategy calculations performed (labeled by type) |

### 8.2 Health Check Endpoint (`monitoring/health.py`)

Returns JSON with connectivity status for each dependency:

| Check | How | Healthy Response |
|---|---|---|
| Database | `connection.ensure_connection()` | `"db": "ok"` |
| Redis | `cache.set/get` test key | `"redis": "ok"` |
| Celery | `app.control.ping()` | `"celery": "ok"` |
| OpenF1 API | HTTP GET to `/v1/sessions?limit=1` | `"openf1": "ok"` |

Returns HTTP 200 if all checks pass, HTTP 503 if any check fails.

### 8.3 Docker Services

Added to `docker-compose.yml`:

| Service | Image | Port | Volumes |
|---|---|---|---|
| `prometheus` | `prom/prometheus:v2.51.0` | 9090 | `prometheus-data`, config mount |
| `grafana` | `grafana/grafana:10.4.0` | 3000 | `grafana-data`, provisioning mount |
| `alertmanager` | `prom/alertmanager:v0.27.0` | 9093 | Config mount |
| `node-exporter` | `prom/node-exporter:v1.7.0` | 9100 | — |
| `redis-exporter` | `oliver006/redis_exporter:v1.58.0` | 9121 | — |

### 8.4 Grafana Dashboards (provisioned as JSON)

| Dashboard | Panels |
|---|---|
| **Telemetry Overview** | Car speed graph (per driver), RPM/gear visualization, throttle vs brake overlay, timing tower, inter-car intervals, weather strip |
| **API Security** | Threat timeline, source IP map, rate limiting stats, top blocked IPs, threat type pie chart, API latency by endpoint |
| **System Health** | CPU/RAM/disk (Node Exporter), Redis memory/connections/hit rate, Celery queue depth/worker count, WebSocket connections, Django request rate/error rate/latency p95/p99 |

### 8.5 Alerting Rules

| Alert | Condition | Severity | Notification |
|---|---|---|---|
| `F1HighErrorRate` | >5% of requests return 5xx for 5 min | Critical | Email + Slack |
| `F1OpenF1Unreachable` | Telemetry requests failing for 2+ min | Warning | Slack |
| `F1SecurityThreatSpike` | >10 threats in 5 minutes | Critical | Email + Slack |
| `F1HighMemory` | >85% memory for 10 min | Warning | Slack |
| `F1DiskLow` | <10% free disk | Critical | Email + Slack |
| `F1WSConnectionSpike` | >100 concurrent WebSocket connections | Warning | Slack |
| `F1CeleryQueueBacklog` | >50 pending tasks for 5 min | Warning | Slack |

---

## 9. Authentication & Permissions

### 9.1 Authentication

All API endpoints use the existing JWT auth (Simple JWT). The subscription portal and main app share the same token system — a user logged into karnetic-labs can access F1 Pit Wall without re-authenticating.

Exception: the `/f1/api/health/` and `/f1/api/metrics/` endpoints are unauthenticated (required for Prometheus scraping and load balancer health checks).

### 9.2 Permission Classes

| Permission Class | Used For |
|---|---|
| `IsAuthenticated` | All data endpoints (sessions, telemetry, laps, weather, etc.) |
| `IsAdminUser` | Security endpoints (audit log, threats, resolve) |
| `AllowAny` | Health check, Prometheus metrics |

### 9.3 WebSocket Authentication

WebSocket consumers authenticate via the JWT token passed as a query parameter: `/ws/f1/telemetry/<session_key>/?token=<jwt>`. The scope's `user` is populated by the existing Channels auth middleware. Unauthenticated WebSocket connections are rejected.

---

## 10. Development Phases

### Phase 1: Foundation (Weeks 1–3)

**Goal:** App skeleton, data models, OpenF1 client, session sync, basic API.

**Tasks:**

1. Create the `f1_pitwall` Django app with the full directory structure as specified in Section 1.1
2. Register the app in `INSTALLED_APPS` in `settings.py`
3. Add `path('f1/', include('apps.f1_pitwall.urls'))` to root `urls.py`
4. Add `httpx` and `prometheus_client` to `requirements.txt`
5. Implement all data models (Section 2) with migrations: Session, Driver, TelemetrySnapshot, LapData, PitStop, Stint, WeatherData, RaceControlMessage, APIAuditLog, ThreatEvent
6. Register all models in `admin.py` with appropriate list_display, list_filter, and search_fields
7. Implement `OpenF1Client` (Section 3.1) with async HTTP, Redis caching, and error handling
8. Implement `SessionSyncService` (Section 3.6) with `sync_sessions()` and `sync_drivers()`
9. Implement `sync_f1_sessions` Celery task and management command
10. Implement basic REST API endpoints: session list/detail, driver list/detail (Section 6.1)
11. Implement serializers for Session and Driver models
12. Run the sync command to populate the database with 2023–2025 session data
13. Write tests: model creation, OpenF1Client with mocked HTTP responses, session sync, API endpoints

**Deliverables:**

- Working app registered in Django, all database tables created
- OpenF1 client fetching real data and caching in Redis
- Sessions and drivers visible via REST API
- Celery task syncing session metadata every 6 hours
- Management command: `python manage.py sync_f1_sessions --year 2025`

### Phase 2: Real-Time Telemetry & WebSocket (Weeks 4–6)

**Goal:** Live telemetry streaming, WebSocket consumers, lap data, pit stops.

**Tasks:**

1. Implement `TelemetryConsumer` (Section 5.1) with subscribe/unsubscribe/replay commands
2. Implement `RaceControlConsumer` (Section 5.2) with broadcast-only design
3. Add WebSocket routing to `routing.py` and integrate into existing `asgi.py` router
4. Implement `TelemetryEngine` (Section 3.2) with polling loop and snapshot persistence
5. Implement `RaceControlService` (Section 3.5) with message fetching and channel broadcasting
6. Implement telemetry REST endpoints: `/telemetry/<session>/`, `/telemetry/<session>/latest/`
7. Implement lap data REST endpoints: `/laps/<session>/`, `/laps/<session>/fastest/`
8. Implement pit stop and stint data ingestion from OpenF1
9. Implement `collect_telemetry_snapshot` Celery task for background data persistence
10. Write tests: WebSocket connection/subscribe/unsubscribe lifecycle, telemetry data flow, lap data accuracy

**Deliverables:**

- WebSocket streaming live telemetry for selected drivers
- Race control messages broadcasting to all connected clients
- Historical telemetry viewable via REST API
- Lap times, pit stops, and stint data available per session
- Replay mode for reviewing historical laps

### Phase 3: Strategy Engine & Weather (Weeks 7–8)

**Goal:** Complete strategy calculation, weather analysis, pit wall intelligence.

**Tasks:**

1. Implement `StrategyEngine` (Section 3.3) with tire degradation model
2. Implement one-stop strategy calculation with optimal pit window detection
3. Implement two-stop strategy calculation with third-splitting logic
4. Implement undercut strategy detection based on gap analysis
5. Implement wet switch strategy based on weather forecast
6. Implement strategy scoring and sorting (total time, tire risk, weather risk)
7. Implement `WeatherService` (Section 3.4) with rain probability forecasting
8. Implement strategy REST endpoint: `POST /strategy/<session>/calculate/`
9. Implement weather REST endpoints: current, timeline, forecast
10. Implement stint data endpoint: `/strategy/<session>/stints/`
11. Write parameterized tests for all strategy types, edge cases (final lap, already on optimal tire, no viable one-stop), and weather forecast accuracy

**Deliverables:**

- Strategy engine generating 2–4 options for any race state
- Weather service providing rain probability and ETA
- All strategy and weather endpoints functional
- Tire degradation model tested against known race data

### Phase 4: CyberSecurity Layer (Weeks 9–12)

**Goal:** Complete security module — API Shield, audit, threat detection, pentest.

**Tasks:**

1. Implement `APIShield` (Section 4.1) with all six check types
2. Implement SQL injection detection with regex patterns (UNION, SELECT, comment, tautology)
3. Implement XSS detection with regex patterns (script tags, javascript:, event handlers)
4. Implement rate limiting via Redis token bucket with per-tier limits
5. Implement user agent scanner detection
6. Implement request size validation
7. Implement IDOR / parameter tampering detection
8. Implement `F1SecurityMiddleware` (Section 4.2) with request/response processing and security headers
9. Register middleware in `settings.py` MIDDLEWARE list
10. Implement `AuditLogger` (Section 4.3) with request/threat/WebSocket logging
11. Implement `ThreatMonitor` (Section 4.4) with brute force, scanning, and traffic anomaly detection
12. Implement `analyze_security_threats` Celery task (hourly)
13. Implement security REST endpoints: audit-log, threats, resolve, dashboard (Section 6.2)
14. Implement `run_pentest` management command with all 8 tests (Section 4.5)
15. Implement `cleanup_old_audit_logs` Celery task
16. Write tests: each API Shield check independently, middleware integration, threat detection accuracy, pentest command output

**Deliverables:**

- All requests to `/f1/` filtered through API Shield
- Security headers on every response
- Complete audit log of all API requests
- Hourly threat analysis detecting brute force, scanning, anomalous traffic
- Admin-accessible security dashboard via API
- Working pentest command: `python manage.py run_pentest --target http://localhost:8000/f1/api/`

### Phase 5: DevOps Monitoring Stack (Weeks 13–15)

**Goal:** Prometheus, Grafana, AlertManager — full observability pipeline.

**Tasks:**

1. Define all custom Prometheus metrics (Section 8.1) in `monitoring/metrics.py`
2. Instrument the OpenF1Client: increment `f1_telemetry_requests_total` and observe `f1_telemetry_latency_seconds` on every API call
3. Instrument WebSocket consumers: update `f1_ws_connections_active` on connect/disconnect, increment `f1_ws_messages_total`
4. Instrument security middleware: increment `f1_security_threats_total` and `f1_security_requests_blocked_total`, observe `f1_api_request_duration_seconds`
5. Implement the health check endpoint (Section 8.2) with DB/Redis/Celery/OpenF1 checks
6. Implement the Prometheus metrics endpoint (expose metrics in text format)
7. Create `monitoring/prometheus/prometheus.yml` with scrape targets (Section 8.3)
8. Create Grafana provisioning files: datasource (Prometheus) and three dashboard JSON files (Section 8.4)
9. Create `monitoring/alertmanager/alertmanager.yml` with email/Slack routing
10. Add all five Docker services to `docker-compose.yml` (Section 8.3) with volumes and environment variables
11. Configure alerting rules in Prometheus (Section 8.5)
12. Test: metrics appear in Prometheus UI, dashboards render in Grafana, alerts fire on simulated conditions

**Deliverables:**

- Prometheus scraping all targets every 15 seconds
- Three Grafana dashboards with real data
- AlertManager sending notifications on threshold breach
- Health check endpoint returning status of all dependencies
- All Docker services running together via `docker-compose up`

### Phase 6: Frontend, Integration & QA (Weeks 16–18)

**Goal:** Vue.js dashboard, full integration, testing, deployment.

**Tasks:**

1. Scaffold Vue.js frontend in `f1_pitwall/_dev/` following the existing Webpack pattern from `core/_dev/`
2. Implement `useWebSocket` composable with connect/send/reconnect logic
3. Implement `useTelemetry` composable for driver selection and data buffering
4. Implement `useStrategy` composable for strategy API interaction
5. Build `TelemetryDashboard` component with Chart.js/ECharts real-time graphs
6. Build `TimingTower` component with position table and driver selection
7. Build `TrackMap` component with SVG circuit and GPS car positions
8. Build `StrategyPanel` and `TireStrategy` components
9. Build `WeatherRadar` component
10. Build `RaceControl` component with scrolling message feed
11. Build `SecurityDashboard` component (admin only)
12. Build `SystemHealth` component with embedded Grafana panels or independent charts
13. Configure Webpack build, SCSS, and integrate into Django template
14. End-to-end testing: session selection → telemetry streaming → strategy calculation → race control → security monitoring
15. Update the existing GitHub Actions CI/CD pipeline to include new tests and linting
16. Update production `docker-compose.deploy.yml` with monitoring services
17. Deploy to AWS EC2 and verify all services
18. Update project README with F1 Pit Wall documentation
19. Performance optimization: database query profiling, index verification, Redis memory usage review

**Deliverables:**

- Complete Vue.js dashboard with all components functional
- Real-time telemetry streaming in the browser
- Full CI/CD pipeline covering the new app
- Production deployment with monitoring stack
- Updated README

---

## 11. Integration Points with Existing Codebase

### 11.1 Files to Modify

| Existing File | Change | Rationale |
|---|---|---|
| `portfolio/settings.py` | Add `'apps.f1_pitwall'` to `INSTALLED_APPS`, add `'apps.f1_pitwall.security.middleware.F1SecurityMiddleware'` to `MIDDLEWARE`, add F1 env variables | App registration and security middleware |
| `portfolio/urls.py` | Add `path('f1/', include('apps.f1_pitwall.urls'))` | URL routing |
| `portfolio/asgi.py` | Add WebSocket routes for `f1/telemetry/` and `f1/race-control/` to the existing URLRouter | WebSocket consumer registration |
| `portfolio/celery.py` | Add Celery Beat schedule entries for the four new periodic tasks | Background task scheduling |
| `requirements.txt` | Add `httpx>=0.27` and `prometheus_client>=0.21` | New dependencies |
| `docker-compose.yml` | Add Prometheus, Grafana, AlertManager, Node Exporter, Redis Exporter services and volumes | Monitoring infrastructure |
| `docker-compose.deploy.yml` | Same additions as above, with production-appropriate resource limits | Production deployment |
| `.github/workflows/checks.yml` | Add test coverage for `apps.f1_pitwall`, add linting for new Python files | CI/CD |

### 11.2 Files Not Modified

| Existing Component | Reason |
|---|---|
| `accounts/` app | Read-only — used for user reference in audit logs |
| All other apps (core, taberna, social, ai_lab, donation) | No interaction — F1 Pit Wall is fully self-contained |
| Existing WebSocket consumers | Not modified — new consumers are registered alongside them |
| Existing Celery tasks | Not modified — new tasks are added to the schedule |

### 11.3 Environment Variables to Add

| Variable | Description | Default |
|---|---|---|
| `GRAFANA_PASSWORD` | Admin password for Grafana | `f1pitwall` |
| `OPENF1_API_URL` | Base URL for OpenF1 API | `https://api.openf1.org/v1` |
| `F1_SECURITY_RATE_LIMIT_ANON` | Rate limit for anonymous users (req/min) | `30` |
| `F1_SECURITY_RATE_LIMIT_AUTH` | Rate limit for authenticated users (req/min) | `120` |
| `F1_SECURITY_RATE_LIMIT_TELEMETRY` | Rate limit for telemetry endpoints (req/min) | `300` |
| `F1_TELEMETRY_CACHE_TTL` | Redis cache TTL for live telemetry data (seconds) | `5` |
| `F1_TELEMETRY_HISTORY_TTL` | Redis cache TTL for historical data (seconds) | `3600` |
| `F1_CLEANUP_DAYS` | Days of telemetry data to retain | `90` |
| `F1_AUDIT_CLEANUP_DAYS` | Days of audit log data to retain | `180` |

---

## 12. Testing Strategy

### 12.1 Unit Tests

| Area | Test Count (est.) | Priority |
|---|---|---|
| OpenF1Client (all endpoints, caching, error handling) | 15–20 | Critical |
| StrategyEngine (all 4 strategy types + edge cases) | 20–25 | Critical |
| APIShield (all 6 check types independently) | 15–20 | Critical |
| ThreatMonitor (all 3 detection patterns) | 10–12 | Critical |
| TelemetryEngine (data flow, persistence) | 8–10 | High |
| WeatherService (forecast calculation) | 6–8 | High |
| Serializer validation | 10–12 | High |
| SessionSyncService (create/update logic) | 5–8 | High |
| SecurityMiddleware (header injection, blocking) | 5–8 | High |
| Pentest command (each test produces expected result) | 8–10 | Medium |

### 12.2 Integration Tests

| Area | Description |
|---|---|
| Full telemetry flow | Session sync → WebSocket connect → subscribe → receive telemetry → verify data format |
| Full strategy flow | Load session data → request strategy calculation → verify strategies returned with correct fields |
| Security pipeline | Send malicious request → API Shield blocks → audit log created → threat event generated |
| Monitoring pipeline | Make API requests → verify Prometheus metrics increment → verify health check passes |
| Replay flow | Connect WebSocket → request replay for lap 15 → receive historical data |

### 12.3 OpenF1 API Mock Strategy

Use `httpx` mock transport for unit tests — no real API calls in CI. For integration tests, use recorded OpenF1 API responses (JSON fixtures) from real sessions. Never hit the live OpenF1 API in automated tests.

**Fixture recordings:**

- Record responses for Bahrain 2024 Race (session_key 9158) as the canonical test dataset
- Store fixtures in `tests/fixtures/openf1/` as JSON files
- Use `httpx.MockTransport` to return fixtures based on request URL matching

---

## 13. Key Technical Decisions to Make Before Development

| Decision | Options | Recommendation |
|---|---|---|
| OpenF1 data persistence | (a) Store all telemetry permanently (b) Store snapshots only, use cache for real-time (c) Configurable per session | **(c) Configurable** — persist race sessions, discard practice data after 30 days |
| Telemetry polling vs. streaming | (a) Server polls OpenF1 at intervals (b) Server-Sent Events from OpenF1 | **(a) Polling** — OpenF1 historical API is request-based, not streaming. 1-second polling interval. |
| Strategy engine: real-time vs. on-demand | (a) Continuously recalculate strategies (b) Calculate on user request | **(b) On-demand** — strategy calculation is triggered by the user clicking "Calculate" with current race state. Saves server resources. |
| WebSocket auth | (a) JWT in query param (b) JWT in first message (c) Cookie-based | **(a) Query param** — consistent with existing Channels middleware, already implemented in the platform |
| Security middleware scope | (a) All requests globally (b) Only `/f1/` prefix | **(b) Only `/f1/`** — avoids interfering with existing apps' performance |
| Prometheus metrics library | (a) django-prometheus (full auto-instrumentation) (b) prometheus_client (manual) | **(b) Manual** — finer control over what's measured, fewer dependencies, and the custom F1 metrics are the main value |
| Frontend framework | (a) New Vue.js SPA via Webpack (b) Standalone React app (c) Integrate into existing templates | **(a) Webpack Vue.js** — consistent with existing `core/_dev/` and `taberna_product/_dev/` patterns |
| Chart library | (a) Chart.js (b) ECharts (c) D3 | **(a) Chart.js** — already available in the ecosystem, sufficient for telemetry graphs, lower learning curve |

---

## 14. Risk Mitigation

| Risk | Mitigation |
|---|---|
| OpenF1 API rate limiting or downtime | Redis caching with configurable TTL, graceful degradation (show cached data), health check monitors availability |
| High telemetry data volume overwhelming PostgreSQL | Configurable persistence (not all sessions stored), 90-day cleanup, compound index on (session, driver, timestamp), batch inserts |
| WebSocket connection scaling (many concurrent users) | Rate limit per IP, `f1_ws_connections_active` gauge monitors load, AlertManager warns at 100 connections |
| OpenF1 API response format changes | Pin to `/v1/` versioned endpoints, validate response schemas, test against recorded fixtures |
| Security false positives (legitimate requests blocked) | Log-only mode for MEDIUM/LOW threats, admin can resolve false positive threat events, configurable regex patterns |
| Prometheus/Grafana resource usage on EC2 | Lightweight Alpine images, 30-day retention limit on Prometheus, Grafana data stored in Docker volume |
| Strategy engine producing unrealistic recommendations | Degradation profiles are conservative estimates, all strategies include risk scores, parameterized tests against known race outcomes |
| Redis memory pressure from telemetry caching | Short TTL (5 seconds) for live data, 1-hour TTL for historical, monitor via Redis Exporter metrics |

---

*Backend Development Plan for the F1 Pit Wall Command Center. February 2026.*
