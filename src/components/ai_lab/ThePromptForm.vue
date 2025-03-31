<template>
  <v-card class="rounded-lg mt-6" color="white" elevation="2">
    <v-form @submit.prevent="submitForm" method="post">
      <v-card-text class="p-4">
        <v-textarea
          v-model.trim="state.body"
          class="p-4 w-full rounded-lg"
          placeholder="How can I help?"
          color="grey lighten-3"
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
        <v-btn @click="chooseFiles()" color="grey darken-2" variant="flat">
          Attach image
        </v-btn>

        <v-btn color="ai_lab darken-2" variant="flat" type="submit">
          Ask Me
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { reactive } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const state = reactive({
      body: '',
    })

    const chooseFiles = () => {
      //   document.getElementById('fileUpload').click()
      store.commit(
        'aiLabChatData/setChatMessage',
        'Working with files in progress!'
      )
    }

    const handleFileChange = (event) => {
      console.log(event)
    }

    const submitForm = async () => {
      if (state.body !== '') {
        store.commit('setIsLoading', true)
        await store.dispatch('aiLabChatData/getChatMessage', state.body)
        store.commit('setIsLoading', false)
      }
    }

    return {
      state,
      chooseFiles,
      handleFileChange,
      submitForm,
    }
  },
}
</script>
<style scoped></style>
