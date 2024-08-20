<template>
  <v-main>
    <v-container class="py-6" fluid>
      <v-row class="justify-center">
        <v-col cols="12" md="5" lg="6" class="px-4">
          <v-card
            v-if="state.loading"
            class="mb-6 pa-4 rounded-lg"
            elevation="2"
          >
            <div class="d-flex justify-center align-center" cols="auto">
              <v-progress-circular
                color="primary"
                indeterminate
              ></v-progress-circular>
            </div>
          </v-card>

          <div v-else-if="Object.keys(post).length !== 0">
            <TheSocialPostCard v-bind:post="post" />
          </div>
          <div v-for="comment in post.comments" :key="comment.id">
            <TheCommentItem v-bind:comment="comment" />
          </div>
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
                  placeholder="What do you think?"
                  color="grey lighten-3"
                  required
                ></v-textarea>
              </v-card-text>

              <v-card-actions class="p-4 border-t">
                <v-btn color="social darken-2" variant="flat" type="submit">
                  Comment
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
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
import TheCommentItem from '@/components/social/TheCommentItem.vue'
import { reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'PostView',
  components: {
    ThePeopleYouMayKnow,
    TheTrends,
    TheSocialPostCard,
    TheCommentItem,
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const state = reactive({
      body: '',
      loading: true,
    })

    const post = computed(() => {
      return store.getters['socialPostData/post']
    })

    const submitForm = async () => {
      const payload = {
        postId: route.params.id,
        commentBody: state.body,
      }
      if (state.body !== '') {
        await store.dispatch('socialPostData/submitPostCommentForm', payload)
        state.body = ''
      }
    }

    onMounted(async () => {
      await store.dispatch('setPageTitle', 'Post')
      await store.dispatch('socialPostData/getPostData', route.params.id)
      state.loading = false
    })

    return {
      state,
      post,
      submitForm,
    }
  },
}
</script>
<style scoped></style>
