<template>
  <v-app>
    <app-message />
    <component :is="layoutComponent">
      <router-view />
    </component>
  </v-app>
</template>

<script>
import AppMessage from '@/shared/ui/AppMessage.vue'
import MainAILabLayout from '@/apps/ai_lab/layouts/MainAILabLayout.vue'
import MainAppsManagerLayout from '@/apps/apps_manager/layouts/MainAppsManagerLayout.vue'
import MainSocialLayout from '@/apps/social/layouts/MainSocialLayout.vue'
import MainTabernaLayout from '@/apps/taberna/layouts/MainTabernaLayout.vue'

const layouts = {
  mainAppsManager: MainAppsManagerLayout,
  mainTaberna: MainTabernaLayout,
  mainSocial: MainSocialLayout,
  mainAILab: MainAILabLayout,
}

export default {
  name: 'App',
  components: { AppMessage },
  computed: {
    layoutComponent() {
      return layouts[this.$route.meta.layout] ?? 'div'
    },
  },
}
</script>
<style lang="scss"></style>
