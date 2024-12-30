import axios from 'axios'
const state = () => ({
  latestProducts: [],
  productDetail: {
    product: {},
    variations: {},
  },
})

const mutations = {
  setLatestProducts(state, products) {
    state.latestProducts = products
  },
  setProductDetail(state, product) {
    state.productDetail = product
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
  async getProductDetail({ commit }, { categorySlug, productSlug }) {
    await axios
      .get(`/taberna-store/api/v1/products/${categorySlug}/${productSlug}`)
      .then((response) => {
        commit('setProductDetail', response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  },
}

const getters = {
  latestProducts: (state) => state.latestProducts,
  productDetail: (state) => state.productDetail,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
