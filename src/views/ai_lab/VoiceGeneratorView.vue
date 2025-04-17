<template>
  <v-parallax src="/v_gen_3.png">
    <div
      class="d-flex flex-column fill-height justify-center align-center text-white bg-transparent-gray"
    ></div>
  </v-parallax>
  <v-container>
    <v-main class="pt-4 pt-md-16">
      <h2 class="text-center">Voice Generator</h2>
      <v-row class="py-5" justify="center">
        <v-col cols="12" md="12" lg="10" xl="8">
          <v-card v-if="isLoading || voiceMessage || errorMessage" class="pa-4">
            <div
              v-if="isLoading"
              class="d-flex justify-center align-center"
              cols="auto"
            >
              <v-progress-circular
                color="primary"
                indeterminate
              ></v-progress-circular>
            </div>
            <div v-else>
              <v-card-text v-if="errorMessage" class="text-lg-subtitle-1">{{
                errorMessage
              }}</v-card-text>

              <div v-else class="d-flex justify-center">
                <audio :src="voiceMessage" controls style="width: 100%"></audio>
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

    const message = computed(() => {
      return store.getters['aiLabChatData/message']
    })

    const isLoading = computed(() => {
      return store.getters['isLoading']
    })

    const voiceMessage = computed(() => {
      return store.getters['aiLabChatData/voiceMessage']
    })

    const errorMessage = computed(() => {
      return store.getters['aiLabChatData/errorMessage']
    })

    onMounted(async () => {
      document.title = 'Home | Voice Generator'
    })

    return {
      message,
      isLoading,
      voiceMessage,
      errorMessage,
    }
  },
}
</script>
<style scoped>
.bg-transparent-gray {
  background: linear-gradient(
    rgba(9, 30, 62, 0.7),
    rgba(9, 30, 62, 0.7)
  ); /* Use rgba() to set the alpha channel */
}
</style>
