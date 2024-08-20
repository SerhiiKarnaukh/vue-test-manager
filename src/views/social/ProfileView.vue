<template>
  <v-main>
    <v-container class="py-6" fluid>
      <v-row class="justify-center">
        <v-col v-if="state.loading" cols="9" sm="5" md="3" lg="2" class="px-4">
          <div class="d-flex justify-center align-center" cols="auto">
            <v-progress-circular
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div>
        </v-col>
        <v-col
          v-else-if="Object.keys(profile).length !== 0"
          cols="9"
          sm="5"
          md="3"
          lg="2"
          class="px-4"
        >
          <v-card class="rounded-lg" elevation="2">
            <v-card-text class="text-center">
              <v-avatar size="150" class="mb-6">
                <img
                  :src="
                    profile.avatar_url
                      ? profile.avatar_url
                      : state.defaultAvatar
                  "
                  style="max-width: 100%"
                />
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
              <v-alert
                v-if="canSendFriendshipRequest == 'rejected'"
                type="error"
                :icon="false"
                text="The friend request was rejected. Please try again later..."
              >
              </v-alert>
              <div v-else>
                <v-btn
                  v-if="
                    $store.state.socialProfileData.user.id != profile.id &&
                    canSendFriendshipRequest
                  "
                  @click="sendFriendshipRequest"
                  color="primary"
                  class="mx-auto mt-4"
                >
                  Add as Friend
                </v-btn>
                <v-btn
                  v-if="$store.state.socialProfileData.user.id != profile.id"
                  @click="sendMessage"
                  color="social"
                  class="mx-auto mt-4"
                >
                  Send Message
                </v-btn>
                <v-btn
                  v-if="$store.state.socialProfileData.user.id == profile.id"
                  to="/social/profile/edit"
                  color="social"
                  class="mx-auto mt-4"
                >
                  Edit Profile
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="5" lg="6" class="px-4">
          <TheCreatePostForm
            v-if="$store.state.socialProfileData.user.id == profile.id"
          />
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
import ThePeopleYouMayKnow from '@/components/social/ThePeopleYouMayKnow.vue'
import TheTrends from '@/components/social/TheTrends.vue'
import TheSocialPostCard from '@/components/social/TheSocialPostCard.vue'
import TheCreatePostForm from '@/components/social/TheCreatePostForm.vue'
import { reactive, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import router from '@/router'

export default {
  components: {
    ThePeopleYouMayKnow,
    TheTrends,
    TheSocialPostCard,
    TheCreatePostForm,
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const state = reactive({
      defaultAvatar: store.getters['socialProfileData/defaultAvatar'],
      loading: true,
    })

    const posts = computed(() => {
      return store.getters['socialPostData/profilePostList']
    })

    const profile = computed(() => {
      return store.getters['socialPostData/profile']
    })

    const canSendFriendshipRequest = computed(() => {
      return store.getters['socialPostData/canSendFriendshipRequest']
    })

    const sendMessage = async () => {
      try {
        await store.dispatch(
          'socialChatData/getOrCreateChat',
          route.params.slug
        )
        router.push('/social/chat')
      } catch (error) {
        console.log(error)
      }
    }

    const sendFriendshipRequest = async () => {
      await store.dispatch(
        'socialProfileData/sendFriendshipRequest',
        route.params.slug
      )
      store.commit('socialPostData/setCanSendFriendshipRequest', false)
    }

    onMounted(async () => {
      window.scrollTo(0, 0)
      await store.dispatch(
        'socialPostData/getProfilePostList',
        route.params.slug
      )
      state.loading = false
      await store.dispatch('setPageTitle', profile.value.full_name)
    })

    watch(
      () => route.params.slug,
      async () => {
        state.loading = true
        await store.dispatch(
          'socialPostData/getProfilePostList',
          route.params.slug
        )
        state.loading = false
      }
    )

    return {
      state,
      posts,
      profile,
      sendMessage,
      sendFriendshipRequest,
      canSendFriendshipRequest,
    }
  },
}
</script>
<style scoped></style>
