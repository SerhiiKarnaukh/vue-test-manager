# Taberna Orders — Structure Refactoring Plan

**Document:** `taberna-orders-refactoring`  
**Status:** Planned  
**Scope:** File/folder layout only. **No** Stripe session/charge flow changes.  
**Reference:** [README.md](./README.md)  
**Backend sibling:** [../refactor/taberna-orders-app-refactoring.md](../refactor/taberna-orders-app-refactoring.md)  
**Sibling plans:** [taberna-cart-refactoring.md](./taberna-cart-refactoring.md), [taberna-profiles-refactoring.md](./taberna-profiles-refactoring.md)

---

## 1. Goals and Non-Goals

### Goals

- Extract order actions currently in **`tabernaCartData.module.js`** into `src/apps/taberna/orders/`.
- Group checkout result views: `CheckoutView` (payment), `SuccessView`, `FailedView`.
- Align with backend `taberna_orders` API surface.

### Non-Goals

- Changing Stripe redirect URLs or payment success/failure handling.
- Merging orders list on dashboard (stays in [taberna-profiles](./taberna-profiles-refactoring.md)).

---

## 2. Current State Inventory

| File | Lines | Role |
|------|------:|------|
| `store/.../tabernaCartData.module.js` | ~30 (order section) | `placeOrderStripe`, `placeOrderStatus` |
| `views/taberna/CheckoutView.vue` | ~120 | Stripe checkout UI |
| `views/taberna/SuccessView.vue` | ~45 | payment success callback |
| `views/taberna/FailedView.vue` | ~40 | payment failed callback |

### Orders API (`/taberna-orders/api/v1/`)

| Action | Method | Endpoint |
|--------|--------|----------|
| Place order (session) | POST | `place_order_stripe_session/` |
| Place order (charge) | POST | `place_order_stripe_charge/` |
| Payment success | POST | `order_payment_success/` |
| Payment failed | POST | `order_payment_failed/` |

### Routes

| Path | View | `authJWT` |
|------|------|-----------|
| `/taberna/cart/checkout` | CheckoutView | true |
| `/taberna/cart/success` | SuccessView | — |
| `/taberna/cart/failed` | FailedView | — |

---

## 3. Target Directory Layout

```
src/apps/taberna/orders/
├── api/
│   └── orders.js
├── store/
│   └── orders.module.js
├── views/
│   ├── CheckoutView.vue
│   ├── SuccessView.vue
│   └── FailedView.vue
└── index.js
```

---

## 4. Phased Execution Plan

| Phase | Actions | Verification |
|-------|---------|--------------|
| 0 | Branch; smoke checkout page (mock or test env) | build |
| 1 | `api/orders.js` + `orders.module.js` from cart store | Actions dispatch |
| 2 | Update Checkout/Success/Failed views to new namespace | Stripe redirect smoke |
| 3 | Remove order methods from cart store | cart module cart-only |
| 4 | Move views; shims for `tabernaCartData/placeOrder*` | backward compat one PR |
| 5 | Remove shims | lint + build |

**Estimated PRs:** 2–3. **Depends on** [taberna-cart](./taberna-cart-refactoring.md) Phase 1.

---

## 5. Acceptance Criteria

- [ ] Checkout still redirects to Stripe session URL when `type === 'session'`.
- [ ] Success/failure pages still call `order_payment_success` / `order_payment_failed`.
- [ ] Cart refreshes after order status actions.
- [ ] `tabernaCartData` contains zero order endpoint strings.

---

*End of plan.*
