<template>
  <v-card class="mb-5 pb-2 mx-auto" max-width="1000">
    <v-card-title>Order #{{ order.order_number }}</v-card-title>
    <v-card-subtitle>Order Date: {{ order.created_at }}</v-card-subtitle>
    <div v-if="order.payment">
      <v-card-subtitle>Status: {{ order.payment.status }}</v-card-subtitle>
      <v-card-subtitle
        >Payment Method: {{ order.payment.payment_method }}</v-card-subtitle
      >
    </div>
    <v-card-subtitle>Order Tax: ${{ order.tax }}</v-card-subtitle>
    <v-card-subtitle>Total Amount: ${{ order.order_total }}</v-card-subtitle>

    <v-table fixed-header hover density="comfortable">
      <thead>
        <tr>
          <th>Image</th>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in order.order_products" v-bind:key="item.id">
          <td>
            <v-img style="max-height: 75px" :src="item.product.image">
              <template v-slot:placeholder>
                <v-row align="center" class="fill-height ma-0" justify="center">
                  <v-progress-circular
                    color="grey lighten-5"
                    indeterminate
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </td>
          <td>
            <router-link :to="item.product.get_absolute_url">{{
              item.product.name
            }}</router-link>
            <div v-if="item.variations.length" class="text-grey text-body-2">
              <p v-for="variation in item.variations" :key="variation.id">
                {{ variation.variation_category }}:
                {{ variation.variation_value }}
              </p>
            </div>
          </td>
          <td>${{ item.product.price }}</td>
          <td>{{ item.quantity }}</td>
          <td>${{ getItemTotal(item).toFixed(2) }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script>
export default {
  name: 'TheOrderSummary',
  props: {
    order: Object,
  },
  methods: {
    getItemTotal(item) {
      return item.quantity * item.product_price
    },
  },
}
</script>
