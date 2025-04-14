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
          <v-card v-if="isLoading || imageURL || errorMessage" class="pa-4">
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
              <v-card-text v-else class="py-4">
                <v-img class="responsive-img" :src="imageURL" rounded> </v-img>
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
              </v-card-text>
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
      document.title = 'Home | Image Generator'
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
  background: linear-gradient(
    rgba(9, 30, 62, 0.7),
    rgba(9, 30, 62, 0.7)
  ); /* Use rgba() to set the alpha channel */
}
.responsive-img {
  max-width: 100%;
  max-height: 600px;
  height: auto;
  display: block;
  margin: 0 auto;
}
</style>
