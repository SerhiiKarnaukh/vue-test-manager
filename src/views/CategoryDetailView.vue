<template>
  <v-container>
    <v-main class="pt-4 pt-md-16">
      <v-row class="py-5" justify="center">
        <h2>{{ category.name }}</h2>

        <v-col cols="12">
          <v-row>
            <TheProductCard
              v-for="product in category.products"
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
import axios from 'axios'
import TheProductCard from '@/components/TheProductCard.vue'
export default {
  name: 'CategoryDetailView',
  components: {
    TheProductCard,
  },
  data() {
    return {
      category: {
        products: [],
      },
    }
  },
  mounted() {
    this.getCategory()
  },
  watch: {
    $route(to) {
      if (to.name === 'Category') {
        this.getCategory()
      }
    },
  },
  methods: {
    async getCategory() {
      const categorySlug = this.$route.params.category_slug
      axios
        .get(`/api/v1/products/${categorySlug}/`)
        .then((response) => {
          this.category = response.data
          document.title = this.category.name + ' | Taberna'
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>
<style scoped></style>
