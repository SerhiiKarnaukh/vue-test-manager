<template>
  <the-navbar></the-navbar>
  <router-view />
  <the-footer></the-footer>
</template>

<script>
import TheNavbar from '@/components/social/TheNavbar.vue'
import TheFooter from '@/components/social/TheFooter.vue'
import { useStore } from 'vuex'
import { computed, onBeforeMount } from 'vue'

export default {
  components: { TheNavbar, TheFooter },
  setup() {
    const store = useStore()

    const isAuthenticated = computed(() => {
      return store.getters['authJWT/isAuthenticated']
    })

    onBeforeMount(async () => {
      store.commit('setAppName', 'Social Network')
      store.commit('socialProfileData/initSocial')
      if (isAuthenticated.value) {
        await store.dispatch(
          'socialNotificationData/connectNotificationWebSocket'
        )
      }
    })
  },
}
</script>

<style lang="scss" scoped></style>
