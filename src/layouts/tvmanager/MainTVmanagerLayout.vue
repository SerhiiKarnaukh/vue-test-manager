<template>
  <the-navbar></the-navbar>
  <router-view />
  <the-footer></the-footer>
</template>

<script>
import TheNavbar from '@/components/tvmanager/TheNavbar.vue'
import TheFooter from '@/components/tvmanager/TheFooter.vue'
export default {
  components: { TheNavbar, TheFooter },
  setup() {
    return {}
  },
}
</script>

<style lang="scss" scoped></style>
