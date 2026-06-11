# Social Chat — Structure Refactoring Plan

**Document:** `social-chat-refactoring`  
**Status:** Done  
**Scope:** File/folder layout only. **No** WebSocket or REST chat API changes.  
**Reference:** [README.md](./README.md)  
**Backend sibling:** [../refactor/social-chat-app-refactoring.md](../refactor/social-chat-app-refactoring.md)  
**Sibling plans:** [social-profiles-refactoring.md](./social-profiles-refactoring.md)

---

## 1. Goals and Non-Goals

### Goals

- Move **`socialChatData.module.js`** (~119 lines) to `src/apps/social/chat/`.
- Extract `/api/social-chat/*` into `api/chat.js`.
- Colocate `ChatView.vue` and any chat-specific UI.

### Non-Goals

- Changing WebSocket consumer protocol (if added later on frontend).
- Real-time message push architecture (today REST polling / load on open).

---

## 2. Current State Inventory

| File | Lines | Role |
|------|------:|------|
| `store/.../socialChatData.module.js` | ~119 | threads, messages, get-or-create |
| `views/social/ChatView.vue` | ~100 | Chat UI |

### API (`/api/social-chat/`)

| Action | Method | Endpoint |
|--------|--------|----------|
| Get or create thread | GET | `/<userSlug>/get-or-create/` |
| Messages | GET | `/<threadId>/messages/` (pattern from module) |
| Send message | POST | message endpoint from module |
| Thread list | GET | `/` |

---

## 3. Target Directory Layout

```
src/apps/social/chat/
├── api/
│   └── chat.js
├── store/
│   └── chat.module.js
├── views/
│   └── ChatView.vue
└── index.js

# Legacy shim
src/store/modules/socialNetworkData/socialChatData.module.js
```

---

## 4. Phased Execution Plan

| Phase | Actions | Verification |
|-------|---------|--------------|
| 0 | Branch; smoke `/social/chat` logged in | build |
| 1 | `api/chat.js` + refactor store | Open thread + send message |
| 2 | Move `ChatView.vue` | Route OK |
| 3 | Shim `socialChatData` namespace | — |
| 4 | Remove shims | lint + build |

**Estimated PRs:** 2–3.

---

## 5. Acceptance Criteria

- [x] Chat list loads for authenticated user.
- [x] Open conversation with another user works.
- [x] Send message persists and displays.
- [x] No direct `axios` in `ChatView.vue`.

---

*End of plan.*
