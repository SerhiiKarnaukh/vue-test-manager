# AI Lab

A modern single-page application built with Vue.js 3 and Vuetify 3, offering users an intuitive interface to interact with advanced AI features including text chat, image generation, voice synthesis, and multimodal input processing. Designed with responsiveness and clarity in mind, the application serves as a user-friendly control center for exploring the capabilities of GPT-4o.

### Live Demo on Firebase: <https://karnaukh-vue-test.web.app/ai-lab>

![AI Lab screenshot](https://github.com/SerhiiKarnaukh/vue-test-manager/blob/main/src/views/ai_lab/ai_lab_main.jpg)

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Pages and Routes](#pages-and-routes)
- [Architecture](#architecture)
- [Components](#components)
- [State Management](#state-management)
- [API Endpoints](#api-endpoints)
- [WebSocket Integration](#websocket-integration)
- [Related Folders](#related-folders)
- [Backend](#backend)

## Overview

Navigation is handled using **Vue Router**, while state management is powered by **Vuex**, ensuring consistent application state and seamless data flow between components and the backend API. The interface is built around a clean material design aesthetic using **Vuetify** components, with thoughtful use of loading indicators, alerts, and validation to guide users through their interactions.

Thanks to **Axios**, all HTTP communication with the backend is secure and efficient. The application gracefully handles failures, with fallback logic and detailed user notifications to ensure a smooth experience.

Overall, AI Lab's frontend brings the power of multimodal AI to end users in a clear, responsive, and engaging interface. By combining state-of-the-art AI models with an elegant frontend architecture, it provides a cutting-edge tool for real-time interaction, media generation, and experimentation.

## Key Features

- **AI-powered chat** -- Users can send questions (optionally with uploaded images) and receive concise AI-generated responses displayed in a friendly chat-like interface.
- **Real-time chat via WebSockets** -- Leveraging OpenAI's GPT-4o real-time preview API, the app enables live streaming of AI responses, delivering a dynamic conversational experience.
- **Image generation** -- Users can prompt the AI to generate images from text, preview them in the interface, and download them directly.
- **Voice generation** -- AI-generated voice messages are presented with embedded audio players, allowing users to listen to synthesized speech outputs from their text prompts.
- **Prompt image uploads** -- Users can upload custom image files (JPEG, PNG up to 20 MB) that are sent to the backend, enhancing the context for AI interactions.
- **Theme toggling** -- Light/dark theme switching via Vuetify's theme system.
- **Responsive navigation** -- Collapsible drawer menu on mobile, horizontal menu bar on desktop.

## Pages and Routes

| Route                     | View                    | Description                                |
| ------------------------- | ----------------------- | ------------------------------------------ |
| `/ai-lab`                 | `HomeView.vue`          | Funny Chat -- AI text Q&A with optional image upload |
| `/ai-lab/image-generator` | `ImageGeneratorView.vue`| Image Generator -- text-to-image creation with download |
| `/ai-lab/voice-generator` | `VoiceGeneratorView.vue`| Voice Generator -- text-to-speech with embedded player |
| `/ai-lab/realtime-chat`   | `RealtimeChatView.vue`  | Realtime Chat -- live WebSocket conversation with GPT-4o |

All routes use the `MainAILabLayout` layout, which includes the navbar, footer, and establishes the WebSocket connection on mount.

## Architecture

```
src/
├── views/ai_lab/
│   ├── HomeView.vue              # Funny Chat page
│   ├── ImageGeneratorView.vue    # Image generation page
│   ├── VoiceGeneratorView.vue    # Voice synthesis page
│   └── RealtimeChatView.vue      # Real-time WebSocket chat page
├── components/ai_lab/
│   ├── TheNavbar.vue             # Navigation bar with AI Services menu
│   ├── TheFooter.vue             # Footer with app links
│   ├── ThePromptForm.vue         # Shared prompt input form
│   └── TheRealTimeChat.vue       # WebSocket chat message list
├── layouts/ai_lab/
│   └── MainAILabLayout.vue       # Layout wrapper (navbar + footer + WS init)
└── store/modules/aiLabData/
    └── aiLabChatData.module.js   # Vuex store module for all AI Lab state
```

## Components

### ThePromptForm

The shared input component used across all AI Lab pages. It adapts its behavior based on the current route:

- **Funny Chat** (`homeAILab`) -- dispatches `getChatMessage`, shows "Add Images" button for multimodal input
- **Image Generator** (`imageGenerator`) -- dispatches `getImageMessage`, shows "Generate" button, hides image upload
- **Voice Generator** (`voiceGenerator`) -- dispatches `getVoiceMessage`, shows "Generate" button, hides image upload
- **Realtime Chat** (`realtimeChat`) -- dispatches `getRealtimeChatMessage` via WebSocket, hides image upload

Features a 500-character textarea with counter, file upload validation (JPEG/PNG, max 20 MB), and image preview thumbnails.

### TheRealTimeChat

Displays the WebSocket conversation history as a styled message list with sender/receiver alignment. User messages appear on the right (gray), AI responses on the left (light gray). Includes a loading spinner during response streaming.

### TheNavbar

Responsive app bar with:
- **AI Services** dropdown -- links to all four AI Lab pages
- **Apps Manager** dropdown -- links to the main apps list and the Django backend
- **Toggle Theme** button -- switches between light and dark themes
- Collapsible navigation drawer for mobile viewports

### TheFooter

Minimal footer with links to the apps manager and a copyright notice.

## State Management

The `aiLabChatData` Vuex module (namespaced) manages all AI Lab state:

### State

| Property                | Type       | Description                              |
| ----------------------- | ---------- | ---------------------------------------- |
| `message`               | `String`   | AI chat text response                    |
| `imageURL`              | `String`   | URL of the generated image               |
| `voiceMessage`          | `String`   | URL of the generated voice audio         |
| `errorMessage`          | `String`   | Error message for user feedback          |
| `promptImages`          | `Array`    | Uploaded image URLs for multimodal input |
| `realtimeChatWebSocket` | `WebSocket`| Active WebSocket connection              |
| `realtimeChatMessages`  | `Array`    | Chat history `[{ sender, message }]`     |

### Actions

| Action                     | Description                                         |
| -------------------------- | --------------------------------------------------- |
| `getChatMessage`           | Sends a question (+ images) to `/ai-lab/` endpoint  |
| `getImageMessage`          | Sends a prompt to `/ai-lab/image-generator/`         |
| `getVoiceMessage`          | Sends a prompt to `/ai-lab/voice-generator/`         |
| `downloadImage`            | Downloads a generated image via `/ai-lab/download-image/` |
| `uploadPromptImages`       | Uploads image files to `/ai-lab/upload-vision-images/` |
| `connectRealtimeChatSocket`| Establishes WebSocket via ephemeral token from `/ai-lab/realtime-token/` |
| `getRealtimeChatMessage`   | Sends a message through the active WebSocket connection |

## API Endpoints

All HTTP requests are made via Axios to the Django backend:

| Method | Endpoint                       | Purpose                                 |
| ------ | ------------------------------ | --------------------------------------- |
| POST   | `/ai-lab/`                     | Send chat question with optional images |
| POST   | `/ai-lab/image-generator/`     | Generate an image from a text prompt    |
| POST   | `/ai-lab/voice-generator/`     | Generate a voice message from text      |
| POST   | `/ai-lab/download-image/`      | Download a generated image as a blob    |
| POST   | `/ai-lab/upload-vision-images/`| Upload images for multimodal context    |
| POST   | `/ai-lab/realtime-token/`      | Obtain an ephemeral key for WebSocket   |

## WebSocket Integration

The real-time chat feature connects directly to **OpenAI's GPT-4o Realtime Preview API** using WebSockets:

1. On layout mount, `connectRealtimeChatSocket` requests an ephemeral token from the backend.
2. A WebSocket is opened to `wss://api.openai.com/v1/realtime` with the ephemeral key.
3. User messages are sent as `conversation.item.create` events followed by `response.create`.
4. AI responses arrive as `response.done` events containing the transcript, which is committed to the Vuex store and rendered in the chat list.

## Related Folders

- [AI Lab Components](https://github.com/SerhiiKarnaukh/vue-test-manager/tree/main/src/components/ai_lab)
- [AI Lab Vuex Store](https://github.com/SerhiiKarnaukh/vue-test-manager/tree/main/src/store/modules/aiLabData)

## Backend

The Django REST Framework backend powering AI Lab is hosted on AWS.

See [AI Lab Backend](https://django.karnaukh-webdev.com/category/django/ai-lab-back-end/)
