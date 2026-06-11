# Frontend Testing — Coverage-Driven Plan

**Reference project:** `c-job-remark-tool-front` (Vitest + `@vitest/coverage-v8`)  
**Config:** [vitest.config.mjs](../../vitest.config.mjs)

---

## Stack

| Tool | Role |
|------|------|
| **Vitest** | Test runner (Vite-native) |
| **@vitest/coverage-v8** | Istanbul-compatible coverage via V8 |
| **jsdom** | Browser-like environment |
| **@vue/test-utils** | Vue component mounting (when needed) |

---

## Scripts

```bash
npm run test            # watch mode
npm run test:run        # single run (CI-friendly)
npm run test:coverage   # single run + coverage report
```

Coverage output:

- `coverage/` — HTML + lcov (gitignored)
- Terminal summary after `test:coverage`

---

## Conventions (mirror remark-tool)

1. **Co-located specs** — `src/**/<module>.spec.js` next to the file under test.
2. **No `__tests__` mirror tree** — coverage drives which production files lack specs.
3. **Pure logic first** — `utils/`, `api/` (after refactor), Vuex modules, composables.
4. **Component tests** — add when a view has non-trivial behaviour; mock Vuex/router/axios.
5. **One spec file per production module** unless file exceeds ~400 lines (split like remark-tool).

---

## Coverage policy

| Setting | Value |
|---------|-------|
| Provider | `v8` |
| Include | `src/**/*.{js,vue}` |
| Exclude | `*.spec.js`, `src/tests/**`, `src/main.js`, `src/plugins/**`, `src/assets/**` |
| Global thresholds | none (whole-app % is low until more domains are covered) |
| Per-file thresholds | enforced for modules that already have `*.spec.js` |
| CI gate | `npm run test:coverage` — all tests green + per-file thresholds |

Raise thresholds gradually as domains gain specs (taberna → social → ai_lab).

---

## Suggested test order (aligned with refactor)

| Phase | Target | Spec location |
|-------|--------|---------------|
| 0 ✅ | `authJwtEndpoints`, `error`, `authJWT`, `authToken`, `alert`, `useVuelidateErrorMessages` | done |
| 1 ✅ | `http/axiosInterceptors.js`, `shared/router/guards.js` | done |
| 2 ✅ | Taberna cart + orders api/store | `src/apps/taberna/cart/**`, `src/apps/taberna/orders/**` |
| 3 ✅ | Taberna product, social posts/profiles/chat/notifications, ai_lab | `src/apps/**` |
| 4 ✅ | Social posts api (`posts`, `search`, `trends`, `feed`, `actions`) | co-located `*.spec.js` |

Use `coverage/index.html` to find untested files before each refactor PR.

---

## CI

`.github/workflows/firebase-hosting-merge.yml`:

1. **test** job — `npm run test:coverage`
2. **build_and_deploy** — runs only if tests pass

---

*Testing guide. March 2026.*
