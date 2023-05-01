<template>
  <the-navbar></the-navbar>
  <router-view />
  <the-footer></the-footer>
</template>

<script>
import axios from 'axios'
import TheNavbar from '@/components/social/TheNavbar.vue'
import TheFooter from '@/components/social/TheFooter.vue'

export default {
  components: { TheNavbar, TheFooter },
  setup() {},
  beforeCreate() {
    this.$store.commit('socialUserData/initSocial')
    this.$store.dispatch('authJWT/initJWT')
    const token = this.$store.getters['authJWT/token']
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    } else {
      axios.defaults.headers.common['Authorization'] = ''
    }
  },
}
</script>

<style lang="scss" scoped></style>
