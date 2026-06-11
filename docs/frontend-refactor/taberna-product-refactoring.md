# Taberna Product — Structure Refactoring Plan

**Document:** `taberna-product-refactoring`  
**Status:** Done  
**Scope:** File/folder layout only. **No** catalog API changes.  
**Reference:** [README.md](./README.md)  
**Backend sibling:** [../refactor/taberna-product-app-refactoring.md](../refactor/taberna-product-app-refactoring.md)  
**Sibling plans:** [taberna-cart-refactoring.md](./taberna-cart-refactoring.md)

---

## 1. Goals and Non-Goals

### Goals

- Move **`tabernaProductData.module.js`** to `src/apps/taberna/product/`.
- Extract catalog **`axios`** from views (`SearchView`, `CategoryDetailView`, `TheNavbar`) into `api/`.
- Colocate product browse views and `TheProductCard`.

### Non-Goals

- Changing `/taberna-store/api/v1/*` paths.
- Product variation / color-size selection logic changes.

---

## 2. Current State Inventory

| File | Lines | Role |
|------|------:|------|
| `store/modules/tabernaData/tabernaProductData.module.js` | ~59 | latest products + product detail |
| `views/taberna/HomeView.vue` | ~55 | dispatches `getLatestProducts` |
| `views/taberna/ProductDetailView.vue` | ~160 | detail + add to cart |
| `views/taberna/CategoryDetailView.vue` | ~60 | **direct axios** category products |
| `views/taberna/SearchView.vue` | ~55 | **direct axios** search |
| `components/taberna/TheProductCard.vue` | ~45 | Card |
| `components/taberna/TheNavbar.vue` | ~280 | **direct axios** categories |

### Product API (`/taberna-store/api/v1/`)

| Action | Method | Endpoint | Current location |
|--------|--------|----------|------------------|
| Latest products | GET | `/latest-products/` | `tabernaProductData` |
| Product detail | GET | `/products/<cat>/<slug>` | `tabernaProductData` |
| Category products | GET | `/products/<categorySlug>/` | `CategoryDetailView` |
| Search | POST | `/products/search/` | `SearchView` |
| Categories | GET | `/product-categories/` | `TheNavbar` |

### Routes (catalog subset)

| Path | View |
|------|------|
| `/taberna` | HomeView |
| `/taberna-store/category/:category_slug` | CategoryDetailView |
| `/taberna-store/category/:category_slug/:product_slug` | ProductDetailView |
| `/taberna/search` | SearchView |

---

## 3. Target Directory Layout

```
src/apps/taberna/product/
├── api/
│   ├── products.js             # latest, detail, by category, search
│   └── categories.js           # navbar categories
├── store/
│   └── product.module.js
├── views/
│   ├── HomeView.vue
│   ├── CategoryDetailView.vue
│   ├── ProductDetailView.vue
│   └── SearchView.vue
├── components/
│   └── TheProductCard.vue
└── index.js

# Navbar stays in taberna/shared or profiles — imports categories api
src/apps/taberna/shared/components/TheNavbar.vue
```

---

## 4. Phased Execution Plan

| Phase | Actions | Verification |
|-------|---------|--------------|
| 0 | Branch; smoke home → category → product | build |
| 1 | `api/products.js` + `api/categories.js` | — |
| 2 | Refactor store to call `api/` | Latest + detail |
| 3 | Refactor views + navbar to use api/store | Search + categories |
| 4 | Move files; shim old paths | Routes OK |
| 5 | Remove `tabernaProductData` shim | lint + build |

**Estimated PRs:** 3–4.

---

## 5. Acceptance Criteria

- [x] Home shows latest products.
- [x] Category and product detail pages load.
- [x] Search POST returns same results.
- [x] Navbar category menu loads.
- [x] `ProductDetailView` still dispatches cart actions (cross-module import unchanged).
- [x] No direct `axios` in taberna catalog views or navbar.

---

*End of plan.*
