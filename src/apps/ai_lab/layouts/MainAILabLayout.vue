<template>
  <the-navbar></the-navbar>
  <router-view />
  <the-footer></the-footer>
</template>

<script>
import TheNavbar from '@/apps/ai_lab/components/TheNavbar.vue'
import TheFooter from '@/apps/ai_lab/components/TheFooter.vue'
import { onMounted } from 'vue'
import { useStore } from 'vuex'
export default {
  components: { TheNavbar, TheFooter },
  setup() {
    const store = useStore()
    onMounted(async () => {
      store.dispatch('aiLabChatData/connectRealtimeChatSocket')
    })
    return {}
  },
}
</script>

<style lang="scss" scoped></style>
