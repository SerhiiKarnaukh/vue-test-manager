<template>
  <v-main>
    <v-container class="py-6" fluid>
      <v-row class="justify-center">
        <v-col cols="9" sm="5" md="3" lg="2" class="px-4">
          <v-card class="py-4 rounded-lg text-center" elevation="2">
            <v-img
              src="https://i.pravatar.cc/300?img=70"
              class="mb-6 rounded-full mx-auto"
              width="150"
              height="150"
              aspect-ratio="1.5"
              ><template v-slot:placeholder>
                <v-row align="center" class="fill-height ma-0" justify="center">
                  <v-progress-circular
                    color="grey lighten-5"
                    indeterminate
                  ></v-progress-circular>
                </v-row> </template
            ></v-img>

            <v-card-title class="pa-0">
              <span class="headline">{{
                profile.first_name + ' ' + profile.last_name
              }}</span>
            </v-card-title>

            <v-card-subtitle class="mb-2">
              <v-row
                class="mx-auto d-flex justify-space-between"
                style="max-width: 200px"
              >
                <v-col cols="auto">
                  <span class="text-caption font-weight-light grey-text"
                    >182 friends</span
                  >
                </v-col>
                <v-col cols="auto">
                  <span class="text-caption font-weight-light grey-text"
                    >120 posts</span
                  >
                </v-col>
              </v-row>
            </v-card-subtitle>
          </v-card>
        </v-col>

        <v-col cols="12" md="5" lg="6" class="px-4">
          <v-card
            v-if="$store.state.socialUserData.user.id == profile.id"
            class="rounded-lg mb-6"
            color="white"
            elevation="2"
          >
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
      profile: {},
      body: '',
    }
  },
  mounted() {
    document.title = 'Home | Social Network'
    this.getFeed()
  },
  methods: {
    getFeed() {
      const slug = this.$route.params.slug
      if (slug) {
        axios
          .get(`/api/social-posts/profile/${slug}/`)
          .then((response) => {
            this.posts = response.data.posts
            this.profile = response.data.profile
          })
          .catch((error) => {
            console.log('error', error)
          })
      }
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
  watch: {
    '$route.params.slug': function () {
      this.getFeed()
    },
  },
}
</script>
<style scoped></style>
