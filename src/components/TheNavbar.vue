<template>
    <v-container>
        <v-app-bar color="primary">
            <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"
                class="d-sm-flex d-md-none"></v-app-bar-nav-icon>
            <router-link to="/" style="text-decoration:none;">
                <v-app-bar-title>
                    <h3 class="main_title ml-3">Taberna</h3>
                </v-app-bar-title>
            </router-link>
            <v-spacer></v-spacer>
            <div class="d-md-flex d-sm-none d-none mr-3">
                <v-menu open-on-hover>
                    <template v-slot:activator="{ props }">
                        <v-btn color="white" v-bind="props" prepend-icon="mdi-hanger">
                            Category
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item v-for="(item, index) in categories" :key="index">
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <div v-if="!$store.state.auth.token">
                    <v-btn v-for="link in links" flat :key="`${link.label}-navbar-link`" color="white" class="ml-3"
                        :to="link.url" :prepend-icon="`mdi-${link.icon}`">
                        {{ link.label }}
                    </v-btn>

                </div>

                <div v-if="$store.state.auth.token">
                    <v-btn flat color="white" to="/dashboard" prepend-icon="mdi-view-dashboard-outline">
                        Dashboard
                    </v-btn>
                    <v-btn flat color="white" prepend-icon="mdi-logout" @click="logout">
                        Logout
                    </v-btn>
                </div>

                <v-btn flat color="white" prepend-icon="mdi-toggle-switch" @click="toggleTheme">
                    Toggle Theme
                </v-btn>
                <v-btn flat color="white" prepend-icon="mdi-basket" to="/cart">
                    Cart
                </v-btn>
            </div>
        </v-app-bar>
        <v-navigation-drawer temporary v-model="drawer" location="left">
            <v-list>
                <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-list-item color="white" v-bind="props" prepend-icon="mdi-hanger">
                            Category
                        </v-list-item>
                    </template>

                    <v-list>
                        <v-list-item v-for="(item, index) in categories" :key="index" hover>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <div v-if="!$store.state.auth.token">
                    <v-list-item v-for="item in links" :key="`${item.label}-navbar-drawer-link`" :to="item.url"
                        :prepend-icon="`mdi-${item.icon}`">
                        {{ item.label }}
                    </v-list-item>
                </div>
                <div v-if="$store.state.auth.token">
                    <v-list-item to="/dashboard" prepend-icon="mdi-view-dashboard-outline">
                        Dashboard
                    </v-list-item>
                    <v-list-item flat color="white" prepend-icon="mdi-logout" @click="logout">
                        Logout
                    </v-list-item>
                </div>
                <v-list-item flat color="white" prepend-icon="mdi-toggle-switch" @click="toggleTheme">
                    Toggle Theme
                </v-list-item>
                <v-list-item flat color="white" prepend-icon="mdi-basket" to="/cart">
                    Cart
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </v-container>
</template>

<script>
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
    setup () {
        const theme = useTheme()
        const router = useRouter()
        const store = useStore()

        return {
            theme,
            toggleTheme: () => theme.global.name.value = theme.global.current.value.dark ? 'CustomLightTheme' : 'dark',
            logout: () => {
                store.commit('auth/logout')
                router.push('/')
            },
        }
    },
    data: () => ({
        drawer: false,
        links: [
            {
                icon: 'login',
                label: 'Login',
                url: '/login'
            },
            {
                icon: 'pencil-lock',
                label: 'Signup',
                url: '/signup'
            },
        ],
        categories: [
            { title: 'Shoes' },
            { title: 'T-shirts' },
            { title: 'Click Me' },
            { title: 'Click Me 2' },
        ],
    }),
    watch: {
        $route () {
            this.drawer = false
        },
    },
}
</script>

<style scoped>
.main_title {
    color: white;
}
</style>
