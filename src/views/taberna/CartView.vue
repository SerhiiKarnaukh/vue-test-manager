<template>
  <v-main>
    <v-container>
      <v-card class="mb-5 mx-auto" max-width="800">
        <div v-if="cart.cart_items && cart.cart_items.length != 0">
          <v-card-title>Cart Summary</v-card-title>
          <v-table fixed-header hover density="comfortable">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th class="text-left">Delete</th>
              </tr>
            </thead>
            <tbody>
              <TheCartItem
                v-for="item in cart.cart_items"
                v-bind:key="item.product.id"
                v-bind:initialItem="item"
              />
            </tbody>
          </v-table>
          <v-card-text>
            <v-divider class="my-4"></v-divider>
            <div class="d-flex justify-between align-center">
              <div class="text-h6">Total Price:</div>
              <div class="text-h6">&nbsp;$ {{ cart.total }}</div>
            </div>
            <div class="d-flex justify-between align-center">
              <div class="text-h6">Tax:</div>
              <div class="text-h6">&nbsp;$ {{ cart.tax }}</div>
            </div>
            <div class="d-flex justify-between align-center">
              <div class="text-h6">Total:</div>
              <div class="text-h6">&nbsp;$ {{ cart.grand_total }}</div>
            </div>
          </v-card-text>
          <v-card-actions>
            <div class="d-flex justify-end">
              <v-btn
                variant="flat"
                color="success"
                class="mr-4"
                to="/taberna/cart/checkout"
              >
                Proceed to checkout
              </v-btn>
            </div>
          </v-card-actions>
        </div>
        <v-card-title v-else
          >You don't have any products in your cart...</v-card-title
        >
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import { useStore } from 'vuex'
import { computed, onMounted } from 'vue'
import TheCartItem from '@/components/taberna/TheCartItem.vue'
export default {
  name: 'CartView',
  components: {
    TheCartItem,
  },
  setup() {
    const store = useStore()

    const cart = computed(() => store.getters['tabernaCartData/cart'])

    onMounted(async () => {
      await store.dispatch('tabernaCartData/getCart')
    })

    return {
      cart,
    }
  },
}
</script>

<style lang="scss" scoped></style>
