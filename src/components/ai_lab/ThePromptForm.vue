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
          @keydown="handleKeydown"
        ></v-textarea>
      </v-card-text>
      <div
        v-if="state.isLoading"
        class="d-flex justify-center align-center mb-4"
        cols="auto"
      >
        <v-progress-circular
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
      <v-row
        v-else-if="promptImages.length != 0 && shouldShowAddImages"
        class="border-t"
      >
        <v-col
          v-for="image in promptImages"
          cols="2"
          class="text-left mb-4"
          :key="`${image}-navbar-link`"
        >
          <v-img :src="image" style="max-height: 100px" rounded> </v-img>
        </v-col>
      </v-row>

      <v-card-actions class="p-4 border-t">
        <div v-if="shouldShowAddImages">
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
      isLoading: false,
    })

    const generatorRoutes = ['imageGenerator', 'voiceGenerator']

    const isGeneratorRoute = computed(() =>
      generatorRoutes.includes(route.name)
    )

    const shouldShowAddImages = computed(() => {
      return !['imageGenerator', 'voiceGenerator', 'realtimeChat'].includes(
        route.name
      )
    })

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
        state.isLoading = true
        await store.dispatch(
          'aiLabChatData/uploadPromptImages',
          newPromptImages
        )
        state.isLoading = false
      }
    }

    const enterToSendRoutes = [
      'realtimeChat',
      'homeAILab',
      'imageGenerator',
      'voiceGenerator',
    ]

    const handleKeydown = (event) => {
      if (!enterToSendRoutes.includes(route.name)) return
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        submitForm()
      }
    }

    const submitForm = async () => {
      if (!state.body) return

      const actionMap = {
        imageGenerator: 'aiLabChatData/getImageMessage',
        voiceGenerator: 'aiLabChatData/getVoiceMessage',
        homeAILab: 'aiLabChatData/getChatMessage',
        realtimeChat: 'aiLabChatData/getRealtimeChatMessage',
      }

      const action = actionMap[route.name]
      if (!action) return

      const message = state.body
      state.body = ''

      if (route.name !== 'realtimeChat') {
        store.commit('setIsLoading', true)
      }

      await store.dispatch(action, message)

      if (route.name !== 'realtimeChat') {
        store.commit('setIsLoading', false)
      }
    }

    return {
      state,
      promptImages,
      chooseFiles,
      handleFileChange,
      submitForm,
      handleKeydown,
      isGeneratorRoute,
      shouldShowAddImages,
    }
  },
}
</script>
<style scoped></style>
