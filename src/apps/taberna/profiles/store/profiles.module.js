import * as ordersApi from '../api/orders'

const state = () => ({
  orders: [],
  ordersLoading: false,
})

const mutations = {
  setOrders(state, orders) {
    state.orders = orders
  },
  setOrdersLoading(state, loading) {
    state.ordersLoading = loading
  },
}

const actions = {
  async getMyOrders({ commit }) {
    try {
      commit('setOrdersLoading', true)
      const response = await ordersApi.fetchUserOrders()
      commit('setOrders', response.data)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      commit('setOrdersLoading', false)
    }
  },
}

const getters = {
  orders: (state) => state.orders,
  ordersLoading: (state) => state.ordersLoading,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
