<template>
  <the-navbar></the-navbar>
  <router-view />
  <the-footer></the-footer>
</template>

<script>
import TheNavbar from '@/apps/apps_manager/components/TheNavbar.vue'
import TheFooter from '@/apps/apps_manager/components/TheFooter.vue'
export default {
  components: { TheNavbar, TheFooter },
  setup() {
    return {}
  },
}
</script>

<style lang="scss" scoped></style>
