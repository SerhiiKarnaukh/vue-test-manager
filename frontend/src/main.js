import App from './App.vue'
import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8000/'

import router from '@/router/router'

const app = createApp(App)

registerPlugins(app)

app.use(router, axios).mount('#app')
