<template>
  <the-navbar></the-navbar>
  <router-view />
  <the-footer></the-footer>
</template>

<script setup>
import TheNavbar from '@/components/hyper3d/TheNavbar.vue'
import TheFooter from '@/components/hyper3d/TheFooter.vue'
</script>

<style lang="scss" scoped></style>
