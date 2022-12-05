<template>
  <v-app>
    <the-navbar></the-navbar>
    <v-container>
      <router-view></router-view>
    </v-container>
    <the-footer></the-footer>
  </v-app>

</template>

<script>
import TheNavbar from "@/components/TheNavbar.vue";
import TheFooter from "@/components/TheFooter.vue";

export default {
  name:'App',
  components: {TheNavbar, TheFooter}
}


</script>
