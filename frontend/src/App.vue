<template>
  <v-app>
    <the-navbar></the-navbar>

    <router-view></router-view>

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
