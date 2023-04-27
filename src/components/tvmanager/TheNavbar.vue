<template>
  <v-container>
    <v-app-bar color="manager">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
        class="d-sm-flex d-md-none"
        color="white"
      ></v-app-bar-nav-icon>
      <router-link to="/" style="text-decoration: none">
        <v-app-bar-title>
          <h3 class="main_title ml-3">Vue Manager</h3>
        </v-app-bar-title>
      </router-link>
      <v-spacer></v-spacer>
      <div class="d-md-flex d-sm-none d-none mr-3">
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
          href="https://docs.google.com/document/d/11DNF9pFl0wQLNXac779DO6axLG67nMGIBC_bPTPulRQ/edit?usp=share_link"
          prepend-icon="mdi-file-account"
        >
          CV
        </v-btn>
        <v-btn
          flat
          color="white"
          href="https://github.com/SerhiiKarnaukh"
          prepend-icon="mdi-github"
        >
          GitHub
        </v-btn>
        <v-btn
          flat
          color="white"
          href="https://www.linkedin.com/in/serhiikarnaukh"
          prepend-icon="mdi-linkedin"
        >
          LinkedIn
        </v-btn>
        <v-btn
          flat
          color="white"
          prepend-icon="mdi-toggle-switch"
          @click="toggleTheme"
        >
          Toggle Theme
        </v-btn>
        <v-btn
          color="white"
          density="comfortable"
          @click="searching = true"
          icon="mdi-magnify"
        ></v-btn>
        <v-dialog v-model="searching" max-width="400">
          <v-card>
            <v-toolbar dense>
              <v-btn icon @click="searching = false"
                ><v-icon>mdi-close</v-icon></v-btn
              >
            </v-toolbar>
            <v-card-text>
              <v-form action="/tvmanager/search">
                <v-text-field
                  density="compact"
                  variant="outlined"
                  label="Search"
                  single-line
                  hide-details
                  class="mr-2"
                  name="query"
                ></v-text-field>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </v-app-bar>
    <v-navigation-drawer temporary v-model="drawer" location="left">
      <v-list>
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
          href="https://docs.google.com/document/d/11DNF9pFl0wQLNXac779DO6axLG67nMGIBC_bPTPulRQ/edit?usp=share_link"
          prepend-icon="mdi-file-account"
        >
          CV
        </v-list-item>
        <v-list-item
          href="https://github.com/SerhiiKarnaukh"
          prepend-icon="mdi-github"
        >
          GitHub
        </v-list-item>
        <v-list-item
          href="https://www.linkedin.com/in/serhiikarnaukh"
          prepend-icon="mdi-linkedin"
        >
          LinkedIn
        </v-list-item>
        <v-list-item
          flat
          color="white"
          prepend-icon="mdi-toggle-switch"
          @click="toggleTheme"
        >
          Toggle Theme
        </v-list-item>
        <v-list-item
          flat
          color="white"
          prepend-icon="mdi-magnify"
          @click="searching = true"
        >
          Search
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
    searching: false,
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
