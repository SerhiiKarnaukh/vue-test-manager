<template>
  <v-main>
    <v-container>
      <v-card class="mb-5 mx-auto" max-width="800">
        <div v-if="cartTotalLength">
          <v-card-title>Cart Summary</v-card-title>
          <v-table fixed-header hover density="comfortable">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th class="text-left">Delete</th>
              </tr>
            </thead>
            <tbody>
              <TheCartItem
                v-for="item in cart.items"
                v-bind:key="item.product.id"
                v-bind:initialItem="item"
                v-on:removeFromCart="removeFromCart"
              />
            </tbody>
          </v-table>
          <v-card-text>
            <v-divider class="my-4"></v-divider>
            <div class="d-flex justify-between align-center">
              <div class="text-h6">Items:</div>
              <div class="text-h6">{{ cartTotalLength }}</div>
            </div>
            <div class="d-flex justify-between align-center">
              <div class="text-h6">Total price:</div>
              <div class="text-h6">${{ cartTotalPrice.toFixed(2) }}</div>
            </div>
          </v-card-text>
          <v-card-actions>
            <div class="d-flex justify-end">
              <v-btn
                variant="flat"
                color="success"
                class="mr-4"
                to="/cart/checkout"
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
import TheCartItem from '@/components/TheCartItem.vue'
export default {
  name: 'CartView',
  components: {
    TheCartItem,
  },
  data() {
    return {
      cart: {
        items: [],
      },
    }
  },
  mounted() {
    this.cart = this.$store.state.cart
  },
  methods: {
    removeFromCart(item) {
      this.cart.items = this.cart.items.filter(
        (i) => i.product.id !== item.product.id
      )
    },
  },
  computed: {
    cartTotalLength() {
      return this.cart.items.reduce((acc, curVal) => {
        return (acc += curVal.quantity)
      }, 0)
    },
    cartTotalPrice() {
      return this.cart.items.reduce((acc, curVal) => {
        return (acc += curVal.product.price * curVal.quantity)
      }, 0)
    },
  },
}
</script>

<style lang="scss" scoped></style>
