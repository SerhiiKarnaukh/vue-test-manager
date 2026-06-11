import axios from 'axios'

export function fetchUserOrders() {
  return axios.get('taberna-profiles/api/v1/orders/')
}
