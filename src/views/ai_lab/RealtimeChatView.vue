<template>
  <v-parallax src="/realtime_chat.png">
    <div
      class="d-flex flex-column fill-height justify-center align-center text-white bg-transparent-gray"
    ></div>
  </v-parallax>
  <v-container>
    <v-main class="pt-4 pt-md-16">
      <h2 class="text-center">Realtime Chat</h2>
      <v-row class="py-5" justify="center">
        <v-col cols="12" md="12" lg="10" xl="8">
          <TheRealTimeChat />
          <ThePromptForm />
        </v-col>
      </v-row>
    </v-main>
  </v-container>
</template>

<script>
import ThePromptForm from '@/components/ai_lab/ThePromptForm.vue'
import TheRealTimeChat from '@/components/ai_lab/TheRealTimeChat.vue'
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
export default {
  components: {
    TheRealTimeChat,
    ThePromptForm,
  },
  setup() {
    const store = useStore()

    const isLoading = computed(() => {
      return store.getters['isLoading']
    })

    onMounted(async () => {
      document.title = 'Realtime Chat | AI Lab'
    })

    return {
      isLoading,
    }
  },
}
</script>
<style scoped>
.bg-transparent-gray {
  background: linear-gradient(rgba(9, 30, 62, 0.7), rgba(9, 30, 62, 0.7));
}
</style>
