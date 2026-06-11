<template>
  <v-col cols="12" sm="6" md="4">
    <v-card class="mx-auto pb-2">
      <v-img :src="product.image" aspect-ratio="1.5">
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
        {{ product.name }}
      </v-card-title>
      <v-card-title class="grey--text text-grey-darken-1 caption mt-n4">
        {{ product.description }}
      </v-card-title>

      <v-card-subtitle> ${{ product.price }} </v-card-subtitle>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :to="product.get_absolute_url" variant="flat" color="primary"
          >Details</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: 'TheProductCard',
  props: {
    product: Object,
  },
}
</script>

<style scoped></style>
