# AI Lab — Structure Refactoring Plan

**Document:** `ai-lab-refactoring`  
**Status:** Planned  
**Scope:** File/folder layout only. **No** OpenAI integration or endpoint behaviour changes.  
**Reference:** [README.md](./README.md)  
**Backend sibling:** [../refactor/ai-lab-app-refactoring.md](../refactor/ai-lab-app-refactoring.md)

---

## 1. Goals and Non-Goals

### Goals

- Move **`aiLabChatData.module.js`** (~230 lines) to `src/apps/ai-lab/`.
- Split **REST** (`/ai-lab/`, vision, voice) from **WebSocket** (realtime OpenAI) into separate api modules.
- Colocate all ai_lab views and components.

### Non-Goals

- Changing OpenAI model IDs or WebSocket URL.
- Adding unrelated 3D visualization modules.

---

## 2. Current State Inventory

| File | Lines | Role |
|------|------:|------|
| `store/modules/aiLabData/aiLabChatData.module.js` | ~230 | chat, image, voice, realtime WS |
| `views/ai_lab/HomeView.vue` | ~50 | Landing |
| `views/ai_lab/ImageGeneratorView.vue` | ~80 | Image gen |
| `views/ai_lab/VoiceGeneratorView.vue` | ~80 | Voice gen |
| `views/ai_lab/RealtimeChatView.vue` | ~60 | Realtime UI |
| `components/ai_lab/ThePromptForm.vue` | ~120 | Shared prompt form |
| `components/ai_lab/TheRealTimeChat.vue` | ~100 | Realtime message list |
| `components/ai_lab/TheNavbar.vue` | ~40 | Nav |
| `components/ai_lab/TheFooter.vue` | ~30 | Footer |
| `layouts/ai_lab/MainAILabLayout.vue` | ~20 | Shell |

### API (backend `ai_lab`)

| Action | Method | Endpoint |
|--------|--------|----------|
| Text chat | POST | `/ai-lab/` |
| Realtime token | POST | `/ai-lab/realtime-token/` |
| Vision image delete | DELETE | `/ai-lab/delete-vision-image/` |
| Image / voice | POST | paths in module (~lines 143, 196) |

### WebSocket (external)

| Connection | URL |
|------------|-----|
| OpenAI Realtime | `wss://api.openai.com/v1/realtime?model=...` |

### Routes

| Path | View |
|------|------|
| `/ai-lab` | HomeView |
| `/ai-lab/image-generator` | ImageGeneratorView |
| `/ai-lab/voice-generator` | VoiceGeneratorView |
| `/ai-lab/realtime-chat` | RealtimeChatView |

---

## 3. Target Directory Layout

```
src/apps/ai-lab/
├── api/
│   ├── chat.js
│   ├── image.js
│   ├── voice.js
│   └── realtime.js             # token fetch only; WS in composables/
├── composables/
│   └── useRealtimeChat.js      # WebSocket lifecycle from store
├── store/
│   └── aiLab.module.js
├── routes.js
├── views/
├── components/
├── layouts/
│   └── MainAILabLayout.vue
└── index.js
```

---

## 4. Phased Execution Plan

| Phase | Actions | Verification |
|-------|---------|--------------|
| 0 | Branch; smoke all 4 ai-lab pages | build |
| 1 | Extract `api/chat.js`, `api/image.js`, `api/voice.js`, `api/realtime.js` | — |
| 2 | Refactor store to call api | Text + image + voice |
| 3 | Extract `useRealtimeChat` composable from store WS logic | Realtime page |
| 4 | Move views, components, layout | Routes |
| 5 | Remove `aiLabData` shim | lint + build |

**Estimated PRs:** 4–5.

---

## 5. Acceptance Criteria

- [ ] Image and voice generators return same responses / errors.
- [ ] Realtime chat connects and exchanges messages.
- [ ] Vision image upload/delete unchanged.
- [ ] WebSocket URL and auth headers unchanged.
- [ ] Store orchestration only — no raw `axios` in views.

---

*End of plan.*
