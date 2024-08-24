<template>
  <v-main>
    <v-container class="py-6" fluid>
      <v-row class="justify-center">
        <v-col cols="12" md="5" lg="6" class="px-4">
          <v-card class="mb-6 pa-4 rounded-lg" elevation="2">
            <v-card-text class="py-4"
              ><h2>Trend: #{{ route.params.id }}</h2></v-card-text
            >
          </v-card>
          <TheSocialPostCard
            v-for="post in posts"
            :key="post.id"
            v-bind:post="post"
          />
          <div
            v-if="state.isPostLoading"
            class="d-flex justify-center align-center"
            cols="auto"
          >
            <v-progress-circular
              color="primary"
              indeterminate
            ></v-progress-circular>
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
import { reactive, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default {
  components: {
    ThePeopleYouMayKnow,
    TheTrends,
    TheSocialPostCard,
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const state = reactive({
      isPostLoading: false,
    })

    const posts = computed(() => {
      return store.getters['socialPostData/trendPosts']
    })

    const trendNextPage = computed(
      () => store.getters['socialPostData/trendNextPage']
    )

    const handleScroll = async () => {
      const bottomReached =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
      if (bottomReached) {
        if (trendNextPage.value) {
          state.isPostLoading = true
          await store.dispatch(
            'socialPostData/fetchNextPageOfTrend',
            trendNextPage.value
          )
          state.isPostLoading = false
        }
      }
    }

    onMounted(async () => {
      await store.dispatch('setPageTitle', 'Trends')
      await store.dispatch('socialPostData/getTrendPosts', route.params.id)
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    watch(
      () => route.params.id,
      async () => {
        await store.dispatch('socialPostData/getTrendPosts', route.params.id)
      }
    )

    return {
      state,
      route,
      posts,
    }
  },
}
</script>
<style scoped></style>
