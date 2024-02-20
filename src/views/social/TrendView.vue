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
import { onMounted, watch, computed } from 'vue'
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

    const posts = computed(() => {
      return store.getters['socialPostData/trendPosts']
    })

    onMounted(async () => {
      await store.dispatch('setPageTitle', 'Trends')
      await store.dispatch('socialPostData/getTrendPosts', route.params.id)
    })

    watch(
      () => route.params.id,
      async () => {
        await store.dispatch('socialPostData/getTrendPosts', route.params.id)
      }
    )

    return {
      route,
      posts,
    }
  },
}
</script>
<style scoped></style>
