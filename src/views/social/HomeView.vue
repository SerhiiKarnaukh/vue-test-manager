<template>
  <v-main>
    <v-container class="py-6" fluid>
      <v-row class="justify-center">
        <v-col cols="12" md="5" lg="6" class="px-4">
          <TheCreatePostForm v-if="$store.state.authJWT.accessToken" />
          <div>
            <TheSocialPostCard
              v-for="post in posts"
              :key="post.id"
              v-bind:post="post"
            />
            <div
              v-if="state.isLoading"
              class="d-flex justify-center align-center"
              cols="auto"
            >
              <v-progress-circular
                color="primary"
                indeterminate
              ></v-progress-circular>
            </div>
          </div>
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
import { reactive, onMounted, onUnmounted, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  components: {
    ThePeopleYouMayKnow,
    TheTrends,
    TheSocialPostCard,
    TheCreatePostForm,
  },
  setup() {
    const store = useStore()
    const state = reactive({
      isLoading: false,
    })

    const posts = computed(() => {
      return store.getters['socialPostData/postList']
    })

    const postsNextPage = computed(
      () => store.getters['socialPostData/postsNextPage']
    )

    onMounted(async () => {
      document.title = 'Home | Social Network'
      await store.dispatch('socialPostData/getFeed')
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    const handleScroll = async () => {
      const bottomReached =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
      if (bottomReached) {
        if (postsNextPage.value) {
          state.isLoading = true
          await store.dispatch(
            'socialPostData/fetchNextPageOfPosts',
            postsNextPage.value
          )
          state.isLoading = false
        }
      }
    }

    return {
      state,
      posts,
    }
  },
}
</script>
<style scoped></style>
