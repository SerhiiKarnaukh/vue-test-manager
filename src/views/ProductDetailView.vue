<template>
  <v-container>
    <v-main>
      <v-row
        justify="center"
        class="space px-16 pb-15"
      >
        <v-col
          cols="12"
          xl="8"
          lg="12"
          md="12"
        >
          <v-card
            color="white"
            theme="dark"
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              <v-row>
                <v-col
                  cols="6"
                  md="6"
                  sm="12"
                >
                  <div>
                    <v-card-title class="text-h5">
                      {{product.name}}
                    </v-card-title>
                    <v-card-text class="font-weight-black font-italic">${{ product.price }}</v-card-text>

                    <v-card-text>{{ product.description }}</v-card-text>

                    <v-card-actions>
                      <v-btn
                        class="ml-2"
                        variant="outlined"
                        size="default"
                        append-icon="mdi-cart"
                      >
                        Add to cart
                      </v-btn>
                    </v-card-actions>
                  </div>
                </v-col>
                <v-col
                  cols="6"
                  md="6"
                  sm="12"
                  align="center"
                >
                  <v-img
                    class="bg-white ma-3"
                    width="500"
                    :aspect-ratio="1"
                    rounded="3"
                    :src="product.get_image"
                    cover
                  ></v-img>
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
            const category_slug = this.$route.params.category_slug
            const product_slug = this.$route.params.product_slug
            await axios
                .get(`/api/v1/products/${category_slug}/${product_slug}`)
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
