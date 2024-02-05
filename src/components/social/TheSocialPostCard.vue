<template>
  <v-card class="mb-6 pa-4 rounded-lg" elevation="2">
    <v-row align="center">
      <v-col cols="auto">
        <v-avatar size="50">
          <img :src="post.created_by.avatar_url" style="max-width: 100%"
        /></v-avatar>
      </v-col>
      <v-col>
        <div class="text-overline">
          <router-link
            :to="{
              name: 'profileSocial',
              params: { slug: post.created_by.slug },
            }"
          >
            {{ post.created_by.first_name + ' ' + post.created_by.last_name }}
          </router-link>
        </div>
        <div class="text-caption">{{ post.created_at_formatted }} ago</div>
      </v-col>
      <v-col class="text-right">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-col>
    </v-row>
    <v-card-text class="py-4"
      >{{ post.body }}
      <v-img
        class="mt-4"
        src="https://images.unsplash.com/photo-1661956602868-6ae368943878?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80"
        rounded
      ></v-img>
    </v-card-text>
    <v-card-actions>
      <v-row align="center">
        <v-col cols="auto">
          <v-icon @click="likePost(post.id)" small class="mr-1"
            >mdi-thumb-up-outline</v-icon
          >
          <span>{{ likesCount }}</span>
        </v-col>
        <v-col cols="auto">
          <router-link :to="{ name: 'postSocial', params: { id: post.id } }">
            <v-icon small class="mr-1" color="black"
              >mdi-comment-outline</v-icon
            >
          </router-link>
          <span>{{ post.comments_count }} comments</span>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'
import store from '@/store'
export default {
  name: 'TheSocialPostCard',
  props: {
    post: Object,
  },
  data() {
    return {
      likesCount: this.post.likes_count,
    }
  },
  methods: {
    likePost(id) {
      axios
        .post(`/api/social-posts/${id}/like/`)
        .then((response) => {
          if (response.data.message == 'like created') {
            this.likesCount += 1
          }
        })
        .catch((error) => {
          console.log('error', error)
          store.dispatch('alert/setMessage', {
            value: ['You must be logged in!'],
            type: 'error',
          })
        })
    },
  },
}
</script>

<style lang="scss" scoped></style>
