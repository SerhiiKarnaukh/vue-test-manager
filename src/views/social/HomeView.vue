<template>
  <v-main>
    <v-container class="py-6" fluid>
      <v-row class="justify-center">
        <v-col cols="12" md="5" lg="6" class="px-4">
          <v-card class="rounded-lg mb-6" color="white" elevation="2">
            <v-form @submit.prevent="submitForm" method="post">
              <v-card-text class="p-4">
                <v-textarea
                  v-model.trim="body"
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
import axios from 'axios'
import ThePeopleYouMayKnow from '@/components/social/ThePeopleYouMayKnow.vue'
import TheTrends from '@/components/social/TheTrends.vue'
import TheSocialPostCard from '@/components/social/TheSocialPostCard.vue'
export default {
  components: {
    ThePeopleYouMayKnow,
    TheTrends,
    TheSocialPostCard,
  },
  data() {
    return {
      posts: [],
      body: '',
    }
  },
  mounted() {
    document.title = 'Home | Social Network'
    this.getFeed()
  },
  methods: {
    getFeed() {
      axios
        .get('/api/social-posts/')
        .then((response) => {
          this.posts = response.data
        })
        .catch((error) => {
          console.log('error', error)
        })
    },

    submitForm() {
      axios
        .post('/api/social-posts/create/', {
          body: this.body,
        })
        .then((response) => {
          this.posts.unshift(response.data)
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
