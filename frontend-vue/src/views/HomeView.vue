<template>
  <v-parallax src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg">
    <div class="d-flex flex-column fill-height justify-center align-center text-white">
      <h1 class="text-h4 font-weight-thin mb-4">
        Super Shop
      </h1>
      <h4 class="subheading">
        Create your own style!
      </h4>
    </div>
  </v-parallax>
  <v-container fluid>
    <v-main>
      <v-row
        justify="center"
        class="space px-16 pb-5"
      >
        <v-col
          cols="12"
          xs="12"
          sm="6"
          md="4"
          v-for="product in latestProducts"
          :key="product.id"
        >
          <v-card
            class="mx-auto rounded"
            max-width="300"
            color=""
            flat
            outlined
          >
            <div
              align="center"
              justify="center"
            >
              <v-img
                max-height="300"
                max-width="300"
                contain
                :src="product.get_image"
              ></v-img>
            </div>

            <v-card-title class="">{{ product.name }}</v-card-title>
            <v-card-title class="grey--text text-grey-darken-1 caption mt-n6">
              {{ product.description }}
            </v-card-title>
            <div class="d-flex justify-space-between">
              <v-card-title class="mt-n1">${{ product.price }}</v-card-title>
              <v-btn
                variant="flat"
                color="primary"
              >Details</v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-main>

  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'HomeView',
  data() {
    return {
        latestProducts: [],
    }
  },
  mounted() {
    this.getLatestProducts()
  },
  methods: {
    getLatestProducts() {
        axios
            .get('/api/v1/latest-products/')
            .then(response => {
                this.latestProducts = response.data
            })
            .catch(error => {
                console.log(error)
            })
    }
  }
};
</script>
<style scoped>
</style>
