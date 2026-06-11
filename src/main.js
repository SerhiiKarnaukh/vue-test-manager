import { createApp } from 'vue'

import App from './App.vue'

import router from './router'

import store from './store'

import vuetify from './plugins/vuetify'

import { loadFonts } from './plugins/webfontloader'

import axios from 'axios'

import { createPinia } from 'pinia'

import { setupAxiosInterceptors } from '@/http/axiosInterceptors'



axios.defaults.baseURL = `${import.meta.env.VITE_REMOTE_HOST}`

setupAxiosInterceptors(axios, store)



loadFonts()



const app = createApp(App)

app.use(router)

app.use(store)

app.use(vuetify)

app.use(createPinia())

app.mount('#app')

