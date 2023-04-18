<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Thank You!</v-card-title>
          <v-card-text>
            <p>Your order will be processed within 48 hours</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'SuccessView',
  mounted() {
    document.title = 'Success | Taberna'
  },
}
</script>
