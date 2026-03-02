<template>
  <v-app>
    <app-message />
    <component :is="layout">
      <router-view />
    </component>
  </v-app>
</template>

<script>
import AppMessage from '@/components/ui/AppMessage.vue'
import MainTabernaLayout from '@/layouts/taberna/MainTabernaLayout.vue'
import MainAppsManagerLayout from '@/layouts/appsmanager/MainAppsManagerLayout.vue'
import MainSocialLayout from '@/layouts/social/MainSocialLayout.vue'
import MainAILabLayout from '@/layouts/ai_lab/MainAILabLayout.vue'
import MainHyper3dLayout from '@/layouts/hyper3d/MainHyper3dLayout.vue'
import MainF1Layout from '@/layouts/f1/MainF1Layout.vue'
import F1AuthLayout from '@/layouts/f1/F1AuthLayout.vue'
export default {
  name: 'App',
  computed: {
    layout() {
      return (this.$route.meta.layout || 'div') + '-layout'
    },
  },
  components: {
    AppMessage,
    MainTabernaLayout,
    MainAppsManagerLayout,
    MainSocialLayout,
    MainAILabLayout,
    MainHyper3dLayout,
    MainF1Layout,
    F1AuthLayout,
  },
}
</script>
<style lang="scss"></style>
