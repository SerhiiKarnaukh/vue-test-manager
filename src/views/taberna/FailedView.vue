<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card color="error" max-width="400" class="mx-auto">
            <v-card-title>Payment failed</v-card-title>
            <v-card-text>
              <p>Payment failed or was cancelled. Please try again later!</p>
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
export default {
  name: 'FailedView',
  setup() {
    const store = useStore()
    onMounted(async () => {
      await store.dispatch('setPageTitle', 'Failed')
    })
    return {}
  },
}
</script>
