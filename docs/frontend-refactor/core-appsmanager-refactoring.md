# Core / Apps Manager — Structure Refactoring Plan

**Document:** `core-appsmanager-refactoring`  
**Status:** Planned  
**Scope:** File/folder layout only. **No** API or UI behaviour changes.  
**Reference:** [README.md](./README.md)  
**Backend sibling:** [../refactor/core-app-refactoring.md](../refactor/core-app-refactoring.md)  
**Sibling plans:** [router-shell-refactoring.md](./router-shell-refactoring.md)

---

## 1. Goals and Non-Goals

### Goals

- Group apps manager code under **`src/apps/core-appsmanager/`**.
- Extract inline **`axios`** from views into **`api/vueApps.js`**.
- Optional: thin Vuex module for app list (today local `data()` in `HomeView`).

### Non-Goals

- Changing `/api/v1/vue-apps/` or search endpoint contracts.
- Redesigning the portfolio home page.

---

## 2. Current State Inventory

| File | Lines | Role |
|------|------:|------|
| `views/appsmanager/HomeView.vue` | ~68 | `GET /api/v1/vue-apps/` in `mounted` |
| `views/appsmanager/SearchView.vue` | ~60 | `POST /api/v1/vue-apps/search/` |
| `views/appsmanager/NotFoundView.vue` | ~20 | 404 page |
| `components/appsmanager/TheAppCard.vue` | ~40 | App card |
| `components/appsmanager/TheNavbar.vue` | ~90 | Nav + search form |
| `components/appsmanager/TheFooter.vue` | ~30 | Footer |
| `layouts/appsmanager/MainAppsManagerLayout.vue` | ~25 | Shell |

### Routes

| Path | Name | Layout |
|------|------|--------|
| `/` | `homeAppsManager` | `mainAppsManager` |
| `/apps_manager/search` | `searchAppsManager` | `mainAppsManager` |
| `/:NotFound(.*)*` | `notFound` | `mainAppsManager` |

### Backend mapping

| Frontend call | Backend handler |
|---------------|-----------------|
| `GET /api/v1/vue-apps/` | `core.views.vue_api.VueAppsAPIList` |
| `POST /api/v1/vue-apps/search/` | `core.views.vue_api.search_api` |

---

## 3. Target Directory Layout

```
src/apps/core-appsmanager/
├── api/
│   └── vueApps.js              # getVueApps(), searchVueApps(query)
├── store/
│   └── appsManager.module.js   # optional: list + search state
├── routes.js
├── views/
│   ├── HomeView.vue
│   ├── SearchView.vue
│   └── NotFoundView.vue
├── components/
│   ├── TheAppCard.vue
│   ├── TheNavbar.vue
│   └── TheFooter.vue
└── layouts/
    └── MainAppsManagerLayout.vue

# Legacy shims (temporary)
src/views/appsmanager/*.vue
src/components/appsmanager/*
```

---

## 4. Phased Execution Plan

| Phase | Actions | Verification |
|-------|---------|--------------|
| 0 | Branch; smoke `/` and search | `npm run build` |
| 1 | Create `api/vueApps.js`; point HomeView + SearchView at it | List + search work |
| 2 | Move components + views + layout into `apps/core-appsmanager/` | Imports via shim |
| 3 | Extract `routes.js` (see router-shell plan) | Routes resolve |
| 4 | (Optional) Vuex module; remove local `data()` | Same UI |
| 5 | Remove shims | lint + build |

**Estimated PRs:** 2–3. **Recommended pilot** for frontend refactor pattern.

---

## 5. Acceptance Criteria

- [ ] Home loads application cards from API.
- [ ] Search returns filtered apps.
- [ ] 404 route unchanged.
- [ ] No direct `axios` in views after Phase 2.
- [ ] `flake8` N/A; `npm run lint` clean.

---

*End of plan.*
