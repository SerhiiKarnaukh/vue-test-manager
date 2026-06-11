<template>
  <v-main>
    <v-container>
      <v-card-title v-if="loading">
        <v-row align="center" class="fill-height ma-0" justify="center">
          <v-progress-circular
            color="grey lighten-5"
            indeterminate
          ></v-progress-circular>
        </v-row>
      </v-card-title>
      <div v-else>
        <div v-if="orders.length">
          <TheOrderSummary
            v-for="order in orders"
            v-bind:key="order.id"
            v-bind:order="order"
          />
        </div>
        <v-card max-width="700" class="mx-auto" v-else>
          <v-card-title>You don't have any orders...</v-card-title>
        </v-card>
      </div>
    </v-container>
  </v-main>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import TheOrderSummary from '../components/TheOrderSummary.vue'

export default {
  name: 'DashboardView',
  components: {
    TheOrderSummary,
  },
  setup() {
    const store = useStore()

    const orders = computed(() => store.getters['tabernaProfileData/orders'])
    const loading = computed(
      () => store.getters['tabernaProfileData/ordersLoading']
    )

    onMounted(async () => {
      await store.dispatch('tabernaProfileData/getMyOrders')
      await store.dispatch('setPageTitle', 'My Orders')
    })

    return {
      orders,
      loading,
    }
  },
}
</script>
