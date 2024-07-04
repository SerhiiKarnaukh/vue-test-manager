<template>
  <v-main>
    <v-container class="py-6" fluid>
      <v-row class="justify-center">
        <v-col
          v-if="Object.keys(profile).length !== 0"
          cols="9"
          sm="5"
          md="3"
          lg="2"
          class="px-4"
        >
          <v-card class="rounded-lg" elevation="2">
            <v-card-text class="text-center">
              <v-avatar size="150" class="mb-6">
                <img
                  :src="
                    profile.avatar_url
                      ? profile.avatar_url
                      : state.defaultAvatar
                  "
                  style="max-width: 100%"
                />
              </v-avatar>
              <p class="mb-4">
                <strong>{{
                  profile.first_name + ' ' + profile.last_name
                }}</strong>
              </p>
              <v-row>
                <v-col v-if="profile.slug">
                  <router-link
                    :to="{
                      name: 'friendsSocial',
                      params: { slug: profile.slug },
                    }"
                  >
                    <p class="text-xs text-gray-500">
                      {{ profile.friends_count }} friends
                    </p>
                  </router-link>
                </v-col>
                <v-col>
                  <p class="text-xs text-gray-500">
                    {{ profile.posts_count }} posts
                  </p>
                </v-col>
              </v-row>
              <v-btn
                v-if="
                  $store.state.socialProfileData.user.id != profile.id &&
                  canSendFriendshipRequest
                "
                @click="sendFriendshipRequest"
                color="primary"
                class="mx-auto mt-4"
              >
                Add as Friend
              </v-btn>
              <v-btn
                v-if="$store.state.socialProfileData.user.id != profile.id"
                @click="sendMessage"
                color="social"
                class="mx-auto mt-4"
              >
                Send Message
              </v-btn>
              <v-btn
                v-if="$store.state.socialProfileData.user.id == profile.id"
                to="/social/profile/edit"
                color="social"
                class="mx-auto mt-4"
              >
                Edit Profile
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="5" lg="6" class="px-4">
          <v-card
            v-if="$store.state.socialProfileData.user.id == profile.id"
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
              </v-card-actions>
            </v-form>
          </v-card>
          <TheSocialPostCard
            v-for="post in posts"
            :key="post.id"
            v-bind:post="post"
          />
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
import { reactive, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import router from '@/router'

export default {
  components: {
    ThePeopleYouMayKnow,
    TheTrends,
    TheSocialPostCard,
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const state = reactive({
      body: '',
      defaultAvatar: store.getters['socialProfileData/defaultAvatar'],
    })

    const posts = computed(() => {
      return store.getters['socialPostData/profilePostList']
    })

    const profile = computed(() => {
      return store.getters['socialPostData/profile']
    })

    const canSendFriendshipRequest = computed(() => {
      return store.getters['socialPostData/canSendFriendshipRequest']
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

    const sendMessage = async () => {
      try {
        await store.dispatch(
          'socialChatData/getOrCreateChat',
          route.params.slug
        )
        router.push('/social/chat')
      } catch (error) {
        console.log(error)
      }
    }

    const sendFriendshipRequest = async () => {
      await store.dispatch(
        'socialProfileData/sendFriendshipRequest',
        route.params.slug
      )
      store.commit('socialPostData/setCanSendFriendshipRequest', false)
    }

    const submitForm = async () => {
      if (state.body !== '' || postImages.value.length != 0) {
        let formData = new FormData()
        formData.append('body', state.body)
        await store.dispatch('socialPostData/submitPostForm', formData)
        state.body = ''
        state.postImage = null
        store.commit('socialPostData/uploadSelectedPostImages', [])
      }
    }

    onMounted(async () => {
      window.scrollTo(0, 0)
      await store.dispatch(
        'socialPostData/getProfilePostList',
        route.params.slug
      )
      await store.dispatch('setPageTitle', profile.value.full_name)
    })

    watch(
      () => route.params.slug,
      async () => {
        await store.dispatch(
          'socialPostData/getProfilePostList',
          route.params.slug
        )
      }
    )

    return {
      state,
      posts,
      profile,
      postImages,
      sendMessage,
      sendFriendshipRequest,
      submitForm,
      chooseFiles,
      handleFileChange,
      canSendFriendshipRequest,
    }
  },
}
</script>
<style scoped></style>
