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
      ></v-img
    ></v-card-text>
    <v-card-actions>
      <v-row align="center">
        <v-col cols="auto">
          <v-icon @click="likePost(post.id)" small class="mr-1"
            >mdi-thumb-up-outline</v-icon
          >
          <span>{{ likesCount }}</span>
        </v-col>
        <v-col cols="auto">
          <v-icon small class="mr-1">mdi-comment-outline</v-icon>
          <span>0</span>
        </v-col>
      </v-row>
    </v-card-actions>
    <v-dialog v-model="showModal" max-width="500">
      <v-card>
        <v-card-text>
          <app-message />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="showModal = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import axios from 'axios'
import AppMessage from '@/components/ui/AppMessage.vue'
import store from '@/store'
export default {
  name: 'TheSocialPostCard',
  props: {
    post: Object,
  },
  components: {
    AppMessage,
  },
  data() {
    return {
      likesCount: this.post.likes_count,
      showModal: false,
    }
  },
  methods: {
    likePost(id) {
      let timeoutId
      axios
        .post(`/api/social-posts/${id}/like/`)
        .then((response) => {
          if (response.data.message == 'like created') {
            this.likesCount += 1
          }
        })
        .catch((error) => {
          console.log('error', error)
          store.dispatch('setMessage', {
            value: ['You must be logged in!'],
            type: 'error',
          })
          this.showModal = true
          if (timeoutId) {
            console.log('TimeOutID', timeoutId)
            clearTimeout(timeoutId)
          }
          timeoutId = setTimeout(() => {
            this.showModal = false
          }, 5000)
          console.log('TimeOutID2', timeoutId)
        })
    },
  },
}
</script>

<style lang="scss" scoped></style>
