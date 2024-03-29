import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import axios from 'axios'
import './axios-interceptor'

axios.defaults.baseURL = `${import.meta.env.VITE_REMOTE_HOST}`

loadFonts()

createApp(App).use(router).use(store).use(vuetify).mount('#app')
