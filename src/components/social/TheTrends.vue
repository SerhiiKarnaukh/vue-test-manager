<template>
  <v-card class="mt-6 p-4 rounded-lg" color="white" outlined>
    <v-card-title class="mb-6 text-xl">Trends</v-card-title>
    <v-card-text class="space-y-4">
      <v-row
        v-for="trend in trends"
        v-bind:key="trend.id"
        class="items-center justify-between"
      >
        <v-col class="flex items-center space-x-2">
          <p class="text-xs">
            <strong>#{{ trend.hashtag }}</strong
            ><br />
            <span class="text-gray-500">{{ trend.occurences }} posts</span>
          </p>
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <v-btn
            :to="{ name: 'trendSocial', params: { id: trend.hashtag } }"
            variant="flat"
            color="social"
            >Explore</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TheTrends',

  data() {
    return {
      trends: [],
    }
  },

  mounted() {
    this.getTrends()
  },

  methods: {
    getTrends() {
      axios
        .get('/api/social-posts/trends/')
        .then((response) => {
          this.trends = response.data
        })
        .catch((error) => {
          console.log('Error: ', error)
        })
    },
  },
}
</script>

<style lang="scss" scoped></style>
