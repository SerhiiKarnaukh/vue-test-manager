<template>
  <v-parallax src="/bg-1.jpg">
    <div
      class="d-flex flex-column fill-height justify-center align-center text-white bg-transparent-gray"
    >
      <h1 class="text-h2 font-weight-thin mb-4 pt-16 pt-md-0">Taberna</h1>
      <h4 class="subheading pb-14 pb-md-0">
        The best Store in the whole world!
      </h4>
    </div>
  </v-parallax>
  <v-container>
    <v-main class="pt-4 pt-md-16">
      <h2 class="text-center">Latest products</h2>
      <v-row class="py-5" justify="center">
        <v-col cols="10">
          <v-row>
            <TheProductCard
              v-for="product in latestProducts"
              :key="product.id"
              v-bind:product="product"
            />
          </v-row>
        </v-col>
      </v-row>
    </v-main>
  </v-container>
</template>

<script>
import { useStore } from 'vuex'
import { computed, onMounted } from 'vue'
import TheProductCard from '@/components/taberna/TheProductCard.vue'

export default {
  name: 'HomeView',
  components: {
    TheProductCard,
  },
  setup() {
    const store = useStore()

    const latestProducts = computed(
      () => store.getters['tabernaProductData/latestProducts']
    )

    onMounted(async () => {
      await store.dispatch('tabernaProductData/getLatestProducts')
      await store.dispatch('setPageTitle', 'Home')
    })

    return {
      latestProducts,
    }
  },
}
</script>
<style scoped>
.bg-transparent-gray {
  background-color: rgba(
    128,
    128,
    128,
    0.5
  ); /* Use rgba() to set the alpha channel */
}
</style>
