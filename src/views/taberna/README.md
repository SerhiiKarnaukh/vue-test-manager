# Taberna eCommerce

A fully functional e-Commerce application frontend built using Vue.js, Vuex, Vue Router, Axios, Vuetify, and Vuelidate. The frontend includes a navigation menu, product pages, cart, checkout with Stripe payment integration, and user account pages. The application is designed to be responsive and user-friendly, with a modern and intuitive user interface.

### Live Demo on Firebase: <https://karnaukh-vue-test.web.app/taberna>

![Taberna eCommerce screenshot](https://github.com/SerhiiKarnaukh/vue-test-manager/blob/main/src/views/taberna/taberna_vue.jpg)

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Pages and Routes](#pages-and-routes)
- [Architecture](#architecture)
- [Components](#components)
- [State Management](#state-management)
- [API Endpoints](#api-endpoints)
- [Stripe Integration](#stripe-integration)
- [Authentication](#authentication)
- [Related Folders](#related-folders)
- [Backend](#backend)

## Overview

The frontend was built using **Vue.js 3**, a popular JavaScript framework for building web applications. The state management was implemented using **Vuex**, a state management pattern and library for Vue.js, including handling the checkout process and integrating Stripe for secure payments. The routing of the application was implemented using **Vue Router**, a plugin for Vue.js that provides routing functionality. The data fetching was implemented using **Axios**, a popular HTTP client for JavaScript.

The frontend also includes a search functionality that allows users to search for products by name or category. The UI components were designed using **Vuetify 3**, a UI library for Vue.js that provides a wide range of pre-built Material Design components. The form validation was implemented using **Vuelidate**, a validation library for Vue.js.

Overall, the application provides a seamless user experience, with responsive and user-friendly UI components. The application also features **Stripe** integration for handling online payments, ensuring a seamless and secure checkout experience for users.

## Key Features

- **Product catalog** -- Browse latest products on the home page with image, name, description, and price cards.
- **Category browsing** -- Dynamic category dropdown in the navbar with dedicated category pages listing all products.
- **Product detail** -- Detailed product view with image carousel (gallery), description, price, and variation selectors (color, size).
- **Shopping cart** -- Persistent cart with item summary table, quantity adjustment (increment/decrement), item removal, subtotals, tax, and grand total.
- **Checkout with Stripe** -- Full billing form with Vuelidate validation and dual Stripe payment modes (Session-based and Charge-based).
- **Order history** -- Authenticated user dashboard displaying past orders with product details, payment status, and totals.
- **Product search** -- Search dialog in the navbar with results rendered as product cards.
- **JWT authentication** -- Secure login/signup with Vuelidate form validation, password visibility toggle, and protected route guards.
- **Cart persistence** -- Anonymous cart linked by `cartId` in localStorage, merged with user cart on login.
- **Theme toggling** -- Light/dark theme switching via Vuetify's theme system.
- **Responsive navigation** -- Collapsible drawer menu on mobile, full navbar with cart badge on desktop.

## Pages and Routes

| Route                                               | View                      | Auth | Description                               |
| --------------------------------------------------- | ------------------------- | ---- | ----------------------------------------- |
| `/taberna`                                          | `HomeView.vue`            | No   | Landing page with latest products         |
| `/taberna-store/category/:category_slug`            | `CategoryDetailView.vue`  | No   | Products filtered by category             |
| `/taberna-store/category/:category_slug/:product_slug` | `ProductDetailView.vue` | No   | Product detail with gallery and variations|
| `/taberna/search`                                   | `SearchView.vue`          | No   | Product search results                    |
| `/taberna/cart`                                     | `CartView.vue`            | No   | Shopping cart summary                     |
| `/taberna/cart/checkout`                            | `CheckoutView.vue`        | Yes  | Billing form and Stripe payment           |
| `/taberna/cart/success`                             | `SuccessView.vue`         | No   | Order success confirmation                |
| `/taberna/cart/failed`                              | `FailedView.vue`          | No   | Payment failure notification              |
| `/taberna/dashboard`                                | `DashboardView.vue`       | Yes  | User order history                        |
| `/taberna/login`                                    | `LoginView.vue`           | No   | Login form with redirect support          |
| `/taberna/signup`                                   | `SignupView.vue`          | No   | Account registration form                 |

All routes use the `MainTabernaLayout` layout with `TheNavbar` and `TheFooter`.

## Architecture

```
src/
├── views/taberna/
│   ├── HomeView.vue              # Landing page with latest products
│   ├── CategoryDetailView.vue    # Category product listing
│   ├── ProductDetailView.vue     # Product detail with variations
│   ├── SearchView.vue            # Product search results
│   ├── CartView.vue              # Shopping cart summary
│   ├── CheckoutView.vue          # Billing + Stripe payment
│   ├── SuccessView.vue           # Order success page
│   ├── FailedView.vue            # Payment failure page
│   ├── DashboardView.vue         # Order history dashboard
│   ├── LoginView.vue             # Login form
│   └── SignupView.vue            # Registration form
├── components/taberna/
│   ├── TheNavbar.vue             # Navigation bar with category menu and cart badge
│   ├── TheFooter.vue             # Footer
│   ├── TheProductCard.vue        # Product card (image, name, price, details link)
│   ├── TheCartItem.vue           # Cart item row (quantity controls, remove)
│   └── TheOrderSummary.vue       # Order summary card for dashboard
├── layouts/taberna/
│   └── MainTabernaLayout.vue     # Layout wrapper (navbar + footer)
└── store/modules/tabernaData/
    ├── tabernaCartData.module.js    # Cart, checkout, Stripe order state
    ├── tabernaProductData.module.js # Product catalog state
    └── tabernaProfileData.module.js # Profile state (reserved)
```

## Components

### TheNavbar

Responsive navigation bar featuring:
- **Category dropdown** -- Dynamically fetched product categories from the API.
- **Apps Manager dropdown** -- Links to the main apps list and the Django backend.
- **Auth-aware links** -- Login/Signup when unauthenticated; Dashboard/Logout when authenticated.
- **Cart badge** -- Shows current cart item count.
- **Search dialog** -- Modal search field that navigates to the search results page.
- **Toggle Theme** -- Light/dark theme switching.
- Mobile: Collapsible navigation drawer with all features.

### TheProductCard

Reusable product card component displaying:
- Product image with loading placeholder spinner.
- Product name, truncated description, and price.
- "Details" button linking to the product detail page.

### TheCartItem

Cart table row component for each item, featuring:
- Product image and name (linked to product detail).
- Product variation details (color, size).
- Unit price and calculated line total.
- Increment/decrement quantity buttons.
- Remove item button (deletes entire line).

### TheOrderSummary

Dashboard order card displaying:
- Order number, date, payment status, and payment method.
- Tax and total amount.
- Table of ordered products with images, variations, quantities, and line totals.

## State Management

The Taberna module uses three namespaced Vuex store modules:

### tabernaCartData

Manages the shopping cart, checkout, and Stripe order flow.

| State Property | Type     | Description                                         |
| -------------- | -------- | --------------------------------------------------- |
| `cart`         | `Object` | Cart data (items, quantity, total, tax, grand_total) |
| `cartId`       | `String` | Anonymous cart ID persisted in localStorage          |

**Actions:**

| Action                | Description                                               |
| --------------------- | --------------------------------------------------------- |
| `getCart`             | Fetches the current cart (with optional `cart_id` param)  |
| `addToCart`           | Adds a product with selected color and size to the cart   |
| `removeFromCart`      | Decrements item quantity by one                           |
| `removeCartItemFully` | Removes an entire cart item line                          |
| `placeOrderStripe`    | Places an order via Stripe Session or Stripe Charge flow  |
| `placeOrderStatus`    | Confirms or fails an order after Stripe redirect          |

### tabernaProductData

Manages the product catalog and product detail data.

| State Property   | Type     | Description                                       |
| ---------------- | -------- | ------------------------------------------------- |
| `latestProducts` | `Array`  | Latest products displayed on the home page        |
| `productDetail`  | `Object` | Current product with variations (colors, sizes)   |

**Actions:**

| Action              | Description                                           |
| ------------------- | ----------------------------------------------------- |
| `getLatestProducts` | Fetches latest products from the API                  |
| `getProductDetail`  | Fetches a single product by category and product slug |

### tabernaProfileData

Reserved module for future profile-related state. Currently empty.

## API Endpoints

### Products

| Method | Endpoint                                             | Purpose                         |
| ------ | ---------------------------------------------------- | ------------------------------- |
| GET    | `/taberna-store/api/v1/latest-products/`             | Get latest products             |
| GET    | `/taberna-store/api/v1/products/:category_slug/`     | Get products by category        |
| GET    | `/taberna-store/api/v1/products/:category/:product`  | Get product detail + variations |
| GET    | `/taberna-store/api/v1/product-categories/`          | Get all product categories      |
| POST   | `/taberna-store/api/v1/products/search/`             | Search products by query        |

### Cart

| Method | Endpoint                                                  | Purpose                       |
| ------ | --------------------------------------------------------- | ----------------------------- |
| GET    | `/taberna-cart/api/cart/`                                  | Get current cart              |
| POST   | `/taberna-cart/api/add-to-cart/:productId/`                | Add product to cart           |
| DELETE | `/taberna-cart/api/cart-remove/:productId/:cartItemId/`    | Decrement item quantity       |
| DELETE | `/taberna-cart/api/cart-item-remove/:productId/:cartItemId/` | Remove entire cart item    |

### Orders

| Method | Endpoint                                               | Purpose                              |
| ------ | ------------------------------------------------------ | ------------------------------------ |
| POST   | `/taberna-orders/api/v1/place_order_stripe_session/`   | Create Stripe Checkout Session order |
| POST   | `/taberna-orders/api/v1/place_order_stripe_charge/`    | Create Stripe Charge order           |
| POST   | `/taberna-orders/api/v1/order_payment_success/`        | Confirm successful payment           |
| POST   | `/taberna-orders/api/v1/order_payment_failed/`         | Record failed payment                |
| GET    | `/taberna-profiles/api/v1/orders/`                     | Get user's order history             |

## Stripe Integration

The checkout supports two Stripe payment modes, configured via the `VITE_STRIPE_ACTION_TYPE` environment variable:

### Session Mode (`session`)

1. User fills out the billing form and clicks "Pay with Stripe".
2. The frontend sends billing data to `/taberna-orders/api/v1/place_order_stripe_session/`.
3. The backend creates a Stripe Checkout Session and returns a `checkout_url`.
4. The user is redirected to Stripe's hosted payment page.
5. After payment, Stripe redirects to `/taberna/cart/success?session_id=...` or `/taberna/cart/failed?session_id=...`.
6. The success/failed page sends the session ID to the backend for confirmation.

### Charge Mode (`charge`)

1. The Stripe Elements card input is mounted on the checkout page.
2. User fills out billing details and card information, then clicks "Pay with Stripe".
3. A Stripe token is created client-side via `stripe.createToken()`.
4. The token and billing data are sent to `/taberna-orders/api/v1/place_order_stripe_charge/`.
5. The backend processes the charge and returns the result.
6. On success, the user is redirected to the success page.

## Authentication

The platform uses **JWT (JSON Web Token)** authentication via the shared `authJWT` Vuex module:

1. **Signup** -- Registers a new user with username, first name, last name, email, and password (validated with Vuelidate).
2. **Login** -- Authenticates with email and password. On login, the anonymous `cartId` is sent to the backend to merge the guest cart with the user's account cart.
3. **Route guards** -- Routes with `meta.authJWT: true` (Checkout, Dashboard) redirect unauthenticated users to `/taberna/login` with a redirect query parameter.
4. **Logout** -- Clears JWT tokens, refreshes the cart (now anonymous), and redirects to login.

## Related Folders

- [Taberna Components](https://github.com/SerhiiKarnaukh/vue-test-manager/tree/main/src/components/taberna)
- [Taberna Vuex Store](https://github.com/SerhiiKarnaukh/vue-test-manager/tree/main/src/store/modules/tabernaData)

## Backend

The Django REST Framework backend powering Taberna is hosted on AWS.

See [Taberna Backend](https://karnaukh-webdev.com/category/django/taberna-drf-ecommerce/)
