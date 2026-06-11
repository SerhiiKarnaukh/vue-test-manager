import axios from 'axios'
import store from '@/store'
import { setupAxiosInterceptors } from '@/http/axiosInterceptors'

setupAxiosInterceptors(axios, store)
