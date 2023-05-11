<template>
  <v-main>
    <v-container class="py-6" fluid>
      <v-row class="justify-center">
        <v-col cols="12" md="5" lg="6" class="px-4">
          <div v-if="Object.keys(post).length !== 0">
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
                  v-model.trim="body"
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
import axios from 'axios'
import ThePeopleYouMayKnow from '@/components/social/ThePeopleYouMayKnow.vue'
import TheTrends from '@/components/social/TheTrends.vue'
import TheSocialPostCard from '@/components/social/TheSocialPostCard.vue'
import TheCommentItem from '@/components/social/TheCommentItem.vue'
export default {
  name: 'PostView',
  components: {
    ThePeopleYouMayKnow,
    TheTrends,
    TheSocialPostCard,
    TheCommentItem,
  },
  data() {
    return {
      post: {},
      body: '',
    }
  },
  mounted() {
    document.title = 'Post | Social Network'
    this.getPost()
  },
  methods: {
    getPost() {
      axios
        .get(`/api/social-posts/${this.$route.params.id}/`)
        .then((response) => {
          this.post = response.data.post
        })
        .catch((error) => {
          console.log('error', error)
        })
    },

    submitForm() {
      axios
        .post(`/api/social-posts/${this.$route.params.id}/comment/`, {
          body: this.body,
        })
        .then((response) => {
          this.post.comments.push(response.data)
          this.post.comments_count += 1
          this.body = ''
        })
        .catch((error) => {
          console.log('error', error)
        })
    },
  },
}
</script>
<style scoped></style>
