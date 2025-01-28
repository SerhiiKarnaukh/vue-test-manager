<template>
  <v-container>
    <v-app-bar color="primary">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="state.drawer = !state.drawer"
        class="d-sm-flex d-md-none"
      ></v-app-bar-nav-icon>
      <router-link to="/taberna" style="text-decoration: none">
        <v-app-bar-title>
          <h3 class="main_title ml-3">Taberna</h3>
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
            <v-list-item :href="state.remoteHost"
              ><v-list-item-title>All Apps</v-list-item-title></v-list-item
            >
            <v-list-item to="/"
              ><v-list-item-title>Vue Apps</v-list-item-title></v-list-item
            >
          </v-list>
        </v-menu>
        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn color="white" v-bind="props" prepend-icon="mdi-hanger">
              Category
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="(item, index) in state.categories"
              :key="index"
              :to="item.get_absolute_url"
            >
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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
            to="/taberna/dashboard"
            prepend-icon="mdi-view-dashboard-outline"
          >
            Dashboard
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
        <v-btn flat color="white" prepend-icon="mdi-basket" to="/taberna/cart">
          Cart ({{ cartTotalLength }})
        </v-btn>
        <v-btn
          density="comfortable"
          @click="state.searching = true"
          icon="mdi-magnify"
        ></v-btn>
        <v-dialog v-model="state.searching" max-width="400">
          <v-card>
            <v-toolbar dense>
              <v-btn icon @click="state.searching = false"
                ><v-icon>mdi-close</v-icon></v-btn
              >
            </v-toolbar>
            <v-card-text>
              <v-form action="/taberna/search">
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
            <v-list-item :href="state.remoteHost"
              ><v-list-item-title>All Apps</v-list-item-title></v-list-item
            >
            <v-list-item to="/"
              ><v-list-item-title>Vue Apps</v-list-item-title></v-list-item
            >
          </v-list>
        </v-menu>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-list-item color="white" v-bind="props" prepend-icon="mdi-hanger">
              Category
            </v-list-item>
          </template>

          <v-list>
            <v-list-item
              v-for="(item, index) in state.categories"
              :key="index"
              hover
              :to="item.get_absolute_url"
            >
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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
            to="/taberna/dashboard"
            prepend-icon="mdi-view-dashboard-outline"
          >
            Dashboard
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

        <v-list-item flat prepend-icon="mdi-basket" to="/taberna/cart">
          Cart ({{ cartTotalLength }})
        </v-list-item>

        <v-list-item
          flat
          color="white"
          prepend-icon="mdi-magnify"
          @click="state.searching = true"
        >
          Search
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import { reactive, computed, onMounted, watch } from 'vue'
import { useTheme } from 'vuetify'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'

export default {
  setup() {
    const theme = useTheme()
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const state = reactive({
      searching: false,
      remoteHost: import.meta.env.VITE_REMOTE_HOST,
      categories: [],
      cart: {
        items: [],
      },
      drawer: false,
    })

    const links = [
      {
        icon: 'login',
        label: 'Login',
        url: '/taberna/login',
      },
      {
        icon: 'pencil-lock',
        label: 'Signup',
        url: '/taberna/signup',
      },
    ]

    const toggleTheme = () => {
      theme.global.name.value = theme.global.current.value.dark
        ? 'CustomLightTheme'
        : 'dark'
    }

    const logout = async () => {
      await store.dispatch('authJWT/logout')
      store.commit('tabernaCartData/clearCartId')
      await store.dispatch('tabernaCartData/getCart')

      router.push('/taberna/login')
    }

    const cartTotalLength = computed(() => {
      return store.getters['tabernaCartData/cart'].quantity || 0
    })

    const getAllCategories = async () => {
      try {
        const response = await axios.get(
          '/taberna-store/api/v1/product-categories/'
        )
        state.categories = response.data
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }

    watch(
      () => route.path,
      () => {
        state.drawer = false
      }
    )

    onMounted(() => {
      getAllCategories()
    })

    return {
      state,
      links,
      theme,
      toggleTheme,
      logout,
      cartTotalLength,
      getAllCategories,
    }
  },
}
</script>

<style scoped lang="scss">
.main_title {
  color: white;
}
</style>
