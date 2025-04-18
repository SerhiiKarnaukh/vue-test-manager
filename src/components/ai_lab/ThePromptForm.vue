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

      <v-row
        v-if="promptImages.length != 0 && !isGeneratorRoute"
        class="border-t"
      >
        <v-col
          v-for="image in promptImages"
          cols="2"
          class="text-left mb-4"
          :key="`${image.file.name}-navbar-link`"
        >
          <v-img :src="image.url" style="max-height: 100px" rounded> </v-img>
        </v-col>
      </v-row>

      <v-card-actions class="p-4 border-t">
        <div v-if="!isGeneratorRoute">
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
          <v-btn @click="chooseFiles()" color="grey darken-2" variant="flat">
            Add Images
          </v-btn>
        </div>

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

    const promptImages = computed(() => {
      return store.getters['aiLabChatData/promptImages']
    })

    const chooseFiles = () => {
      document.getElementById('fileUpload').click()
    }

    const handleFileChange = async (event) => {
      const files = event.target.files
      const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg']
      const maxFileSize = 20 * 1024 * 1024

      const validFiles = Array.from(files).filter((file) => {
        if (!allowedFormats.includes(file.type)) {
          return false
        }
        if (file.size > maxFileSize) {
          store.dispatch('alert/setMessage', {
            value: [
              `Sorry, the file "${file.name}" size cannot be larger than 20MB`,
            ],
            type: 'error',
          })
          return false
        }
        return true
      })

      const newPromptImages = validFiles.map((file) => ({
        url: URL.createObjectURL(file),
        file: file,
      }))

      if (newPromptImages.length > 0) {
        await store.dispatch(
          'aiLabChatData/uploadPromptImages',
          newPromptImages
        )
      }
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
      promptImages,
      chooseFiles,
      handleFileChange,
      submitForm,
      isGeneratorRoute,
    }
  },
}
</script>
<style scoped></style>
