# Taberna Profiles — Structure Refactoring Plan

**Document:** `taberna-profiles-refactoring`  
**Status:** Planned  
**Scope:** File/folder layout only. **No** auth or profile API changes.  
**Reference:** [README.md](./README.md)  
**Backend sibling:** [../refactor/taberna-profiles-app-refactoring.md](../refactor/taberna-profiles-app-refactoring.md)  
**Sibling plans:** [taberna-cart-refactoring.md](./taberna-cart-refactoring.md), [shared-auth-refactoring.md](./shared-auth-refactoring.md)

---

## 1. Goals and Non-Goals

### Goals

- Move taberna **auth + dashboard** views under `src/apps/taberna/profiles/`.
- Extract **`GET taberna-profiles/api/v1/orders/`** from `DashboardView.vue` into `api/orders.js`.
- Remove empty stub **`tabernaProfileData.module.js`** or replace with real profiles store when needed.
- Wire login/signup to [shared auth components](./shared-auth-refactoring.md) after shared-auth Phase 4.

### Non-Goals

- Changing taberna JWT path (`/taberna-profiles/api/v1/token/`).
- Merging taberna profiles with global `accounts` UI.

---

## 2. Current State Inventory

| File | Lines | Role |
|------|------:|------|
| `views/taberna/LoginView.vue` | ~126 | JWT login via `authJWT` |
| `views/taberna/SignupView.vue` | ~200 | `authToken/register` |
| `views/taberna/DashboardView.vue` | ~60 | **Direct axios** → orders list |
| `store/modules/tabernaData/tabernaProfileData.module.js` | ~15 | Empty stub |
| `layouts/taberna/MainTabernaLayout.vue` | ~25 | `checkActiveApp('taberna')`, `getCart` |

### Routes (`/taberna/*` — profiles subset)

| Path | View | `authJWT` |
|------|------|-----------|
| `/taberna/login` | LoginView | false |
| `/taberna/signup` | SignupView | — |
| `/taberna/dashboard` | DashboardView | true |

### API calls (target `api/`)

| Method | Endpoint | Current location |
|--------|----------|------------------|
| GET | `taberna-profiles/api/v1/orders/` | `DashboardView.vue` |
| POST | `/taberna-profiles/api/v1/token/` | `authJWT` via `login_source: taberna` |

---

## 3. Target Directory Layout

```
src/apps/taberna/profiles/
├── api/
│   └── orders.js
├── store/
│   └── profiles.module.js      # orders list state (from DashboardView)
├── views/
│   ├── LoginView.vue           # thin wrapper over shared AuthLoginForm
│   ├── SignupView.vue
│   └── DashboardView.vue
└── index.js

src/apps/taberna/layouts/
└── MainTabernaLayout.vue       # shared across taberna sub-apps

# Legacy shims
src/views/taberna/LoginView.vue
src/store/modules/tabernaData/tabernaProfileData.module.js
```

---

## 4. Phased Execution Plan

| Phase | Actions | Verification |
|-------|---------|--------------|
| 0 | Branch; smoke login + dashboard orders | build |
| 1 | `api/orders.js` + `profiles.module.js`; refactor DashboardView | Orders list loads |
| 2 | Move login/signup/dashboard views | Routes work |
| 3 | Integrate shared `AuthLoginForm` / `AuthSignupForm` | Visual parity |
| 4 | Delete empty `tabernaProfileData` or re-export shim | store index clean |
| 5 | Remove shims | lint + build |

**Estimated PRs:** 3–4.

---

## 5. Acceptance Criteria

- [ ] Dashboard shows user orders from same API.
- [ ] Login redirects to dashboard; logout clears session.
- [ ] `MainTabernaLayout` still calls `checkActiveApp('taberna')`.
- [ ] No `axios` in `DashboardView.vue`.
- [ ] Empty `tabernaProfileData` module removed or implemented — not left as dead code.

---

*End of plan.*
