<template>
  <v-app class="background">
    <the-navbar></the-navbar>
    <router-view />
    <the-footer></the-footer>
  </v-app>
</template>

<script>
import TheNavbar from "@/components/TheNavbar.vue";
import TheFooter from "@/components/TheFooter.vue";

export default {
  name: 'App',
  components: {TheNavbar, TheFooter},

  data: () => ({
    //
  }),
}
</script>
