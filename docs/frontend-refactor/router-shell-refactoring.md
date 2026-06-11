# Router & App Shell — Structure Refactoring Plan

**Document:** `router-shell-refactoring`  
**Status:** Done  
**Scope:** File/folder layout only. **No** route path changes, guard behaviour changes, or layout behaviour changes.  
**Reference:** [README.md](./README.md)  
**Sibling plans:** [shared-auth-refactoring.md](./shared-auth-refactoring.md)

---

## 1. Goals and Non-Goals

### Goals

- Split monolithic **`router/index.js`** (~370 lines) into per-domain route modules.
- Extract navigation guards (`getLoginRoute`, `beforeEach`) into **`shared/router/guards.js`**.
- Keep **`applyLegacyGuardCompat`** isolated — removable when Vuetify no longer needs it.
- Prepare **`App.vue`** for lazy layout registration instead of hard-coded imports for every app.

### Non-Goals

- Changing URL paths (`/taberna/*`, `/social/*`, `/ai-lab/*`).
- Adding new meta fields or auth mechanisms.
- Migrating to file-based routing (unplugin-vue-router).

---

## 2. Current State Inventory

| File | Lines | Role |
|------|------:|------|
| `src/router/index.js` | ~345 | All routes (apps_manager, taberna, social, ai_lab) + guards |
| `src/App.vue` | ~38 | Layout switcher via `meta.layout` |
| `src/main.js` | ~21 | `app.use(router)` |

### Route groups (current `router/index.js`)

| Prefix | Routes | Suggested module |
|--------|--------|------------------|
| `/`, `/apps_manager/*` | 3 | `apps/apps_manager/routes.js` |
| `/taberna/*` | 14 | `apps/taberna/routes.js` (or split per sub-app later) |
| `/social/*` | 14 | `apps/social/routes.js` |
| `/ai-lab/*` | 4 | `apps/ai_lab/routes.js` |
| `/:NotFound(.*)*` | 1 | `shared/router/routes.js` or apps_manager |

### Layout mapping (`App.vue`)

| `meta.layout` | Component |
|---------------|-----------|
| `mainAppsManager` | `MainAppsManagerLayout` |
| `mainTaberna` | `MainTabernaLayout` |
| `mainSocial` | `MainSocialLayout` |
| `mainAILab` | `MainAILabLayout` |

---

## 3. Target Directory Layout

```
src/shared/router/
├── index.js                    # createRouter, merge routes, export default
├── guards.js                   # getLoginRoute, auth beforeEach
└── legacy-guard-compat.js      # applyLegacyGuardCompat (TODO removal)

src/apps/apps_manager/routes.js
src/apps/taberna/routes.js        # umbrella; may split in taberna-* plans
src/apps/social/routes.js
src/apps/ai_lab/routes.js

# Legacy shim (temporary)
src/router/index.js             # re-export from shared/router/index.js
```

**`App.vue` target (optional Phase 3):**

```js
const layoutModules = import.meta.glob('@/apps/*/layouts/*.vue')
// or explicit map until all apps migrated
```

---

## 4. Phased Execution Plan

| Phase | Actions | Verification |
|-------|---------|--------------|
| 0 | Branch; manual smoke all route prefixes | `npm run build` |
| 1 | Create `shared/router/guards.js` + `legacy-guard-compat.js`; import from `router/index.js` | Auth redirect smoke: `/taberna/dashboard` logged out |
| 2 | Extract `apps/apps_manager/routes.js`; spread in index | `/`, search, 404 |
| 3 | Extract taberna, social, ai_lab route files | Full route table smoke |
| 4 | Move `router/index.js` → `shared/router/index.js`; shim at old path | Imports `@/router` still work |
| 5 | (Optional) Dynamic layout map in `App.vue` | All layouts render |

**Estimated PRs:** 3–4.

---

## 5. Acceptance Criteria

- [x] All existing named routes resolve (`name` unchanged).
- [x] `meta.layout` and `meta.authJWT` behaviour unchanged.
- [x] `getLoginRoute` still sends taberna → `/taberna/login?redirect=…` and social → `/social/login`.
- [x] `router/index.js` shim: `export { default } from '@/shared/router'` (or equivalent).
- [x] `npm run build` and `npm run lint` clean.
- [x] No route file > ~150 lines (split taberna/social further if needed).

---

*End of plan.*
