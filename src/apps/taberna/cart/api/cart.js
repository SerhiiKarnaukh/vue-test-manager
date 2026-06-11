import axios from 'axios'

const CART_BASE = '/taberna-cart/api'

export function fetchCart(cartId) {
  const params = cartId ? { cart_id: cartId } : {}
  return axios.get(`${CART_BASE}/cart/`, { params })
}

export function addProductToCart(productId, { selectedColor, selectedSize, cartId }) {
  return axios.post(`${CART_BASE}/add-to-cart/${productId}/`, {
    color: selectedColor,
    size: selectedSize,
    cart_id: cartId,
  })
}

export function removeCartLine(productId, cartItemId, cartId) {
  const params = cartId ? { cart_id: cartId } : {}
  return axios.delete(`${CART_BASE}/cart-remove/${productId}/${cartItemId}/`, {
    params,
  })
}

export function removeCartLineFully(productId, cartItemId, cartId) {
  const params = cartId ? { cart_id: cartId } : {}
  return axios.delete(
    `${CART_BASE}/cart-item-remove/${productId}/${cartItemId}/`,
    { params }
  )
}
