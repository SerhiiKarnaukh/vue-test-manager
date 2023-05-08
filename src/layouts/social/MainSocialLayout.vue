<template>
  <the-navbar></the-navbar>
  <router-view />
  <the-footer></the-footer>
</template>

<script>
import TheNavbar from '@/components/social/TheNavbar.vue'
import TheFooter from '@/components/social/TheFooter.vue'
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  components: { TheNavbar, TheFooter },
  setup() {},
  beforeCreate() {
    this.$store.commit('socialUserData/initSocial')
    const token = this.$store.getters['authJWT/accessToken']
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    } else {
      axios.defaults.headers.common['Authorization'] = ''
    }
  },
  computed: {
    ...mapGetters('authJWT', ['accessToken']),
  },
  mounted() {
    if (this.accessToken) {
      const decodedToken = JSON.parse(
        window.atob(this.accessToken.split('.')[1])
      )
      const expiresAt = new Date(decodedToken.exp * 1000)
      const currentTime = new Date()

      if (expiresAt.getTime() - currentTime.getTime() <= 60 * 1000) {
        // Refresh the access token immediately if it is about to expire soon
        this.$store.dispatch('authJWT/refreshToken')
      }
      console.log('TOKEN FROM LAYOUT')
      setInterval(() => {
        this.$store.dispatch('authJWT/refreshToken')
      }, 5 * 60 * 1000) // 5 minutes
    }
  },
}
</script>

<style lang="scss" scoped></style>
