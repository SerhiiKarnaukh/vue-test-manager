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
        <v-col cols="12">
          <v-row>
            <p>{{ message }}</p>
          </v-row>
        </v-col>
      </v-row>
    </v-main>
  </v-container>
</template>

<script>
import { reactive, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
export default {
  setup() {
    const store = useStore()
    const state = reactive({
      isLoading: false,
    })

    const message = computed(() => {
      return store.getters['aiLabChatData/message']
    })

    onMounted(async () => {
      document.title = 'Home | AI Lab'
      await store.dispatch('aiLabChatData/getChatMessage')
    })

    return {
      state,
      message,
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
