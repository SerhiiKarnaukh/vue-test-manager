<template>
  <v-container>
    <v-main class="pt-16 pt-md-14">
      <v-row class="py-5" justify="center">
        <h2>Search term: "{{ query }}"</h2>

        <v-col cols="12" class="pt-8 pt-md-14">
          <v-row v-if="allVueApps.length > 0">
            <TheAppCard
              v-for="application in allVueApps"
              :key="application.id"
              :application="application"
            />
          </v-row>
          <v-row v-else justify="center">
            <h3>Nothing was found.</h3>
          </v-row>
        </v-col>
      </v-row>
    </v-main>
  </v-container>
</template>

<script>
import axios from 'axios'
import TheAppCard from '@/components/appsmanager/TheAppCard.vue'
export default {
  name: 'SearchView',
  components: {
    TheAppCard,
  },
  data() {
    return {
      allVueApps: [],
      query: '',
    }
  },
  mounted() {
    document.title = 'Search | Vue Applications Manager'
    let uri = window.location.search.substring(1)
    let params = new URLSearchParams(uri)
    if (params.get('query')) {
      this.query = params.get('query')
      this.performSearch()
    }
  },
  methods: {
    async performSearch() {
      await axios
        .post('/api/v1/vue-apps/search/', { query: this.query })
        .then((response) => {
          this.allVueApps = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>
