import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import axios from 'axios'

axios.defaults.baseURL = `${import.meta.env.VITE_REMOTE_HOST}`

loadFonts()

createApp(App).use(router, axios).use(store).use(vuetify).mount('#app')
