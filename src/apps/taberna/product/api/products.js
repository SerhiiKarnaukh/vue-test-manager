import axios from 'axios'

const STORE_BASE = '/taberna-store/api/v1'

export function fetchLatestProducts() {
  return axios.get(`${STORE_BASE}/latest-products/`)
}

export function fetchProductDetail(categorySlug, productSlug) {
  return axios.get(`${STORE_BASE}/products/${categorySlug}/${productSlug}`)
}

export function fetchCategoryProducts(categorySlug) {
  return axios.get(`${STORE_BASE}/products/${categorySlug}/`)
}

export function searchProducts(query) {
  return axios.post(`${STORE_BASE}/products/search/`, { query })
}
