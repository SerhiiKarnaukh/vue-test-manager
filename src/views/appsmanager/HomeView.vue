<template>
  <v-parallax src="/manager_bg.jpg">
    <div
      class="d-flex flex-column fill-height justify-center align-center text-white bg-transparent-gray"
    >
      <h1 class="text-h3 font-weight-thin text-center mb-4 pt-14 pt-md-0">
        Vue Applications Manager
      </h1>
    </div>
  </v-parallax>
  <v-container>
    <v-main class="pt-4 pt-md-16">
      <h2 class="text-center">Last Applications</h2>
      <v-row class="py-5" justify="center">
        <v-col cols="12">
          <v-row>
            <TheAppCard
              v-for="application in allVueApps"
              :key="application.id"
              v-bind:application="application"
            />
          </v-row>
        </v-col>
      </v-row>
    </v-main>
  </v-container>
</template>

<script>
import axios from 'axios'
import TheAppCard from '@/components/appsmanager/TheAppCard.vue'
export default {
  name: 'HomeView',
  components: {
    TheAppCard,
  },
  data() {
    return {
      allVueApps: [],
    }
  },
  mounted() {
    this.getAllVueApps()
    document.title = 'Home | Vue Applications Manager'
  },
  methods: {
    getAllVueApps() {
      axios
        .get('/api/v1/vue-apps/')
        .then((response) => {
          this.allVueApps = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>
<style scoped>
.bg-transparent-gray {
  background: linear-gradient(
    rgba(9, 30, 62, 0.7),
    rgba(9, 30, 62, 0.7)
  ); /* Use rgba() to set the alpha channel */
}
</style>
