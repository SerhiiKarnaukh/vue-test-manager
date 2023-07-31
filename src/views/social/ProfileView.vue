<template>
  <v-main>
    <v-container class="py-6" fluid>
      <v-row class="justify-center">
        <v-col cols="9" sm="5" md="3" lg="2" class="px-4">
          <v-card class="rounded-lg" elevation="2">
            <v-card-text class="text-center">
              <v-avatar size="150" class="mb-6">
                <img :src="profile.avatar_url" style="max-width: 100%" />
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
                v-if="$store.state.socialUserData.user.id != profile.id"
                @click="sendFriendshipRequest"
                color="primary"
                class="mx-auto mt-4"
              >
                Add as Friend
              </v-btn>
              <v-btn
                v-if="$store.state.socialUserData.user.id != profile.id"
                @click="sendMessage"
                color="social"
                class="mx-auto mt-4"
              >
                Send Message
              </v-btn>
              <v-btn
                v-if="$store.state.socialUserData.user.id == profile.id"
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
          <app-message />
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
import AppMessage from '@/components/ui/AppMessage.vue'
import ThePeopleYouMayKnow from '@/components/social/ThePeopleYouMayKnow.vue'
import TheTrends from '@/components/social/TheTrends.vue'
import TheSocialPostCard from '@/components/social/TheSocialPostCard.vue'
import store from '@/store'
export default {
  components: {
    ThePeopleYouMayKnow,
    TheTrends,
    TheSocialPostCard,
    AppMessage,
  },
  data() {
    return {
      posts: [],
      profile: {},
      body: '',
    }
  },
  mounted() {
    document.title = 'Profile | Social Network'
    this.getFeed()
  },
  methods: {
    sendMessage() {
      axios
        .get(`/api/social-chat/${this.$route.params.slug}/get-or-create/`)
        .then((response) => {
          console.log(response.data)

          this.$router.push('/social/chat')
        })
        .catch((error) => {
          console.log('error', error)
          store.dispatch('setMessage', {
            value: ['You must be logged in!'],
            type: 'error',
          })
        })
    },
    sendFriendshipRequest() {
      axios
        .post(
          `/api/social-profiles/friends/${this.$route.params.slug}/request/`
        )
        .then((response) => {
          console.log('data', response.data)
          if (response.data.message == 'request already sent') {
            store.dispatch('setMessage', {
              value: ['The request has already been sent!'],
              type: 'error',
            })
          } else {
            store.dispatch('setMessage', {
              value: ['The request was sent!'],
              type: 'success',
            })
          }
        })
        .catch((error) => {
          console.log('error', error)
          store.dispatch('setMessage', {
            value: ['You must be logged in!'],
            type: 'error',
          })
        })
    },
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
