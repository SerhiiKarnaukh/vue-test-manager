export default [
  {
    path: '/ai-lab',
    name: 'homeAILab',
    component: () => import('@/apps/ai_lab/views/HomeView.vue'),
    meta: {
      layout: 'mainAILab',
    },
  },
  {
    path: '/ai-lab/image-generator',
    name: 'imageGenerator',
    component: () => import('@/apps/ai_lab/views/ImageGeneratorView.vue'),
    meta: {
      layout: 'mainAILab',
    },
  },
  {
    path: '/ai-lab/voice-generator',
    name: 'voiceGenerator',
    component: () => import('@/apps/ai_lab/views/VoiceGeneratorView.vue'),
    meta: {
      layout: 'mainAILab',
    },
  },
  {
    path: '/ai-lab/realtime-chat',
    name: 'realtimeChat',
    component: () => import('@/apps/ai_lab/views/RealtimeChatView.vue'),
    meta: {
      layout: 'mainAILab',
    },
  },
]
