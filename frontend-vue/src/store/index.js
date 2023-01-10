import { createStore } from 'vuex'
import mutations from './mutations'
import actions from './actions'

export default createStore({
  modules: {
  },
  state() {
    return {
        cart: {
            items: [],
        },
        isAuthenticated: false,
        token: '',
        isLoading: false
    }
  },
  mutations: mutations,
  actions: actions,
})
