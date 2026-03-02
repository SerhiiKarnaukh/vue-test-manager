<template>
  <v-theme-provider theme="F1DarkTheme" with-background>
    <v-layout class="f1-layout">
      <F1Header
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
      />

      <F1Sidebar v-model="sidebarOpen" />

      <v-main class="f1-layout__main">
        <router-view />
      </v-main>

      <F1StatusBar />
    </v-layout>
  </v-theme-provider>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import F1Header from '@/components/f1/layout/F1Header.vue'
import F1Sidebar from '@/components/f1/layout/F1Sidebar.vue'
import F1StatusBar from '@/components/f1/layout/F1StatusBar.vue'

const store = useStore()
const router = useRouter()
const sidebarOpen = ref(true)

onMounted(async () => {
  store.commit('setAppName', 'F1 Pit Wall')
  await store.dispatch('authJWT/checkActiveApp', 'f1_pitwall')
  const me = await store.dispatch('f1Data/sessions/fetchCurrentUser')
  if (!me) {
    router.push('/f1/login?message=auth')
    return
  }
  store.dispatch('f1Data/sessions/fetchSessions')
  store.dispatch('f1Data/sessions/detectLiveSession')
})

onUnmounted(() => {
  store.dispatch('f1Data/websocket/disconnectTelemetry')
  store.dispatch('f1Data/websocket/disconnectRaceControl')
})
</script>

<style lang="scss">
.f1-layout {
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;

  &__main {
    background-color: #0d1117;
    padding: 16px;
  }
}
</style>
