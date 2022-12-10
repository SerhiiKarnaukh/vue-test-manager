<template>
  <v-container fluid>
    <!-- https://picsum.photos/1920/1080?random -->
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
          class="mx-auto rounded-xl"
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
              :src="product.get_thumbnail"
            ></v-img>
          </div>

          <v-card-title class="">{{ product.name }}</v-card-title>
          <v-card-title class="grey--text text-grey-darken-1 caption mt-n6">
            subtitle
          </v-card-title>
          <div class="d-flex justify-space-between">
            <v-card-title class="mt-n4">${{ product.price }}</v-card-title>
            <v-btn
              variant="flat"
              color="primary"
            >Details</v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
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
