import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import axios from 'axios'
import './axios-interceptor'
import { createPinia } from 'pinia'

axios.defaults.baseURL = `${import.meta.env.VITE_REMOTE_HOST}`

loadFonts()

const app = createApp(App)
app.use(router)
app.use(store)
app.use(vuetify)
app.use(createPinia())
app.mount('#app')
