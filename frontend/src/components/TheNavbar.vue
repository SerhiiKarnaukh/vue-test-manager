<template>
  <v-container fluid>
    <v-app-bar color="primary">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
        class="d-sm-flex d-md-none"
      ></v-app-bar-nav-icon>
      <router-link
        to="/"
        style="text-decoration:none;"
      >
        <v-app-bar-title>
          <h3 class="main_title ml-3">Super Shop</h3>
        </v-app-bar-title>
      </router-link>
      <v-spacer></v-spacer>
      <div class="d-md-flex d-sm-none d-none mr-3">
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
    </v-app-bar>
    <v-navigation-drawer
      temporary
      v-model="drawer"
      location="left"
    >
      <v-list>
        <v-list-item
          v-for="item in links"
          :key="`${item.label}-navbar-drawer-link`"
          :to="item.url"
          :prepend-icon="`mdi-${item.icon}`"
        >
          {{ item.label }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      drawer: false,
      links: [
        {
          icon: 'face-man',
          label: 'Men',
          url: '/men'
        },
        {
          icon: 'face-woman',
          label: 'Women',
          url: '/women'
        },
        {
          icon: 'login',
          label: 'Login',
          url: '/login'
        },
        {
          icon: 'basket',
          label: 'Cart',
          url: '/cart'
        },
      ],
    }),
    watch: {
    $route() {
      this.drawer = false
    }
  }
  }
</script>

<style scoped>
.main_title {
    color: white;
}
</style>
