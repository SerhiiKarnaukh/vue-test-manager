# Social Notification — Structure Refactoring Plan

**Document:** `social-notification-refactoring`  
**Status:** Planned  
**Scope:** File/folder layout only. **No** notification API changes.  
**Reference:** [README.md](./README.md)  
**Backend sibling:** [../refactor/social-notification-app-refactoring.md](../refactor/social-notification-app-refactoring.md)  
**Sibling plans:** [social-profiles-refactoring.md](./social-profiles-refactoring.md)

---

## 1. Goals and Non-Goals

### Goals

- Move **`socialNotificationData.module.js`** (~107 lines) to `src/apps/social/notifications/`.
- Extract `/api/social-notifications/*` into `api/notifications.js`.
- Colocate `NotificationsView.vue`.

### Non-Goals

- Push / WebSocket notifications (not in current frontend).
- Changing read/unread semantics.

---

## 2. Current State Inventory

| File | Lines | Role |
|------|------:|------|
| `store/.../socialNotificationData.module.js` | ~107 | list + mark read |
| `views/social/NotificationsView.vue` | ~60 | Notifications page |

### API (`/api/social-notifications/`)

| Action | Method | Endpoint |
|--------|--------|----------|
| List | GET | `/` |
| Mark read | POST | `/read/<id>/` |

### Routes

| Path | View | `authJWT` |
|------|------|-----------|
| `/social/notifications` | NotificationsView | true |

---

## 3. Target Directory Layout

```
src/apps/social/notifications/
├── api/
│   └── notifications.js
├── store/
│   └── notifications.module.js
├── views/
│   └── NotificationsView.vue
└── index.js
```

---

## 4. Phased Execution Plan

| Phase | Actions | Verification |
|-------|---------|--------------|
| 0 | Branch; smoke notifications page | build |
| 1 | `api/notifications.js` + store refactor | List + mark read |
| 2 | Move view; shim namespace | Route OK |
| 3 | Remove shims | lint + build |

**Estimated PRs:** 2.

---

## 5. Acceptance Criteria

- [ ] Notification list loads for authenticated user.
- [ ] Mark-as-read updates UI state.
- [ ] Store < ~60 lines after api extraction.

---

*End of plan.*
