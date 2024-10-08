<template>
  <v-card class="mb-6 pa-4 rounded-lg" elevation="2">
    <v-row align="center">
      <v-col cols="auto">
        <v-avatar size="50">
          <img
            :src="
              post.created_by.avatar_url
                ? post.created_by.avatar_url
                : state.defaultAvatar
            "
            style="max-width: 100%"
          />
        </v-avatar>
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
        <v-menu v-if="isAuthenticated" scroll-strategy="close" flat="true">
          <template v-slot:activator="{ props }">
            <v-btn
              style="box-shadow: none"
              icon="mdi-dots-vertical"
              v-bind="props"
              variant="text"
              size="x-small"
            >
              <v-icon size="26px">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-if="
                $store.state.socialProfileData.user.id != post.created_by.id
              "
            >
              <v-list-item-title>
                <v-btn @click="reportPost" class="pl-0" variant="text"
                  ><v-icon size="24px" class="pr-1"
                    >mdi-flag-variant-outline</v-icon
                  >
                  Report Post
                </v-btn>
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                $store.state.socialProfileData.user.id == post.created_by.id
              "
            >
              <v-list-item-title>
                <v-btn @click="deletePost" class="pl-0" variant="text"
                  ><v-icon size="24px" class="pr-1">mdi-delete</v-icon>
                  Delete Post
                </v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <v-card-text class="py-4"
      >{{ post.body }}
      <template v-if="post.attachments.length">
        <v-img
          class="mt-4"
          v-for="image in post.attachments"
          v-bind:key="image.id"
          :src="image.image_url"
          rounded
        >
        </v-img>
      </template>
    </v-card-text>
    <v-card-actions>
      <v-row align="center">
        <v-col cols="auto">
          <v-icon
            @click="likePost(post.id)"
            color="iconColor"
            small
            class="mr-1"
            >mdi-thumb-up-outline</v-icon
          >
          <span>{{ likesCount }}</span>
        </v-col>
        <v-col cols="auto">
          <router-link :to="{ name: 'postSocial', params: { id: post.id } }">
            <v-icon small class="mr-1" color="iconColor"
              >mdi-comment-outline</v-icon
            >
          </router-link>
          <span>{{ post.comments_count }} comments</span>
        </v-col>
        <v-col v-if="post.is_private" cols="auto">
          <v-icon small class="mr-1">mdi-eye-off-outline</v-icon>
          <span>Private</span>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'
import { reactive, computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'TheSocialPostCard',
  props: {
    post: Object,
  },
  setup(props) {
    const store = useStore()
    const state = reactive({
      defaultAvatar: store.getters['socialProfileData/defaultAvatar'],
    })

    const isAuthenticated = computed(
      () => store.getters['authJWT/isAuthenticated']
    )

    const likesCount = ref(props.post.likes_count)

    const reportPost = async () => {
      await store.dispatch('socialPostData/reportPost', props.post.id)
    }

    const deletePost = async () => {
      await store.dispatch('socialPostData/deletePost', props.post.id)
    }

    const likePost = async (id) => {
      try {
        const response = await axios.post(`/api/social-posts/${id}/like/`)
        if (response.data.message === 'like created') {
          likesCount.value += 1
        }
      } catch (error) {
        console.error('error', error)
        store.dispatch('alert/setMessage', {
          value: ['You must be logged in!'],
          type: 'error',
        })
      }
    }

    watch(
      () => props.post.likes_count,
      (newLikesCount) => {
        likesCount.value = newLikesCount
      }
    )

    return {
      state,
      isAuthenticated,
      reportPost,
      deletePost,
      likesCount,
      likePost,
    }
  },
}
</script>

<style lang="scss" scoped></style>
