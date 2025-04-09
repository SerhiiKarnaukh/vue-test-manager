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
          <v-card v-if="isLoading || message" class="pa-4">
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
            <v-card-text v-else class="py-4">
              <v-img class="responsive-img" :src="message" rounded> </v-img>
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

    const downloadImage = async () => {
      try {
        const response = await fetch(message.value)
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'generated-image.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Error downloading image:', error)
      }
    }

    onMounted(async () => {
      document.title = 'Home | Image Generator'
    })

    return {
      message,
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
