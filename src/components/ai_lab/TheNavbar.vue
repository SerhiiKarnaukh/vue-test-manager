<template>
  <v-container>
    <v-app-bar color="ai_lab">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
        class="d-sm-flex d-md-none"
        color="white"
      ></v-app-bar-nav-icon>
      <router-link to="/ai-lab" style="text-decoration: none">
        <v-app-bar-title>
          <h3 class="main_title ml-3">AI Lab</h3>
        </v-app-bar-title>
      </router-link>
      <v-spacer></v-spacer>
      <div class="d-md-flex d-sm-none d-none mr-3">
        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn color="white" v-bind="props" prepend-icon="mdi-cogs">
              AI Services
            </v-btn>
          </template>
          <v-list>
            <v-list-item append-icon="mdi-message-text" to="/ai-lab">
              <v-list-item-title>Funny Chat</v-list-item-title>
            </v-list-item>
            <v-list-item
              append-icon="mdi-image-frame"
              to="/ai-lab/image-generator"
            >
              <v-list-item-title>Image Generator</v-list-item-title>
            </v-list-item>
            <v-list-item
              append-icon="mdi-account-voice"
              to="/ai-lab/voice-generator"
            >
              <v-list-item-title>Voice Generator</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn
              color="white"
              v-bind="props"
              prepend-icon="mdi-remote-desktop"
            >
              Apps Manager
            </v-btn>
          </template>
          <v-list>
            <v-list-item :href="remoteHost"
              ><v-list-item-title>All Apps</v-list-item-title></v-list-item
            >
            <v-list-item to="/"
              ><v-list-item-title>Vue Apps</v-list-item-title></v-list-item
            >
          </v-list>
        </v-menu>
        <v-btn
          flat
          color="white"
          prepend-icon="mdi-toggle-switch"
          @click="toggleTheme"
        >
          Toggle Theme
        </v-btn>
      </div>
    </v-app-bar>
    <v-navigation-drawer temporary v-model="drawer" location="left">
      <v-list>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-list-item color="white" v-bind="props" prepend-icon="mdi-cogs">
              AI Services
            </v-list-item>
          </template>
          <v-list>
            <v-list-item append-icon="mdi-message-text" to="/ai-lab">
              <v-list-item-title>Funny Chat</v-list-item-title>
            </v-list-item>
            <v-list-item
              append-icon="mdi-image-frame"
              to="/ai-lab/image-generator"
            >
              <v-list-item-title>Image Generator</v-list-item-title>
            </v-list-item>
            <v-list-item
              append-icon="mdi-account-voice"
              to="/ai-lab/voice-generator"
            >
              <v-list-item-title>Voice Generator</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-list-item
              color="white"
              v-bind="props"
              prepend-icon="mdi-remote-desktop"
            >
              Apps Manager
            </v-list-item>
          </template>

          <v-list>
            <v-list-item :href="remoteHost"
              ><v-list-item-title>All Apps</v-list-item-title></v-list-item
            >
            <v-list-item to="/"
              ><v-list-item-title>Vue Apps</v-list-item-title></v-list-item
            >
          </v-list>
        </v-menu>
        <v-list-item
          flat
          color="white"
          prepend-icon="mdi-toggle-switch"
          @click="toggleTheme"
        >
          Toggle Theme
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import { useTheme } from 'vuetify'
export default {
  setup() {
    const theme = useTheme()
    return {
      theme,
      toggleTheme: () =>
        (theme.global.name.value = theme.global.current.value.dark
          ? 'CustomLightTheme'
          : 'dark'),
    }
  },
  data: () => ({
    drawer: false,
    remoteHost: import.meta.env.VITE_REMOTE_HOST,
  }),
  watch: {
    $route() {
      this.drawer = false
    },
  },
}
</script>

<style scoped lang="scss">
.main_title {
  color: white;
}
</style>
