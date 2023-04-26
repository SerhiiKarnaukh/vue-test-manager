<template>
  <v-col cols="12" lg="4" sm="6">
    <v-card class="mx-auto pb-2">
      <v-img :src="application.photo" height="200px" cover>
        <template v-slot:placeholder>
          <v-row align="center" class="fill-height ma-0" justify="center">
            <v-progress-circular
              color="grey lighten-5"
              indeterminate
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>

      <v-card-title class="text-capitalize">
        {{ application.title }}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          :href="application.url"
          target="_blank"
          prepend-icon="mdi-text-box-outline"
          variant="flat"
          color="#ff4800"
          class="text-white"
          >Description</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          :href="application.view_url"
          target="_blank"
          prepend-icon="mdi-monitor-dashboard"
          variant="tonal"
          color="primary"
          >View App</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: 'TheAppCard',
  props: {
    application: Object,
  },
}
</script>

<style scoped></style>
