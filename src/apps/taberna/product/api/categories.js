import axios from 'axios'

const STORE_BASE = '/taberna-store/api/v1'

export function fetchProductCategories() {
  return axios.get(`${STORE_BASE}/product-categories/`)
}
