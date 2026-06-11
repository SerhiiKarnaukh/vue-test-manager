# Apps Manager — Structure Refactoring Plan

**Document:** `apps_manager-refactoring`  
**Status:** Done  
**Scope:** File/folder layout only. **No** API or UI behaviour changes.  
**Reference:** [README.md](./README.md)  
**Backend sibling:** [../refactor/core-app-refactoring.md](../refactor/core-app-refactoring.md)  
**Sibling plans:** [router-shell-refactoring.md](./router-shell-refactoring.md)

---

## 1. Goals and Non-Goals

### Goals

- Group apps manager code under **`src/apps/apps_manager/`**.
- Extract inline **`axios`** from views into **`api/vueApps.js`**.
- Optional: thin Vuex module for app list (today local `data()` in `HomeView`).

### Non-Goals

- Changing `/api/v1/vue-apps/` or search endpoint contracts.
- Redesigning the portfolio home page.

---

## 2. Current State Inventory

| File | Lines | Role |
|------|------:|------|
| `apps_manager/views/HomeView.vue` | ~68 | `GET /api/v1/vue-apps/` in `mounted` |
| `apps_manager/views/SearchView.vue` | ~60 | `POST /api/v1/vue-apps/search/` |
| `apps_manager/views/NotFoundView.vue` | ~20 | 404 page |
| `apps_manager/components/TheAppCard.vue` | ~40 | App card |
| `apps_manager/components/TheNavbar.vue` | ~90 | Nav + search form |
| `apps_manager/components/TheFooter.vue` | ~30 | Footer |
| `apps_manager/layouts/MainAppsManagerLayout.vue` | ~25 | Shell |

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
src/apps/apps_manager/
├── README.md
├── vue_manager.jpg
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
```

---

## 4. Phased Execution Plan

| Phase | Actions | Verification |
|-------|---------|--------------|
| 0 | Branch; smoke `/` and search | `npm run build` |
| 1 | Create `api/vueApps.js`; point HomeView + SearchView at it | List + search work |
| 2 | Move components + views + layout into `apps/apps_manager/` | Imports updated |
| 3 | Extract `routes.js` (see router-shell plan) | Routes resolve |
| 4 | (Optional) Vuex module; remove local `data()` | Same UI |
| 5 | Remove legacy paths | lint + build |

**Estimated PRs:** 2–3. **Recommended pilot** for frontend refactor pattern.

---

## 5. Acceptance Criteria

- [x] Home loads application cards from API.
- [x] Search returns filtered apps.
- [x] 404 route unchanged.
- [x] No direct `axios` in views after Phase 2.
- [x] `flake8` N/A; `npm run lint` clean.

---

*End of plan.*
