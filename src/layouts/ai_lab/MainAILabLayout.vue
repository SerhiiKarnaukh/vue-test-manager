<template>
  <the-navbar></the-navbar>
  <router-view />
  <the-footer></the-footer>
</template>

<script>
import TheNavbar from '@/components/ai_lab/TheNavbar.vue'
import TheFooter from '@/components/ai_lab/TheFooter.vue'
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
