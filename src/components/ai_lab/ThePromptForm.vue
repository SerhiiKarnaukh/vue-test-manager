<template>
  <v-card class="rounded-lg mt-6" color="white" elevation="2">
    <v-form @submit.prevent="submitForm" method="post">
      <v-card-text class="p-4">
        <v-textarea
          v-model.trim="state.body"
          class="p-4 w-full rounded-lg"
          placeholder="How can I help?"
          color="grey lighten-3"
          :counter="500"
          maxlength="500"
          required
        ></v-textarea>
      </v-card-text>

      <v-card-actions class="p-4 border-t">
        <v-file-input
          id="fileUpload"
          style="display: none"
          accept="image/png, image/jpeg, image/bmp"
          placeholder=""
          variant="solo"
          prepend-icon=""
          multiple
          flat
          @change="handleFileChange"
        ></v-file-input>
        <v-btn
          v-if="!isGeneratorRoute"
          to="/ai-lab/image-generator"
          color="grey darken-2"
          variant="flat"
        >
          Image Generator
        </v-btn>

        <v-btn color="ai_lab darken-2" variant="flat" type="submit">
          {{ isGeneratorRoute ? 'Generate' : 'Ask Me' }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  setup() {
    const store = useStore()
    const route = useRoute()
    const state = reactive({
      body: '',
    })

    const generatorRoutes = ['imageGenerator', 'voiceGenerator']
    const isGeneratorRoute = computed(() =>
      generatorRoutes.includes(route.name)
    )

    const chooseFiles = () => {
      //   document.getElementById('fileUpload').click()
    }

    const handleFileChange = (event) => {
      console.log(event)
    }

    const submitForm = async () => {
      if (state.body !== '') {
        store.commit('setIsLoading', true)
        if (route.name === 'imageGenerator') {
          await store.dispatch('aiLabChatData/getImageMessage', state.body)
        } else if (route.name === 'voiceGenerator') {
          await store.dispatch('aiLabChatData/getVoiceMessage', state.body)
        } else {
          await store.dispatch('aiLabChatData/getChatMessage', state.body)
        }
        store.commit('setIsLoading', false)
      }
    }

    return {
      state,
      chooseFiles,
      handleFileChange,
      submitForm,
      isGeneratorRoute,
    }
  },
}
</script>
<style scoped></style>
