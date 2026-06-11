# Shared Auth — Structure Refactoring Plan

**Document:** `shared-auth-refactoring`  
**Status:** Done  
**Scope:** File/folder layout only. **No** login/signup API contract or token storage semantics changes.  
**Reference:** [README.md](./README.md)  
**Sibling plans:** [taberna-profiles-refactoring.md](./taberna-profiles-refactoring.md), [social-profiles-refactoring.md](./social-profiles-refactoring.md)

---

## 1. Goals and Non-Goals

### Goals

- Consolidate **`authJWT`** and **`authToken`** under `src/shared/auth/`.
- Extract JWT endpoint map (`authJwtEndpoints.js`) into `shared/auth/api/`.
- Introduce shared **login/signup form components** to remove duplication between taberna and social views.
- Fix **`checkActiveApp`** closure bug (should destructure `state` from context — see improve notes).
- Add minimal **Vitest** baseline for auth helpers (Phase 0).

### Non-Goals

- Merging taberna and social into one login page or one JWT issuer.
- Removing `authToken` (Djoser-style registration) in this refactor — only reorganize.
- Removing **Pinia** or migrating stores to Pinia (separate decision).

---

## 2. Current State Inventory

| File | Lines | Role |
|------|------:|------|
| `store/modules/authJWT.module.js` | ~110 | JWT login, refresh, logout, `checkActiveApp` |
| `store/modules/authToken.module.js` | ~128 | Token auth: register (taberna/social signup) |
| `utils/authJwtEndpoints.js` | ~30 | `resolveJwtLoginUrl`, `isJwtObtainOrRefreshUrl` |
| `axios-interceptor.js` | ~40 | Attach Bearer token; refresh on 401 |
| `views/taberna/LoginView.vue` | ~126 | Taberna login (duplicate UI) |
| `views/social/LoginView.vue` | ~123 | Social login (duplicate UI) |
| `views/taberna/SignupView.vue` | ~200 | Uses `authToken/register` |
| `views/social/SignupView.vue` | ~200 | Uses `authToken/register` |

### API endpoints (unchanged)

| App | Login (JWT) | Registration |
|-----|-------------|--------------|
| Taberna | `POST /taberna-profiles/api/v1/token/` | `POST` via `authToken` → app-specific URL in module |
| Social | `POST /api/social-profiles/api/v1/token/` | same pattern |
| Default refresh | `POST /api/v1/token/refresh/` | — |

### Cross-module dependencies

| Symbol | Consumers |
|--------|-----------|
| `authJWT/isAuthenticated` | router guards |
| `authJWT/checkActiveApp` | taberna, social layouts |
| `isJwtObtainOrRefreshUrl` | `axios-interceptor.js` |

---

## 3. Target Directory Layout

```
src/shared/auth/
├── api/
│   ├── jwt.js                  # obtain, refresh URLs (from authJwtEndpoints)
│   └── token.js                # register URLs used by authToken
├── store/
│   ├── authJWT.module.js
│   └── authToken.module.js
├── components/
│   ├── AuthLoginForm.vue       # email, password, vuelidate slots
│   └── AuthSignupForm.vue      # shared fields; app-specific extras via slots
└── composables/
    └── useAuthLogin.js         # optional: shared loginHandler logic

src/shared/http/
└── axios-interceptor.js        # moved from src/ root

# Legacy shims
src/store/modules/authJWT.module.js      → re-export
src/store/modules/authToken.module.js    → re-export
src/utils/authJwtEndpoints.js            → re-export from shared/auth/api/jwt.js
src/axios-interceptor.js                 → re-export
```

---

## 4. Phased Execution Plan

| Phase | Actions | Verification |
|-------|---------|--------------|
| 0 | Add Vitest; tests for `resolveJwtLoginUrl`, `isJwtObtainOrRefreshUrl` | `npm run test` |
| 1 | Move `authJwtEndpoints` → `shared/auth/api/jwt.js`; shim | Unit tests green |
| 2 | Move `authJWT` + `authToken` stores; update `store/index.js` imports | Login taberna + social smoke |
| 3 | Move `axios-interceptor.js`; fix `checkActiveApp({ state, ... })` | 401 refresh smoke |
| 4 | Add `AuthLoginForm`; refactor taberna + social LoginView to thin wrappers | Visual parity |
| 5 | Add `AuthSignupForm`; refactor signup views | Registration smoke |
| 6 | Remove shims | `npm run build` |

**Estimated PRs:** 5–6.

---

## 5. Acceptance Criteria

- [x] JWT login still uses per-app token URL (`login_source` / `activeApp`).
- [x] Signup still dispatches `authToken/register` with same payloads.
- [x] Interceptor does not refresh on `/token/` or `/token/refresh/`.
- [x] `localStorage` keys (`access`, `refresh`, `active_app`) unchanged.
- [x] Taberna and social login pages look and behave the same.
- [x] Vitest covers JWT URL resolver helpers and `authToken` module.

---

*End of plan.*
