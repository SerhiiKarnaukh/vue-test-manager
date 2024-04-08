<template>
  <v-main>
    <v-container class="py-6" fluid>
      <v-row class="justify-center">
        <v-col cols="9" sm="5" md="3" lg="2" class="px-4">
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
                <v-col>
                  <p class="text-xs text-gray-500">
                    {{ profile.friends_count }} friends
                  </p>
                </v-col>
                <v-col>
                  <p class="text-xs text-gray-500">
                    {{ profile.posts_count }} posts
                  </p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="5" lg="7" class="px-4">
          <v-card
            v-if="friendshipRequests.length"
            class="p-4 border border-gray-200 rounded-lg mb-6"
          >
            <v-card-title class="mb-2 text-xl"
              >Friendship requests</v-card-title
            >
            <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <v-col
                  v-for="friendshipRequest in friendshipRequests"
                  :key="friendshipRequest.id"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="4"
                >
                  <v-card class="rounded-lg" elevation="2">
                    <v-card-text class="text-center">
                      <v-avatar size="125" class="mb-6">
                        <img
                          :src="
                            friendshipRequest.created_by.avatar_url
                              ? friendshipRequest.created_by.avatar_url
                              : state.defaultAvatar
                          "
                          aspect-ratio="1.5"
                          style="max-width: 100%"
                        />
                      </v-avatar>
                      <p class="mb-4">
                        <strong>
                          <router-link
                            :to="{
                              name: 'profileSocial',
                              params: {
                                slug: friendshipRequest.created_by.slug,
                              },
                            }"
                            >{{
                              friendshipRequest.created_by.first_name +
                              ' ' +
                              friendshipRequest.created_by.last_name
                            }}</router-link
                          >
                        </strong>
                      </p>
                      <v-row>
                        <v-col>
                          <p class="text-xs text-gray-500">
                            {{ friendshipRequest.created_by.friends_count }}
                            friends
                          </p>
                        </v-col>
                        <v-col>
                          <p class="text-xs text-gray-500">
                            {{ friendshipRequest.created_by.posts_count }} posts
                          </p>
                        </v-col>
                      </v-row>
                      <v-card-actions class="mt-6">
                        <v-row align="center" justify="center">
                          <v-col cols="6" lg="6" md="12" sm="6">
                            <v-btn
                              color="social darken-2"
                              variant="flat"
                              @click="
                                handleRequest(
                                  'accepted',
                                  friendshipRequest.created_by.slug
                                )
                              "
                            >
                              Accept
                            </v-btn>
                          </v-col>
                          <v-spacer></v-spacer>
                          <v-col cols="6" lg="6" md="12">
                            <v-btn
                              color="grey darken-2"
                              variant="flat"
                              @click="
                                handleRequest(
                                  'rejected',
                                  friendshipRequest.created_by.slug
                                )
                              "
                            >
                              Reject
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card-actions>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card
            v-if="friends.length"
            class="p-4 border border-gray-200 rounded-lg"
          >
            <v-card-title class="mb-2 text-xl">Friends</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <v-col
                  v-for="user in friends"
                  :key="user.id"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="4"
                >
                  <v-card class="rounded-lg" elevation="2">
                    <v-card-text class="text-center">
                      <v-avatar size="125" class="mb-6">
                        <img
                          :src="
                            user.avatar_url
                              ? user.avatar_url
                              : state.defaultAvatar
                          "
                          aspect-ratio="1.5"
                          style="max-width: 100%"
                        />
                      </v-avatar>
                      <p class="mb-4">
                        <strong>
                          <router-link
                            :to="{
                              name: 'profileSocial',
                              params: { slug: user.slug },
                            }"
                            >{{
                              user.first_name + ' ' + user.last_name
                            }}</router-link
                          >
                        </strong>
                      </p>
                      <v-row>
                        <v-col>
                          <p class="text-xs text-gray-500">
                            {{ user.friends_count }}
                            friends
                          </p>
                        </v-col>
                        <v-col>
                          <p class="text-xs text-gray-500">
                            {{ user.posts_count }} posts
                          </p>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
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
import { onMounted, computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'FriendsView',
  components: {
    ThePeopleYouMayKnow,
    TheTrends,
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const state = reactive({
      defaultAvatar: store.getters['socialProfileData/defaultAvatar'],
    })

    const profile = computed(() => {
      return store.getters['socialProfileData/currentProfile']
    })
    const friendshipRequests = computed(() => {
      return store.getters['socialProfileData/friendshipRequests']
    })
    const friends = computed(() => {
      return store.getters['socialProfileData/currentProfileFriends']
    })

    const handleRequest = async (status, slug) => {
      const payload = {
        status: status,
        slug: slug,
      }
      await store.dispatch('socialProfileData/handleFriendshipRequest', payload)
    }

    onMounted(async () => {
      await store.dispatch('setPageTitle', 'Friends')
      await store.dispatch(
        'socialProfileData/getCurrentProfileFriendsData',
        route.params.slug
      )
    })

    return {
      state,
      profile,
      friendshipRequests,
      friends,
      handleRequest,
    }
  },
}
</script>
<style scoped></style>
