<template>
  <!-- App.vue passes the single <router-view /> as default slot; do not nest another outlet here. -->
  <slot />
</template>

<script setup>
defineOptions({ name: 'f1Auth-layout' })
</script>
