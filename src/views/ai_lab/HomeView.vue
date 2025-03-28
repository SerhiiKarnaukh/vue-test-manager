<template>
  <v-parallax src="/ai_lab.jpg">
    <div
      class="d-flex flex-column fill-height justify-center align-center text-white bg-transparent-gray"
    ></div>
  </v-parallax>
  <v-container>
    <v-main class="pt-4 pt-md-16">
      <h2 class="text-center">AI Lab</h2>
      <v-row class="py-5" justify="center">
        <v-col cols="12" md="12" lg="10" xl="8">
          <ThePromptForm />
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
          <v-card v-else class="pa-4">
            <v-card-text class="text-h6 text-md-h6 text-lg-subtitle-1">{{
              message
            }}</v-card-text>
          </v-card>
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

    onMounted(async () => {
      document.title = 'Home | AI Lab'
    })

    return {
      message,
      isLoading,
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
