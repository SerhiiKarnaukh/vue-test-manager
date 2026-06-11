import * as productsApi from '../api/products'

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
  clearProductDetail(state) {
    state.productDetail = {
      product: {},
      variations: {},
    }
  },
}

const actions = {
  async getLatestProducts({ commit }) {
    try {
      const response = await productsApi.fetchLatestProducts()
      commit('setLatestProducts', response.data)
    } catch (error) {
      console.log(error)
    }
  },
  async getProductDetail({ commit }, { categorySlug, productSlug }) {
    try {
      const response = await productsApi.fetchProductDetail(
        categorySlug,
        productSlug
      )
      commit('setProductDetail', response.data)
    } catch (error) {
      console.log(error)
    }
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
