<template>
  <v-card class="px-4 py-6 rounded-lg">
    <h3 class="mb-6 text-xl">People you may know</h3>
    <v-card class="mb-4" flat>
      <v-row align="center">
        <v-col class="shrink-0">
          <v-avatar size="40">
            <img src="https://i.pravatar.cc/300?img=70" />
          </v-avatar>
        </v-col>
        <v-row>
          <p class="text-xs"><strong>Serhii Karnaukh</strong></p>
        </v-row>
        <v-col class="shrink-0">
          <v-btn variant="flat" color="social"> Show </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
export default {
  setup() {
    return {}
  },
}
</script>

<style lang="scss" scoped></style>
