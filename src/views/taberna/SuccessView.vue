<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card max-width="400" class="mx-auto">
            <v-card-title>Thank You!</v-card-title>
            <v-card-text>
              <p>Your order will be processed within 48 hours</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
<script>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default {
  name: 'SuccessView',
  setup() {
    const store = useStore()
    const route = useRoute()
    onMounted(async () => {
      await store.dispatch('setPageTitle', 'Success')
      const sessionId = route.query.session_id
      if (sessionId) {
        await store.dispatch('tabernaCartData/placeOrderStatus', {
          status: 'success',
          stripeSessionId: sessionId,
        })
      }
    })
    return {}
  },
}
</script>
