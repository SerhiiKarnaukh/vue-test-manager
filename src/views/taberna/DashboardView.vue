<template>
  <v-main>
    <v-container>
      <div v-if="orders.length">
        <TheOrderSummary
          v-for="order in orders"
          v-bind:key="order.id"
          v-bind:order="order"
        />
      </div>
      <v-card-title v-else>You don't have any orders...</v-card-title>
    </v-container>
  </v-main>
</template>

<script>
import axios from 'axios'
import TheOrderSummary from '@/components/TheOrderSummary.vue'
export default {
  name: 'DashboardView',
  components: {
    TheOrderSummary,
  },
  data() {
    return {
      orders: [],
    }
  },
  mounted() {
    document.title = 'My Dashboard | Taberna'
    this.getMyOrders()
  },
  methods: {
    async getMyOrders() {
      await axios
        .get('/api/v1/orders/')
        .then((response) => {
          this.orders = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>
