<template>
  <the-navbar></the-navbar>
  <router-view />
  <the-footer></the-footer>
</template>

<script>
import TheNavbar from '@/components/ai_lab/TheNavbar.vue'
import TheFooter from '@/components/ai_lab/TheFooter.vue'
export default {
  components: { TheNavbar, TheFooter },
  setup() {
    return {}
  },
}
</script>

<style lang="scss" scoped></style>
