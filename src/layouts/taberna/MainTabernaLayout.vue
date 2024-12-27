<template>
  <the-navbar></the-navbar>
  <router-view />
  <the-footer></the-footer>
</template>

<script>
import TheNavbar from '@/components/taberna/TheNavbar.vue'
import TheFooter from '@/components/taberna/TheFooter.vue'
import { useStore } from 'vuex'
import { onBeforeMount } from 'vue'
export default {
  components: { TheNavbar, TheFooter },
  setup() {
    const store = useStore()

    onBeforeMount(async () => {
      store.commit('setAppName', 'Taberna E-com')
      store.commit('tabernaCartData/initializeStore')
    })
  },
}
</script>

<style lang="scss" scoped></style>
