<template>
  <v-card class="rounded-lg chat-card" elevation="2">
    <div
      v-if="messages.length === 0"
      class="d-flex flex-column align-center justify-center py-12 text-medium-emphasis"
    >
      <v-icon size="56" class="mb-3">mdi-chat-processing-outline</v-icon>
      <p class="text-body-1">Start a conversation</p>
    </div>

    <div v-else ref="chatArea" class="chat-area pa-4">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="d-flex mb-3"
        :class="isSender(msg) ? 'justify-end' : 'justify-start'"
      >
        <v-avatar
          v-if="!isSender(msg)"
          size="32"
          color="ai_lab"
          class="mr-2 flex-shrink-0 align-self-end"
        >
          <v-icon size="18" color="white">mdi-robot-outline</v-icon>
        </v-avatar>

        <div
          class="message-bubble pa-3"
          :class="isSender(msg) ? 'sender-bubble' : 'receiver-bubble'"
        >
          <div class="text-body-2 message-text">{{ msg.message }}</div>
        </div>

        <v-avatar
          v-if="isSender(msg)"
          size="32"
          color="primary"
          class="ml-2 flex-shrink-0 align-self-end"
        >
          <v-icon size="18" color="white">mdi-account</v-icon>
        </v-avatar>
      </div>

      <div v-if="isLoading" class="d-flex justify-start mb-3">
        <v-avatar
          size="32"
          color="ai_lab"
          class="mr-2 flex-shrink-0 align-self-end"
        >
          <v-icon size="18" color="white">mdi-robot-outline</v-icon>
        </v-avatar>
        <div class="typing-indicator receiver-bubble pa-3">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import { computed, ref, watch, nextTick } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const chatArea = ref(null)

    const messages = computed(() => {
      return store.getters['aiLabChatData/realtimeChatMessages']
    })

    const isLoading = computed(() => {
      return store.getters['isLoading']
    })

    const isSender = (message) => message.sender === 'me'

    const scrollToBottom = () => {
      nextTick(() => {
        if (chatArea.value) {
          chatArea.value.scrollTop = chatArea.value.scrollHeight
        }
      })
    }

    watch(messages, scrollToBottom, { deep: true })

    return {
      messages,
      isLoading,
      isSender,
      chatArea,
    }
  },
}
</script>

<style scoped>
.chat-card {
  min-height: 200px;
}

.chat-area {
  max-height: 500px;
  overflow-y: auto;
}

.message-bubble {
  max-width: 70%;
  word-wrap: break-word;
  line-height: 1.5;
}

.sender-bubble {
  background-color: #1a6fc4;
  color: #ffffff;
  border-radius: 16px 16px 4px 16px;
}

.receiver-bubble {
  background-color: #f0f0f0;
  color: #1a1a1a;
  border-radius: 16px 16px 16px 4px;
}

.message-text {
  white-space: pre-wrap;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px !important;
}

.typing-indicator .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #999;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%,
  60%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  30% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
