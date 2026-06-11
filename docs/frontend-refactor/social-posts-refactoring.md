# Social Posts — Structure Refactoring Plan

**Document:** `social-posts-refactoring`  
**Status:** Planned  
**Scope:** File/folder layout only. **No** feed, search, or trend API changes.  
**Reference:** [README.md](./README.md)  
**Backend sibling:** [../refactor/social-posts-app-refactoring.md](../refactor/social-posts-app-refactoring.md)  
**Sibling plans:** [social-profiles-refactoring.md](./social-profiles-refactoring.md)

---

## 1. Goals and Non-Goals

### Goals

- Split **`socialPostData.module.js`** (~294 lines) — **largest social store**.
- Extract all `/api/social-posts/*` HTTP into `api/` (feed, detail, create, search, trends, actions).
- Move **`axios.post(.../like/)`** from `TheSocialPostCard.vue` into store or api.
- Organize views: `HomeView`, `PostView`, `SearchView`, `TrendView` + post components.

### Non-Goals

- Changing pagination (`next` URL) behaviour.
- Rewriting feed algorithms (backend concern).

---

## 2. Current State Inventory

| File | Lines | Role |
|------|------:|------|
| `store/.../socialPostData.module.js` | ~294 | 13 axios call sites |
| `components/social/TheSocialPostCard.vue` | ~160 | like **direct axios**, report/delete via store |
| `components/social/TheCreatePostForm.vue` | ~120 | create post |
| `components/social/TheTrends.vue` | ~50 | trends sidebar |
| `views/social/HomeView.vue` | ~80 | feed |
| `views/social/PostView.vue` | ~80 | single post |
| `views/social/SearchView.vue` | ~180 | search posts + profiles |
| `views/social/TrendView.vue` | ~60 | trend feed |

### API (`/api/social-posts/`)

| Action | Method | Path |
|--------|--------|------|
| Feed | GET | `/` |
| Create | POST | `/create/` |
| Detail | GET | `/<id>/` |
| Profile posts | GET | `/profile/<slug>/` |
| Comment | POST | `/<id>/comment/` |
| Search | POST | `/search/` |
| Trends | GET | `/trends/` |
| By trend | GET | `/?trend=<id>` |
| Like | POST | `/<id>/like/` |
| Report | POST | `/<id>/report/` |
| Delete | DELETE | `/<id>/delete/` |

### Suggested `api/` modules (mirror backend views)

| Module | Backend analogue |
|--------|------------------|
| `api/feed.js` | `views/feed.py` |
| `api/detail.js` | `views/detail.py` |
| `api/create.js` | `views/create.py` |
| `api/comments.js` | `views/comments.py` |
| `api/search.js` | `views/search.py` |
| `api/trends.js` | `views/trends.py` |
| `api/actions.js` | `views/actions.py` (like, report, delete) |

---

## 3. Target Directory Layout

```
src/apps/social/posts/
├── api/
│   ├── feed.js
│   ├── detail.js
│   ├── create.js
│   ├── comments.js
│   ├── search.js
│   ├── trends.js
│   └── actions.js
├── store/
│   └── posts.module.js         # < ~150 lines; pagination helpers in composables/
├── composables/
│   └── usePostPagination.js    # next-page URL handling
├── views/
│   ├── HomeView.vue
│   ├── PostView.vue
│   ├── SearchView.vue
│   └── TrendView.vue
├── components/
│   ├── TheSocialPostCard.vue
│   ├── TheCreatePostForm.vue
│   └── TheTrends.vue
└── index.js
```

---

## 4. Phased Execution Plan

| Phase | Actions | Verification |
|-------|---------|--------------|
| 0 | Branch; record manual smoke checklist | build |
| 1 | Create `api/*` with pure functions; unit tests per file | Vitest |
| 2 | Refactor store actions one group at a time (feed → detail → search → trends → actions) | Incremental smoke |
| 3 | Move like from `TheSocialPostCard` to `api/actions` + store | Like toggle works |
| 4 | Extract `usePostPagination` from duplicated next-page logic | Infinite scroll |
| 5 | Move views/components; shim `socialPostData` | All social post routes |
| 6 | Remove shims | lint + build |

**Estimated PRs:** 5–6. **Highest priority** social module.

---

## 5. Acceptance Criteria

- [ ] Home feed loads and paginates.
- [ ] Create post with attachments works.
- [ ] Search returns posts + profiles.
- [ ] Trends list and trend detail feed work.
- [ ] Like, comment, report, delete unchanged.
- [ ] No `axios` in `TheSocialPostCard.vue` or post views.
- [ ] `socialPostData.module.js` shim removed after migration.

---

*End of plan.*
