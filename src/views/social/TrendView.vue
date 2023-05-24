<template>
  <v-main>
    <v-container class="py-6" fluid>
      <v-row class="justify-center">
        <v-col cols="12" md="5" lg="6" class="px-4">
          <v-card class="mb-6 pa-4 rounded-lg" elevation="2">
            <v-card-text class="py-4"
              ><h2>Trend: #{{ $route.params.id }}</h2></v-card-text
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
      posts: [],
    }
  },
  mounted() {
    document.title = 'Trends | Social Network'
    this.getFeed()
  },
  watch: {
    '$route.params.id': {
      handler: function () {
        this.getFeed()
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    getFeed() {
      axios
        .get(`/api/social-posts/?trend=${this.$route.params.id}`)
        .then((response) => {
          this.posts = response.data.posts
        })
        .catch((error) => {
          console.log('error', error)
        })
    },
  },
}
</script>
<style scoped></style>
