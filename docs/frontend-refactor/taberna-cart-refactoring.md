# Taberna Cart — Structure Refactoring Plan

**Document:** `taberna-cart-refactoring`  
**Status:** Done
**Scope:** File/folder layout only. **No** cart session / `cart_id` semantics changes.  
**Reference:** [README.md](./README.md)  
**Backend sibling:** [../refactor/taberna-cart-app-refactoring.md](../refactor/taberna-cart-app-refactoring.md)  
**Sibling plans:** [taberna-orders-refactoring.md](./taberna-orders-refactoring.md)

---

## 1. Goals and Non-Goals

### Goals

- Move **`tabernaCartData.module.js`** to `src/apps/taberna/cart/`.
- Split **cart HTTP** from **order HTTP** — order endpoints move to [taberna-orders](./taberna-orders-refactoring.md) in a follow-up PR.
- Move cart-related views: `CartView`, `CheckoutView` (cart portion).

### Non-Goals

- Changing `localStorage.cartId` behaviour.
- Stripe checkout flow semantics.

---

## 2. Current State Inventory

| File | Lines | Role |
|------|------:|------|
| `store/modules/tabernaData/tabernaCartData.module.js` | ~102 | Cart CRUD + **order actions** (to split) |
| `views/taberna/CartView.vue` | ~80 | Cart UI |
| `views/taberna/CheckoutView.vue` | ~120 | Checkout + stripe dispatch |
| `components/taberna/TheCartItem.vue` | ~60 | Line item |
| `components/taberna/TheOrderSummary.vue` | ~40 | Summary sidebar |

### Cart API (`/taberna-cart/api/`)

| Action | Method | Endpoint |
|--------|--------|----------|
| `getCart` | GET | `/taberna-cart/api/cart/` |
| `addToCart` | POST | `/taberna-cart/api/add-to-cart/<productId>/` |
| `removeFromCart` | DELETE | `/taberna-cart/api/cart-remove/<productId>/<cartItemId>/` |
| `removeCartItemFully` | DELETE | `/taberna-cart/api/cart-item-remove/<productId>/<cartItemId>/` |

### Order API (move to taberna-orders module)

| Action | Endpoint |
|--------|----------|
| `placeOrderStripe` | `/taberna-orders/api/v1/place_order_stripe_session/` or `..._charge/` |
| `placeOrderStatus` | `/taberna-orders/api/v1/order_payment_success/` / `..._failed/` |

### Cross-module

| Consumer | Usage |
|----------|-------|
| `MainTabernaLayout` | `tabernaCartData/getCart` on mount |
| `ProductDetailView` | `addToCart`, `getCart` |
| `TheNavbar` | cart badge / reload after logout |
| `SuccessView`, `FailedView` | `placeOrderStatus` |

---

## 3. Target Directory Layout

```
src/apps/taberna/cart/
├── api/
│   └── cart.js
├── store/
│   └── cart.module.js          # cart state only
├── views/
│   └── CartView.vue
├── components/
│   ├── TheCartItem.vue
│   └── TheOrderSummary.vue     # shared with checkout — or move to taberna/shared/
└── index.js

# Legacy shim
src/store/modules/tabernaData/tabernaCartData.module.js
```

---

## 4. Phased Execution Plan

| Phase | Actions | Verification |
|-------|---------|--------------|
| 0 | Branch; smoke add → cart → view | build |
| 1 | `api/cart.js`; cart-only actions in new store | Cart CRUD |
| 2 | Move views/components | UI parity |
| 3 | Update store namespace `tabernaCartData` → shim re-export `taberna/cart` | All dispatch paths work |
| 4 | Hand off order actions to taberna-orders plan | Checkout still works via shim |
| 5 | Remove shims | lint + build |

**Estimated PRs:** 3–4.

---

## 5. Acceptance Criteria

- [x] Anonymous + logged-in cart via `cart_id` unchanged.
- [x] Add/remove line items work from product page and cart page.
- [x] `getCart` on taberna layout mount unchanged.
- [x] Cart store module < ~80 lines after order split.
- [x] All cart URLs remain under `/taberna-cart/api/`.
- [x] `tabernaCartData` shim preserves existing dispatch paths.

---

*End of plan.*
