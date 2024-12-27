import axios from 'axios'
const state = () => ({
  latestProducts: [],
})

const mutations = {
  setLatestProducts(state, products) {
    state.latestProducts = products
  },
}

const actions = {
  async getLatestProducts({ commit }) {
    await axios
      .get('/taberna-store/api/v1/latest-products/')
      .then((response) => {
        commit('setLatestProducts', response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  },
}

const getters = {
  latestProducts: (state) => state.latestProducts,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
