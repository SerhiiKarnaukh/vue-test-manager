<template>
  <v-container>
    <v-main>
      <v-row
        justify="center"
        class="space px-md-16 pb-15"
      >
        <v-col
          cols="12"
          xl="8"
          lg="12"
          md="12"
        >
          <v-card>
            <div class="d-flex flex-no-wrap justify-space-between">
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  align="center"
                >
                  <v-carousel hide-delimiters>
                    <v-carousel-item
                      :src="product.thumbnail"
                      cover
                    ></v-carousel-item>
                    <v-carousel-item
                      v-for="(item,i) in product.images"
                      :key="i"
                      :src="item"
                      cover
                    ></v-carousel-item>
                  </v-carousel>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <div>
                    <v-card-title class="text-h5">
                      {{product.name}}
                    </v-card-title>
                    <v-card-text class="font-weight-black font-italic">${{ product.price }}</v-card-text>

                    <v-card-text>{{ product.description }}</v-card-text>
                  </div>
                </v-col>
              </v-row>
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
    name: 'ProductDetailView',
    data() {
        return {
            product: {},
            quantity: 1
        }
    },
    mounted() {
        this.getProduct()
    },
    methods: {
        async getProduct() {
            const product_id = this.$route.params.product_id
            await axios
                .get(`/products/${product_id}`)
                .then(response => {
                    this.product = response.data
                })
                .catch(error => {
                    console.log(error)
                })
        },
    }
}
</script>

<style scoped>
</style>
