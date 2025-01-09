<template>
  <the-navbar></the-navbar>
  <router-view />
  <the-footer></the-footer>
</template>

<script>
import TheNavbar from '@/components/social/TheNavbar.vue'
import TheFooter from '@/components/social/TheFooter.vue'
import { useStore } from 'vuex'
import { onBeforeMount } from 'vue'

export default {
  components: { TheNavbar, TheFooter },
  setup() {
    const store = useStore()

    onBeforeMount(async () => {
      store.commit('setAppName', 'Social Network')
      await store.dispatch('authJWT/checkActiveApp', 'social')
      store.commit('socialProfileData/initSocial')
      await store.dispatch(
        'socialNotificationData/connectNotificationWebSocket'
      )
    })
  },
}
</script>

<style lang="scss" scoped></style>
