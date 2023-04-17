<template>
  <v-parallax src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg">
    <div
      class="d-flex flex-column fill-height justify-center align-center text-white"
    >
      <h1 class="text-h4 font-weight-thin mb-4">Taberna</h1>
      <h4 class="subheading">The best Store in the whole world!</h4>
    </div>
  </v-parallax>
  <v-container>
    <v-main class="pt-4 pt-md-16">
      <h2 class="text-center">Latest products</h2>
      <v-row class="py-5" justify="center">
        <v-col cols="10">
          <v-row>
            <TheProductCard
              v-for="product in latestProducts"
              :key="product.id"
              v-bind:product="product"
            />
          </v-row>
        </v-col>
      </v-row>
    </v-main>
  </v-container>
</template>

<script>
import axios from 'axios'
import TheProductCard from '@/components/TheProductCard.vue'
export default {
  name: 'HomeView',
  components: {
    TheProductCard,
  },
  data() {
    return {
      latestProducts: [],
    }
  },
  mounted() {
    this.getLatestProducts()
    document.title = 'Home | Taberna'
  },
  methods: {
    getLatestProducts() {
      axios
        .get('/store/api/v1/latest-products/')
        .then((response) => {
          this.latestProducts = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>
<style scoped></style>
