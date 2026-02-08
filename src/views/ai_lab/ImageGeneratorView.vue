<template>
  <v-parallax src="/img_gen.png">
    <div
      class="d-flex flex-column fill-height justify-center align-center text-white bg-transparent-gray"
    ></div>
  </v-parallax>
  <v-container>
    <v-main class="pt-4 pt-md-16">
      <h2 class="text-center">Image Generator</h2>
      <v-row class="py-5" justify="center">
        <v-col cols="12" md="12" lg="10" xl="8">
          <v-card
            v-if="isLoading || imageURL || errorMessage"
            class="rounded-lg chat-card"
            elevation="2"
          >
            <div v-if="isLoading" class="d-flex pa-4">
              <v-avatar
                size="32"
                color="ai_lab"
                class="mr-3 flex-shrink-0 align-self-end"
              >
                <v-icon size="18" color="white">mdi-robot-outline</v-icon>
              </v-avatar>
              <div class="typing-indicator response-bubble pa-3">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>

            <div v-else-if="errorMessage" class="d-flex pa-4">
              <v-avatar
                size="32"
                color="ai_lab"
                class="mr-3 flex-shrink-0 mt-1"
              >
                <v-icon size="18" color="white">mdi-robot-outline</v-icon>
              </v-avatar>
              <div class="response-bubble pa-3">
                <div class="text-body-1 response-text">
                  {{ errorMessage }}
                </div>
              </div>
            </div>

            <div v-else class="pa-4">
              <v-img
                class="responsive-img rounded-lg"
                :src="imageURL"
              ></v-img>
              <div class="d-flex justify-center mt-4">
                <v-btn
                  @click="downloadImage"
                  color="primary"
                  variant="outlined"
                >
                  <v-icon start>mdi-download</v-icon>
                  Download Image
                </v-btn>
              </div>
            </div>
          </v-card>
          <ThePromptForm />
        </v-col>
      </v-row>
    </v-main>
  </v-container>
</template>

<script>
import ThePromptForm from '@/components/ai_lab/ThePromptForm.vue'
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
export default {
  components: {
    ThePromptForm,
  },
  setup() {
    const store = useStore()

    const imageURL = computed(() => {
      return store.getters['aiLabChatData/imageURL']
    })

    const isLoading = computed(() => {
      return store.getters['isLoading']
    })

    const errorMessage = computed(() => {
      return store.getters['aiLabChatData/errorMessage']
    })

    const downloadImage = async () => {
      await store.dispatch('aiLabChatData/downloadImage', imageURL.value)
    }

    onMounted(async () => {
      store.commit('aiLabChatData/clearErrorMessage')
      document.title = 'Image Generator | AI Lab'
    })

    return {
      imageURL,
      errorMessage,
      isLoading,
      downloadImage,
    }
  },
}
</script>
<style scoped>
.bg-transparent-gray {
  background: linear-gradient(rgba(9, 30, 62, 0.7), rgba(9, 30, 62, 0.7));
}

.chat-card {
  min-height: 80px;
}

.response-bubble {
  background-color: #f0f0f0;
  color: #1a1a1a;
  border-radius: 16px 16px 16px 4px;
  max-width: 85%;
  line-height: 1.6;
}

.response-text {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.responsive-img {
  max-width: 100%;
  max-height: 600px;
  height: auto;
  display: block;
  margin: 0 auto;
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
