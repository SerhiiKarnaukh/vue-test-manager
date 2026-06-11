# AI Lab — Structure Refactoring Plan

**Document:** `ai_lab-refactoring`  
**Status:** Done  
**Scope:** File/folder layout only. **No** OpenAI integration or endpoint behaviour changes.  
**Reference:** [README.md](./README.md)  
**Backend sibling:** [../refactor/ai-lab-app-refactoring.md](../refactor/ai-lab-app-refactoring.md)

---

## 1. Goals and Non-Goals

### Goals

- Move **`aiLabChatData.module.js`** (~230 lines) to `src/apps/ai_lab/`.
- Split **REST** (`/ai-lab/`, vision, voice) from **WebSocket** (realtime OpenAI) into separate api modules.
- Colocate all ai_lab views and components.

### Non-Goals

- Changing OpenAI model IDs or WebSocket URL.
- Adding unrelated 3D visualization modules.

---

## 2. Current State Inventory

| File | Lines | Role |
|------|------:|------|
| `apps/ai_lab/store/aiLab.module.js` | ~230 | chat, image, voice, realtime WS |
| `apps/ai_lab/views/HomeView.vue` | ~50 | Landing |
| `apps/ai_lab/views/ImageGeneratorView.vue` | ~80 | Image gen |
| `apps/ai_lab/views/VoiceGeneratorView.vue` | ~80 | Voice gen |
| `apps/ai_lab/views/RealtimeChatView.vue` | ~60 | Realtime UI |
| `apps/ai_lab/components/ThePromptForm.vue` | ~120 | Shared prompt form |
| `apps/ai_lab/components/TheRealTimeChat.vue` | ~100 | Realtime message list |
| `apps/ai_lab/components/TheNavbar.vue` | ~40 | Nav |
| `apps/ai_lab/components/TheFooter.vue` | ~30 | Footer |
| `apps/ai_lab/layouts/MainAILabLayout.vue` | ~20 | Shell |

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
src/apps/ai_lab/
├── README.md
├── ai_lab_main.jpg
├── api/
│   ├── chat.js
│   ├── image.js
│   ├── voice.js
│   └── realtime.js             # token fetch only; WS in store
├── store/
│   └── aiLab.module.js
├── routes.js
├── views/
├── components/
└── layouts/
    └── MainAILabLayout.vue
```

---

## 4. Phased Execution Plan

| Phase | Actions | Verification |
|-------|---------|--------------|
| 0 | Branch; smoke all 4 ai-lab pages | build |
| 1 | Extract `api/chat.js`, `api/image.js`, `api/voice.js`, `api/realtime.js` | — |
| 2 | Refactor store to call api | Text + image + voice |
| 3 | Extract WS logic in store | Realtime page |
| 4 | Move views, components, layout | Routes |
| 5 | Remove legacy paths | lint + build |

**Estimated PRs:** 4–5.

---

## 5. Acceptance Criteria

- [x] Image and voice generators return same responses / errors.
- [x] Realtime chat connects and exchanges messages.
- [x] Vision image upload/delete unchanged.
- [x] WebSocket URL and auth headers unchanged.
- [x] Store orchestration only — no raw `axios` in views.

---

*End of plan.*
