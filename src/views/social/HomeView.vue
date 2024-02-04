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

              <v-card-actions class="p-4 border-t">
                <v-btn color="grey darken-2" variant="flat">
                  Attach image
                </v-btn>

                <v-btn color="social darken-2" variant="flat" type="submit">
                  Post
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
          <div v-if="!$store.state.authJWT.accessToken">
            <TheSocialPostCard
              v-for="post in posts"
              :key="post.id"
              v-bind:post="post"
            />
          </div>
          <div v-if="$store.state.authJWT.accessToken">
            <TheSocialPostCard
              v-for="post in friendsPostList"
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
    })

    const posts = computed(() => {
      return store.getters['socialPostData/postList']
    })

    const friendsPostList = computed(() => {
      return store.getters['socialPostData/friendsPostList']
    })

    const submitForm = async () => {
      if (state.body !== '') {
        await store.dispatch('socialPostData/submitPostForm', state.body)
        state.body = ''
      }
    }

    onMounted(async () => {
      document.title = 'Home | Social Network'
      await store.dispatch('socialPostData/getFeed')
    })

    return {
      state,
      posts,
      friendsPostList,
      submitForm,
    }
  },
}
</script>
<style scoped></style>
