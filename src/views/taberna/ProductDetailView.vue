<template>
  <v-container>
    <v-main>
      <v-row justify="center" class="space px-md-16 pb-15">
        <v-col cols="12" xl="8" lg="12" md="12">
          <v-card>
            <div class="d-flex flex-no-wrap justify-space-between">
              <v-row>
                <v-col cols="12" md="6" align="center">
                  <v-carousel hide-delimiters>
                    <v-carousel-item
                      :src="product.image"
                      aspect-ratio="1.5"
                    ></v-carousel-item>
                    <v-carousel-item
                      v-for="(item, i) in product.productgallery"
                      :key="i"
                      :src="item.image"
                      cover
                    ></v-carousel-item>
                  </v-carousel>
                </v-col>
                <v-col cols="12" md="6">
                  <div>
                    <v-card-title class="text-h5">
                      {{ product.name }}
                    </v-card-title>
                    <v-card-text class="font-weight-black font-italic"
                      >${{ product.price }}</v-card-text
                    >

                    <v-card-text>{{ product.description }}</v-card-text>
                    <v-card-actions>
                      <v-col cols="3">
                        <v-text-field
                          v-model.number="state.quantity"
                          type="number"
                          min="1"
                        ></v-text-field>
                      </v-col>
                    </v-card-actions>
                  </div>
                  <v-card-actions>
                    <v-btn
                      variant="flat"
                      color="primary"
                      prepend-icon="mdi-basket"
                      @click="addToCart"
                      >Add to Cart</v-btn
                    >
                  </v-card-actions>
                  <v-snackbar v-model="state.snackbar" color="success">
                    The product was added to the cart
                    <template v-slot:actions>
                      <v-btn
                        color="black"
                        variant="text"
                        @click="state.snackbar = false"
                      >
                        Close
                      </v-btn>
                    </template>
                  </v-snackbar>
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
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { computed, reactive, onMounted, watch } from 'vue'

export default {
  name: 'ProductDetailView',

  setup() {
    const store = useStore()
    const route = useRoute()
    const state = reactive({
      quantity: 1,
      snackbar: false,
    })

    const categorySlug = route.params.category_slug
    const productSlug = route.params.product_slug

    const product = computed(
      () => store.getters['tabernaProductData/productDetail'].product
    )

    const addToCart = () => {
      if (isNaN(state.quantity) || state.quantity < 1) {
        state.quantity = 1
      }
      const item = {
        product: state.product,
        quantity: state.quantity,
      }
      store.commit('tabernaCartData/addToCart', item)
      state.snackbar = true
    }

    onMounted(async () => {
      await store.dispatch('tabernaProductData/getProductDetail', {
        categorySlug,
        productSlug,
      })
    })

    watch(product, (newProduct) => {
      if (newProduct?.name) {
        store.dispatch('setPageTitle', newProduct.name)
      }
    })

    return {
      state,
      product,
      addToCart,
    }
  },
}
</script>

<style scoped></style>
