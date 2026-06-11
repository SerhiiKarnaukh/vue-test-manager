# Karnetic Labs — Frontend Structure Refactoring

**Project:** `test-applications-manager-vue` (`src/`)  
**Backend reference:** [../refactor/README.md](../refactor/README.md)  
**Principle:** Structure-only refactor — **no** business-logic changes, API contract changes, or URL path changes visible to users.

---

## Domain Groups

| Group | Frontend module | Backend app(s) | Notes |
|-------|-----------------|----------------|-------|
| Shared auth & shell | [shared-auth](./shared-auth-refactoring.md), [router-shell](./router-shell-refactoring.md) | `accounts` | JWT per app (`authJWT`), legacy token signup (`authToken`) |
| Portfolio launcher | [apps_manager](./apps_manager-refactoring.md) | `core` | `/api/v1/vue-apps/` |
| Taberna e-commerce | [taberna-profiles](./taberna-profiles-refactoring.md), [taberna-cart](./taberna-cart-refactoring.md), [taberna-product](./taberna-product-refactoring.md), [taberna-orders](./taberna-orders-refactoring.md) | same names | Today merged in `tabernaData` store + scattered `axios` in views |
| Social network | [social-profiles](./social-profiles-refactoring.md), [social-posts](./social-posts-refactoring.md), [social-chat](./social-chat-refactoring.md), [social-notification](./social-notification-refactoring.md) | same names | Today merged in `socialNetworkData` store |
| Standalone | [ai_lab](./ai_lab-refactoring.md) | `ai_lab` | OpenAI tools |

---

## Refactoring Plans (this repo)

| Module | Plan | Priority | Largest file (prod) | Status |
|--------|------|----------|---------------------|--------|
| `router` + `App.vue` shell | [router-shell-refactoring.md](./router-shell-refactoring.md) | High | `shared/router/index.js` | **Done** |
| `shared-auth` | [shared-auth-refactoring.md](./shared-auth-refactoring.md) | High | `authToken.module.js` | **Done** |
| `social-posts` | [social-posts-refactoring.md](./social-posts-refactoring.md) | High | `posts.module.js` | **Done** |
| `taberna-cart` + orders actions | [taberna-cart-refactoring.md](./taberna-cart-refactoring.md) | High | `cart.module.js` | **Done** |
| `social-profiles` | [social-profiles-refactoring.md](./social-profiles-refactoring.md) | Medium | `profiles.module.js` | **Done** |
| `taberna-profiles` | [taberna-profiles-refactoring.md](./taberna-profiles-refactoring.md) | Medium | `LoginView.vue` (thin wrapper) | **Done** |
| `taberna-product` | [taberna-product-refactoring.md](./taberna-product-refactoring.md) | Medium | `product.module.js` | **Done** |
| `taberna-orders` | [taberna-orders-refactoring.md](./taberna-orders-refactoring.md) | Medium | `orders.module.js` | **Done** |
| `social-chat` | [social-chat-refactoring.md](./social-chat-refactoring.md) | Medium | `chat.module.js` | **Done** |
| `social-notification` | [social-notification-refactoring.md](./social-notification-refactoring.md) | Low | `notifications.module.js` | **Done** |
| `ai_lab` | [ai_lab-refactoring.md](./ai_lab-refactoring.md) | Medium | `aiLab.module.js` | **Done** |
| `apps_manager` | [apps_manager-refactoring.md](./apps_manager-refactoring.md) | Low | `HomeView.vue` | **Done** |

**Suggested order:** `router-shell` → `shared-auth` → `apps_manager` (pilot) → taberna cluster → social cluster → `ai_lab`.

Start with **Taberna cart** or **apps_manager** as the first domain pilot after shell — smallest blast radius vs. social.

---

## Target Pattern (feature-module layout)

Mirror backend domain boundaries; each product area becomes a self-contained frontend module:

```
src/apps/<domain>/
├── README.md                # app overview, routes, API — lives at app root
├── <app>_main.jpg           # screenshot(s) for docs — same folder as README
├── index.js                 # optional barrel: routes + store module names
├── api/
│   ├── index.js             # re-exports public API functions
│   └── <resource>.js        # pure HTTP — no Vuex, no components
├── store/
│   └── <domain>.module.js   # Vuex: state + orchestration calling api/
├── routes.js                # route records for this domain only
├── views/
├── components/
├── layouts/                 # optional; or keep src/layouts/<domain>/ during migration
└── composables/             # optional UI logic
```

**Shared cross-cutting code:**

```
src/shared/
├── auth/
│   ├── api/
│   ├── store/               # authJWT (+ registration helpers)
│   └── components/          # shared LoginForm / SignupForm shells
├── router/
│   ├── index.js             # createRouter + merge route modules
│   ├── guards.js            # beforeEach, getLoginRoute
│   └── legacy-guard-compat.js
├── ui/                      # AppMessage, etc.
├── plugins/                 # vuetify, webfontloader
└── utils/                   # error.js, authJwtEndpoints.js, cryptoUtils.js
```

**Legacy shims (temporary during migration):**

```
src/store/modules/tabernaData/tabernaCartData.module.js  → re-export from apps/taberna/cart/store/
src/views/taberna/CartView.vue                           → thin wrapper or moved path alias
```

Use `@/` path aliases pointing at new locations while old import paths still work.

**App documentation:** when a sub-application is migrated under `src/apps/<domain>/`, move its `README.md` and screenshot assets from `src/views/<domain>/` to the **root of that app folder** (e.g. `src/apps/taberna/README.md`, `src/apps/taberna/taberna_vue.jpg`). Update links in the root `README.md` accordingly. Apply the same rule for Social (`src/apps/social/`), AI Lab (`src/apps/ai_lab/`), etc.

---

## Verification (every phase)

### Fast loop (local)

```bash
npm run build
npm run lint
```

### Manual smoke (per domain)

| Domain | Smoke path |
|--------|------------|
| Apps manager | `/` → list loads; `/apps_manager/search` |
| Taberna | browse → product → add to cart → checkout → success |
| Social | login → feed → post → chat → notifications |
| AI Lab | image / voice / realtime chat pages open |

### Tests (coverage-driven — see [testing.md](./testing.md))

```bash
npm run test              # watch
npm run test:run          # CI single run
npm run test:coverage     # CI gate with thresholds
```

Co-located `*.spec.js` next to source (same as `c-job-remark-tool-front`). Use `coverage/index.html` to find gaps before each refactor PR.

---

## Global Rules

1. **One phase = one PR** (~10–20 files max).
2. **Re-export shims** at old import paths until final cleanup phase.
3. **No API contract changes** — same URLs, payloads, and response shapes as today.
4. **No user-visible route changes** — `/taberna/cart`, `/social/chat`, etc. stay as-is.
5. **Extract `api/` before splitting stores** — HTTP layer first, then point Vuex actions at it.
6. **No file > ~400 lines** in production code post-refactor.
7. **No direct `axios` in views/components** after domain migration — only `api/` + store/composables.
8. **Do not migrate Vuex → Pinia** in the structure refactor; remove unused Pinia or migrate in a separate initiative.
9. **Align module names with backend apps** (`taberna_cart` → `taberna/cart`, not `tabernaData`).
10. **Keep Options API / Composition API style** of surrounding files — no mass rewrite to `<script setup>` unless the file is already being moved.

---

## Cross-Module Public APIs (do not break)

| Import / symbol | Consumers |
|-----------------|-----------|
| `store.dispatch('authJWT/login')` | taberna, social login views |
| `store.dispatch('authJWT/checkActiveApp', app)` | `MainTabernaLayout`, `MainSocialLayout` |
| `resolveJwtLoginUrl` (`authJwtEndpoints.js`) | `authJWT` login |
| `store.dispatch('tabernaCartData/getCart')` | `MainTabernaLayout`, cart/checkout views |
| `store.dispatch('socialPostData/...')` | social feed, search, trends views |
| `@/shared/ui/AppMessage.vue` | global alert via `alert` store |
| `axios-interceptor.js` | global JWT attach + refresh |

---

## Current vs Target Mapping

| Current path | Target path |
|--------------|-------------|
| `src/router/index.js` (all routes) | `src/shared/router/index.js` + `src/apps/*/routes.js` |
| `src/store/modules/tabernaData/*` | `src/apps/taberna/{cart,product,profiles}/store/` |
| `src/store/modules/socialNetworkData/*` | `src/apps/social/{posts,profiles,chat,notifications}/store/` |
| `src/store/modules/aiLabData/*` | `src/apps/ai_lab/store/` |
| `src/store/modules/authJWT.module.js` | `src/shared/auth/store/authJWT.module.js` |
| `src/store/modules/authToken.module.js` | `src/shared/auth/store/authToken.module.js` |
| `src/views/<app>/` | `src/apps/<app>/views/` (gradual move) |
| `src/components/<app>/` | `src/apps/<app>/components/` |
| `src/layouts/<app>/` | `src/apps/<app>/layouts/` or `src/shared/layouts/` |

---

## Relationship to Backend Refactor

| Backend completed | Frontend should |
|-------------------|-----------------|
| `portfolio/apps/taberna_cart/views/api/cart.py` | `src/apps/taberna/cart/api/cart.js` |
| `portfolio/apps/social_posts/views/feed.py` | `src/apps/social/posts/api/feed.js` |
| Per-app `tests/` mirror layout | `src/apps/<domain>/__tests__/` or `tests/unit/apps/<domain>/` |

Backend **structure-only** principle applies: moving files without changing what the user sees.

---

## Completion summary (June 2026)

All domain modules live under `src/apps/<domain>/` with `api/`, `store/`, `routes.js`, `views/`, `components/`, `layouts/`, per-app README, and screenshot (`*_main.jpg` / `taberna_vue.jpg`) at the app root. Router and auth are in `src/shared/router/` and `src/shared/auth/`. `src/store/index.js` imports modules from canonical paths; only `src/router/index.js` remains as a shim for `@/router`.

**Verification:** `npm run test:coverage` (229 tests) and `npm run build` pass.

---

*Frontend refactoring index. March 2026 — completed June 2026.*
