<template>
  <v-container>
    <v-app-bar color="social">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="state.drawer = !state.drawer"
        class="d-sm-flex d-md-none"
      ></v-app-bar-nav-icon>
      <router-link to="/social/home" style="text-decoration: none">
        <v-app-bar-title>
          <h3 class="main_title ml-3">Social Network</h3>
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
        <v-btn to="/social/home" flat prepend-icon="mdi-home">Main</v-btn>

        <div v-if="!$store.state.authJWT.accessToken">
          <v-btn
            v-for="link in links"
            flat
            :key="`${link.label}-navbar-link`"
            color="white"
            class="ml-3"
            :to="link.url"
            :prepend-icon="`mdi-${link.icon}`"
          >
            {{ link.label }}
          </v-btn>
        </div>

        <div v-if="$store.state.authJWT.accessToken">
          <v-btn
            flat
            color="white"
            prepend-icon="mdi-chat-processing-outline"
            to="/social/chat"
          >
            Chat
          </v-btn>
          <v-btn flat color="white" prepend-icon="mdi-logout" @click="logout">
            Logout
          </v-btn>
        </div>

        <v-btn
          flat
          color="white"
          prepend-icon="mdi-toggle-switch"
          @click="toggleTheme"
        >
          Toggle Theme
        </v-btn>
        <v-btn
          density="comfortable"
          @click="searching = true"
          icon="mdi-magnify"
          to="/social/search"
        >
        </v-btn>
        <div v-if="$store.state.authJWT.accessToken">
          <router-link
            :to="{
              name: 'profileSocial',
              params: { slug: userSlug },
            }"
          >
            <v-avatar size="40">
              <img
                :src="avatarUrl ? avatarUrl : state.defaultAvatar"
                style="max-width: 100%"
            /></v-avatar>
          </router-link>
        </div>
      </div>
    </v-app-bar>
    <v-navigation-drawer temporary v-model="state.drawer" location="left">
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
        <v-list-item to="/social/home" flat prepend-icon="mdi-home"
          >Main</v-list-item
        >
        <div v-if="!$store.state.authJWT.accessToken">
          <v-list-item
            v-for="item in links"
            :key="`${item.label}-navbar-drawer-link`"
            :to="item.url"
            :prepend-icon="`mdi-${item.icon}`"
          >
            {{ item.label }}
          </v-list-item>
        </div>
        <div v-if="$store.state.authJWT.accessToken">
          <v-list-item
            flat
            prepend-icon="mdi-chat-processing-outline"
            to="/social/chat"
          >
            Chat
          </v-list-item>
          <v-list-item
            flat
            color="white"
            prepend-icon="mdi-logout"
            @click="logout"
          >
            Logout
          </v-list-item>
        </div>
        <v-list-item
          flat
          color="white"
          prepend-icon="mdi-toggle-switch"
          @click="toggleTheme"
        >
          Toggle Theme
        </v-list-item>
        <v-list-item flat prepend-icon="mdi-magnify" to="/social/search">
          Search
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed, reactive } from 'vue'
export default {
  setup() {
    const theme = useTheme()
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      drawer: false,
      defaultAvatar: store.getters['socialProfileData/defaultAvatar'],
    })

    const avatarUrl = computed(
      () => store.getters['socialProfileData/user'].avatar_url
    )

    const userSlug = computed(() => store.getters['socialProfileData/userSlug'])

    const links = [
      {
        icon: 'login',
        label: 'Login',
        url: '/social/login',
      },
      {
        icon: 'pencil-lock',
        label: 'Signup',
        url: '/social/signup',
      },
    ]

    const toggleTheme = () => {
      return (theme.global.name.value = theme.global.current.value.dark
        ? 'CustomLightTheme'
        : 'dark')
    }

    const logout = () => {
      store.dispatch('authJWT/logout')
      store.commit('socialProfileData/initSocial')
      router.push('/social/login')
    }

    return {
      state,
      theme,
      remoteHost: import.meta.env.VITE_REMOTE_HOST,
      avatarUrl,
      links,
      userSlug,
      toggleTheme,
      logout,
    }
  },
}
</script>

<style scoped lang="scss">
.main_title {
  color: white;
}
</style>
