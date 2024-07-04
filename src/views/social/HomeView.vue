<template>
  <v-main>
    <v-container class="py-6" fluid>
      <v-row class="justify-center">
        <v-col cols="12" md="5" lg="6" class="px-4">
          <v-card
            v-if="$store.state.authJWT.accessToken"
            class="rounded-lg mb-6"
            color="white"
            elevation="2"
          >
            <v-form @submit.prevent="submitForm" method="post">
              <v-card-text class="p-4">
                <v-textarea
                  v-model.trim="state.body"
                  class="p-4 w-full rounded-lg"
                  placeholder="What are you thinking about?"
                  color="grey lighten-3"
                  required
                ></v-textarea>
              </v-card-text>

              <v-row v-if="postImages.length != 0" class="border-t">
                <v-col
                  v-for="image in postImages"
                  cols="2"
                  class="text-left mb-4"
                  :key="`${image.file.name}-navbar-link`"
                >
                  <v-img
                    :src="image.url"
                    style="max-height: 100px"
                    class="ml-3"
                    rounded
                  >
                  </v-img>
                </v-col>
              </v-row>

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
                  @click="chooseFiles()"
                  color="grey darken-2"
                  variant="flat"
                >
                  Attach image
                </v-btn>

                <v-btn color="social darken-2" variant="flat" type="submit">
                  Post
                </v-btn>
                <v-checkbox
                  v-model="state.isPrivate"
                  hide-details
                  :append-icon="
                    state.isPrivate ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                  "
                  :label="
                    state.isPrivate ? 'It`s a private post' : 'Make it private'
                  "
                ></v-checkbox>
              </v-card-actions>
            </v-form>
          </v-card>
          <div>
            <TheSocialPostCard
              v-for="post in posts"
              :key="post.id"
              v-bind:post="post"
            />
          </div>
        </v-col>

        <v-col cols="12" md="4" lg="3" class="px-4">
          <ThePeopleYouMayKnow />
          <TheTrends />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import ThePeopleYouMayKnow from '@/components/social/ThePeopleYouMayKnow.vue'
import TheTrends from '@/components/social/TheTrends.vue'
import TheSocialPostCard from '@/components/social/TheSocialPostCard.vue'
import { reactive, onMounted, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  components: {
    ThePeopleYouMayKnow,
    TheTrends,
    TheSocialPostCard,
  },
  setup() {
    const store = useStore()
    const state = reactive({
      body: '',
      isPrivate: false,
    })

    const posts = computed(() => {
      return store.getters['socialPostData/postList']
    })

    const postImages = computed(() => {
      return store.getters['socialPostData/postImages']
    })

    const chooseFiles = () => {
      document.getElementById('fileUpload').click()
    }

    const handleFileChange = (event) => {
      const files = event.target.files
      const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg']

      const newPostImages = Array.from(files)
        .map((file) => {
          if (allowedFormats.includes(file.type)) {
            return {
              url: URL.createObjectURL(file),
              file: file,
            }
          } else {
            return null
          }
        })
        .filter(Boolean)
      store.commit('socialPostData/uploadSelectedPostImages', newPostImages)
    }

    const submitForm = async () => {
      if (state.body !== '' || postImages.value.length != 0) {
        let formData = new FormData()
        formData.append('body', state.body)
        formData.append('is_private', state.isPrivate)
        await store.dispatch('socialPostData/submitPostForm', formData)
        state.body = ''
        state.postImage = null
        state.isPrivate = false
        store.commit('socialPostData/uploadSelectedPostImages', [])
      }
    }

    onMounted(async () => {
      document.title = 'Home | Social Network'
      await store.dispatch('socialPostData/getFeed')
    })

    return {
      state,
      posts,
      postImages,
      chooseFiles,
      handleFileChange,
      submitForm,
    }
  },
}
</script>
<style scoped></style>
