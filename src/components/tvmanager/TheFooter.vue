<template>
  <v-footer color="white">
    <v-row justify="center" no-gutters>
      <v-btn
        color="#3a3a3a"
        variant="text"
        class="mx-2"
        rounded="xl"
        :href="remoteHost"
      >
        All Apps
      </v-btn>
      <v-btn color="#3a3a3a" variant="text" class="mx-2" rounded="xl" to="/">
        Vue Apps
      </v-btn>
      <v-col class="text-center mt-4" cols="12">
        {{ new Date().getFullYear() }} — <strong>Vue Manager</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    remoteHost: import.meta.env.VITE_REMOTE_HOST,
  }),
}
</script>

<style lang="scss" scoped></style>
