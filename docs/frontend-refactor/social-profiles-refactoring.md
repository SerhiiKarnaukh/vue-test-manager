# Social Profiles — Structure Refactoring Plan

**Document:** `social-profiles-refactoring`  
**Status:** Done  
**Scope:** File/folder layout only. **No** friendship or profile API changes.  
**Reference:** [README.md](./README.md)  
**Backend sibling:** [../refactor/social-profiles-app-refactoring.md](../refactor/social-profiles-app-refactoring.md)  
**Sibling plans:** [social-posts-refactoring.md](./social-posts-refactoring.md), [shared-auth-refactoring.md](./shared-auth-refactoring.md)

---

## 1. Goals and Non-Goals

### Goals

- Move **`socialProfileData.module.js`** (~228 lines) to `src/apps/social/profiles/`.
- Extract all `/api/social-profiles/*` calls into `api/`.
- Colocate profile views: `ProfileView`, `EditProfileView`, `EditPasswordView`, `FriendsView`, login/signup.

### Non-Goals

- Changing friendship request state machine.
- Merging profile store with posts store.

---

## 2. Current State Inventory

| File | Lines | Role |
|------|------:|------|
| `store/.../socialProfileData.module.js` | ~228 | me, friends, suggestions, password |
| `views/social/ProfileView.vue` | ~100 | Profile + posts dispatch |
| `views/social/EditProfileView.vue` | ~80 | Edit profile |
| `views/social/EditPasswordView.vue` | ~70 | Change password |
| `views/social/FriendsView.vue` | ~90 | Friends list |
| `views/social/LoginView.vue` | ~123 | JWT login |
| `views/social/SignupView.vue` | ~200 | Registration |
| `components/social/ThePeopleYouMayKnow.vue` | ~60 | Suggestions widget |

### API (`/api/social-profiles/`)

| Action | Endpoint |
|--------|----------|
| Current user | `GET /me/` |
| Friend request | `POST /friends/<slug>/request/` |
| Friends list | `GET /friends/<slug>/` |
| Request action | `POST /friends/<slug>/<status>/` |
| Change password | `POST /editpassword/` |
| Suggestions | `GET /friends/suggested/` |

### Routes (profiles subset)

| Path | View | `authJWT` |
|------|------|-----------|
| `/social/login`, `/social/signup` | Login, Signup | false / — |
| `/social/profile/:slug` | ProfileView | false |
| `/social/profile/edit` | EditProfileView | true |
| `/social/edit/password` | EditPasswordView | true |
| `/social/profile/:slug/friends` | FriendsView | true |

---

## 3. Target Directory Layout

```
src/apps/social/profiles/
├── api/
│   ├── profile.js
│   └── friendship.js
├── store/
│   └── profiles.module.js
├── views/
│   ├── LoginView.vue
│   ├── SignupView.vue
│   ├── ProfileView.vue
│   ├── EditProfileView.vue
│   ├── EditPasswordView.vue
│   └── FriendsView.vue
├── components/
│   └── ThePeopleYouMayKnow.vue
└── index.js

# Legacy shim
src/store/modules/socialNetworkData/socialProfileData.module.js
```

---

## 4. Phased Execution Plan

| Phase | Actions | Verification |
|-------|---------|--------------|
| 0 | Branch; smoke profile + friends + login | build |
| 1 | `api/profile.js`, `api/friendship.js` | — |
| 2 | Refactor store to use api | `me`, friends actions |
| 3 | Move views/components | Routes OK |
| 4 | Shared auth forms for login/signup | Visual parity |
| 5 | Namespace shim `socialProfileData` → `social/profiles` | cross-view dispatch |
| 6 | Remove shims | lint + build |

**Estimated PRs:** 4–5.

---

## 5. Acceptance Criteria

- [x] `GET /me/` on layout/profile load; 401 still logs out + alert.
- [x] Friend request / accept / reject unchanged.
- [x] Password edit shows same success/error alerts.
- [x] Suggestions widget loads on search/home.
- [x] Store module < ~120 lines (logic in api + thin actions).

---

*End of plan.*
