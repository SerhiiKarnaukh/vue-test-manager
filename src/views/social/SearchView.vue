<template>
  <v-main>
    <v-container class="py-6" fluid>
      <v-row class="justify-center">
        <v-col cols="12" md="5" lg="7" class="px-4">
          <v-card class="rounded-lg mb-6" elevation="2">
            <v-card-title>
              <v-form v-on:submit.prevent="submitForm">
                <v-row align="center">
                  <v-col cols="8" class="mt-4">
                    <v-text-field
                      class="rounded-lg"
                      placeholder="What are you looking for?"
                      outlined
                      dense
                      v-model.trim="query"
                      type="search"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <v-btn type="submit" color="social" class="px-6"
                      >Search</v-btn
                    >
                  </v-col>
                </v-row>
              </v-form>
            </v-card-title>
          </v-card>
          <v-card v-if="profiles.length" class="rounded-lg mb-6" elevation="2">
            <v-card-text>
              <v-row>
                <v-col
                  v-for="profile in profiles"
                  :key="profile.id"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="3"
                >
                  <v-card class="rounded-lg" elevation="2">
                    <v-card-text class="text-center">
                      <v-avatar size="125" class="mb-6">
                        <img
                          :src="profile.avatar_url"
                          aspect-ratio="1.5"
                          style="max-width: 100%"
                        />
                      </v-avatar>
                      <p class="mb-4">
                        <router-link
                          :to="{
                            name: 'profileSocial',
                            params: { slug: profile.slug },
                          }"
                        >
                          <strong>{{
                            profile.first_name + ' ' + profile.last_name
                          }}</strong>
                        </router-link>
                      </p>
                      <v-row>
                        <v-col>
                          <p class="text-xs text-gray-500">
                            {{ profile.friends_count }} friends
                          </p>
                        </v-col>
                        <v-col>
                          <p class="text-xs text-gray-500">120 posts</p>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
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
      query: '',
      profiles: [],
      posts: [],
    }
  },
  mounted() {
    document.title = 'Search | Social Network'
  },
  methods: {
    submitForm() {
      axios
        .post('/api/social-posts/search/', {
          query: this.query,
        })
        .then((response) => {
          this.profiles = response.data.profiles
          this.posts = response.data.posts
        })
        .catch((error) => {
          console.log('error:', error)
        })
    },
  },
}
</script>
<style scoped></style>
