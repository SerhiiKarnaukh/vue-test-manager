<template>
  <v-card class="mb-5 mx-auto" max-width="1000">
    <v-card-title>Order #{{ order.id }}</v-card-title>
    <v-table fixed-header hover density="comfortable">
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in order.items" v-bind:key="item.product.id">
          <td>{{ item.product.name }}</td>
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
      return item.quantity * item.product.price
    },
    orderTotalLength(order) {
      return order.items.reduce((acc, curVal) => {
        return (acc += curVal.quantity)
      }, 0)
    },
  },
}
</script>
