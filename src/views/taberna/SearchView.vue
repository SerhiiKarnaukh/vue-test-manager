<template>
  <v-container>
    <v-main class="pt-4 pt-md-16">
      <v-row class="py-5" justify="center">
        <h2>Search term: "{{ query }}"</h2>

        <v-col cols="12">
          <v-row>
            <TheProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
            />
          </v-row>
        </v-col>
      </v-row>
    </v-main>
  </v-container>
</template>

<script>
import axios from 'axios'
import TheProductCard from '@/components/taberna/TheProductCard.vue'
export default {
  name: 'SearchView',
  components: {
    TheProductCard,
  },
  data() {
    return {
      products: [],
      query: '',
    }
  },
  mounted() {
    document.title = 'Search | Taberna'
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
        .post('/store/api/v1/products/search/', { query: this.query })
        .then((response) => {
          this.products = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>
