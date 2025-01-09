<template>
  <v-main>
    <v-container>
      <v-card-title v-if="state.loading">
        <v-row align="center" class="fill-height ma-0" justify="center">
          <v-progress-circular
            color="grey lighten-5"
            indeterminate
          ></v-progress-circular>
        </v-row>
      </v-card-title>
      <div v-else>
        <div v-if="state.orders.length">
          <TheOrderSummary
            v-for="order in state.orders"
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
import { reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import TheOrderSummary from '@/components/taberna/TheOrderSummary.vue'
export default {
  name: 'DashboardView',
  components: {
    TheOrderSummary,
  },
  setup() {
    const store = useStore()
    const state = reactive({
      orders: [],
      loading: false,
    })

    const getMyOrders = async () => {
      try {
        state.loading = true
        const response = await axios.get('taberna-profiles/api/v1/orders/')
        state.orders = response.data
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        state.loading = false
      }
    }

    onMounted(async () => {
      getMyOrders()
      await store.dispatch('setPageTitle', 'My Orders')
    })

    return {
      state,
    }
  },
}
</script>
