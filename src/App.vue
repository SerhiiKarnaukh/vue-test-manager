<template>
  <v-app>
    <component :is="layout">
      <router-view />
    </component>
  </v-app>
</template>

<script>
import MainTabernaLayout from '@/layouts/taberna/MainTabernaLayout.vue'
import MainTVmanagerLayout from '@/layouts/tvmanager/MainTVmanagerLayout.vue'
import MainSocialLayout from '@/layouts/social/MainSocialLayout.vue'
export default {
  name: 'App',
  computed: {
    layout() {
      return (this.$route.meta.layout || 'div') + '-layout'
    },
  },
  components: {
    MainTabernaLayout,
    MainTVmanagerLayout,
    MainSocialLayout,
  },
}
</script>
<style lang="scss"></style>
