<template>
  <v-container>
    <v-app-bar color="hyper3d">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
        class="d-sm-flex d-md-none"
        color="white"
      ></v-app-bar-nav-icon>
      <router-link to="/hyper3d" style="text-decoration: none">
        <v-app-bar-title>
          <h3 class="main_title ml-3">Hyper 3D (Work In Progress)</h3>
        </v-app-bar-title>
      </router-link>
      <v-spacer></v-spacer>
      <div class="d-md-flex d-sm-none d-none mr-3">
        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn color="white" v-bind="props" prepend-icon="mdi-cube-scan">
              Scenes
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="item in hyper3dMenuItems"
              :key="item.to"
              :to="item.to"
              :append-icon="item.icon"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
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
            <v-list-item
              color="white"
              v-bind="props"
              prepend-icon="mdi-cube-scan"
            >
              Scenes
            </v-list-item>
          </template>
          <v-list>
            <v-list-item
              v-for="item in hyper3dMenuItems"
              :key="item.to"
              :to="item.to"
              :append-icon="item.icon"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
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

<script setup>
import { useTheme } from 'vuetify'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const drawer = ref(false)
const remoteHost = import.meta.env.VITE_REMOTE_HOST

const theme = useTheme()
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark
    ? 'CustomLightTheme'
    : 'dark'
}

const hyper3dMenuItems = [
  {
    title: 'Figures',
    icon: 'mdi-cube-outline',
    to: '/hyper3d',
  },
  {
    title: 'Animate',
    icon: 'mdi-animation',
    to: '/hyper3d/animate',
  },
]

const route = useRoute()
watch(route, () => {
  drawer.value = false
})
</script>

<style scoped lang="scss">
.main_title {
  color: white;
}
</style>
