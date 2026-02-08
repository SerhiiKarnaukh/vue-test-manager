# Vue Applications Manager

A frontend application that displays a collection of projects built with Vue.js. The application provides an intuitive interface where users can browse through a list of projects, each represented as a card with an image, a short description, and buttons to either visit the live application or view more details about it.

### Live Demo on Firebase: <https://karnaukh-vue-test.web.app>

![VAM screenshot](https://github.com/SerhiiKarnaukh/vue-test-manager/blob/main/vue_manager.jpg)

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Sub-Applications](#sub-applications)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)
- [CI/CD Pipeline](#cicd-pipeline)
- [Available Scripts](#available-scripts)
- [Backend](#backend)

## Overview

The completed test task was to create a Vue Applications Manager -- a frontend application that showcases multiple Vue.js projects in an organized and visually appealing manner. The application ensures smooth navigation, responsiveness, and ease of use.

The frontend was built using **Vue.js**, a popular JavaScript framework for building web applications. The project leverages **Vue Router** for seamless navigation between different sections. The UI components were designed using **Vuetify**, ensuring a modern, responsive, and user-friendly design.

For data fetching, the application utilizes **Axios** to retrieve project details from a **Django** backend hosted on **AWS**. The frontend itself is deployed on **Firebase Hosting**, ensuring fast and reliable access to the application. The development environment is powered by **Vite**, providing optimized build times and a smooth developer experience.

## Tech Stack

| Technology  | Purpose                          |
| ----------- | -------------------------------- |
| Vue.js 3    | Frontend framework               |
| Vue Router  | Client-side routing              |
| Vuex        | Global state management          |
| Pinia       | Store management (newer modules) |
| Vuetify 3   | Material Design UI components    |
| Axios       | HTTP client for API requests     |
| Vite        | Build tool and dev server        |
| GSAP        | Animation library                |
| Three.js    | 3D rendering                     |
| Vuelidate   | Form validation                  |
| CryptoJS    | Client-side encryption           |
| Sass        | CSS preprocessor                 |
| Firebase    | Hosting                          |
| Docker      | Containerized development        |
| GitHub Actions | CI/CD pipeline                |

## Sub-Applications

The project contains several independent sub-applications, each with its own layout, components, and Vuex store modules:

### 1. Apps Manager (Home)

The main landing page that displays a collection of Vue.js projects as cards with images, descriptions, and action buttons.

- **Route:** `/`
- **Layout:** `MainAppsManagerLayout`
- **Features:** Project browsing, search

### 2. Taberna eCommerce

A full-featured e-commerce application with product catalog, shopping cart, and Stripe checkout integration.

- **Route:** `/taberna`
- **Live Demo:** <https://karnaukh-vue-test.web.app/taberna>
- **Layout:** `MainTabernaLayout`
- **Features:** Product browsing, category filtering, cart, checkout, JWT authentication, user dashboard
- **Store Modules:** `tabernaCartData`, `tabernaProductData`, `tabernaProfileData`
- **Backend:** [Taberna Backend](https://django.karnaukh-webdev.com/category/django/taberna-drf-ecommerce/)

![Taberna eCommerce screenshot](https://github.com/SerhiiKarnaukh/vue-test-manager/blob/main/src/views/taberna/taberna_vue.jpg)

### 3. Social Network DRF

A social networking platform with posts, profiles, real-time chat, friend management, and notifications.

- **Route:** `/social/home`
- **Live Demo:** <https://karnaukh-vue-test.web.app/social/home>
- **Layout:** `MainSocialLayout`
- **Features:** Posts feed, user profiles, friends, chat, notifications, trends, search, JWT authentication
- **Store Modules:** `socialPostData`, `socialProfileData`, `socialChatData`, `socialNotificationData`
- **Backend:** [Social Network Backend](https://django.karnaukh-webdev.com/category/django/social-network-drf/)

![Social Network screenshot](https://github.com/SerhiiKarnaukh/vue-test-manager/blob/main/src/views/social/social_network_main.jpg)

### 4. AI Lab

An AI-powered laboratory with image generation, voice generation, and real-time chat capabilities.

- **Route:** `/ai-lab`
- **Live Demo:** <https://karnaukh-vue-test.web.app/ai-lab>
- **Layout:** `MainAILabLayout`
- **Features:** Image generator, voice generator, real-time chat
- **Store Modules:** `aiLabChatData`
- **Backend:** [AI Lab Backend](https://django.karnaukh-webdev.com/category/django/ai-lab-back-end/)

![AI Lab screenshot](https://github.com/SerhiiKarnaukh/vue-test-manager/blob/main/src/views/ai_lab/ai_lab_main.jpg)

### 5. Hyper 3D

A 3D visualization module powered by Three.js with model loading and animation capabilities.

- **Route:** `/hyper3d`
- **Layout:** `MainHyper3dLayout`
- **Features:** 3D model viewer, animations, local model loading

## Project Structure

```
src/
├── App.vue                     # Root component with dynamic layout switching
├── main.js                     # Application entry point
├── axios-interceptor.js        # Axios request/response interceptor
├── assets/                     # Static assets (logos, images)
├── components/                 # Reusable UI components
│   ├── ui/                     # Shared UI components (AppMessage)
│   ├── appsmanager/            # Apps Manager components
│   ├── taberna/                # Taberna eCommerce components
│   ├── social/                 # Social Network components
│   ├── ai_lab/                 # AI Lab components
│   └── hyper3d/                # Hyper 3D components
├── layouts/                    # Layout wrappers per sub-application
│   ├── appsmanager/
│   ├── taberna/
│   ├── social/
│   ├── ai_lab/
│   └── hyper3d/
├── plugins/                    # Vue plugins configuration
│   ├── vuetify.js              # Vuetify setup
│   └── webfontloader.js        # Web font loading
├── router/
│   └── index.js                # Vue Router configuration with auth guards
├── store/                      # Vuex store
│   ├── index.js                # Root store with global state
│   └── modules/                # Namespaced store modules
│       ├── alert.module.js
│       ├── authJWT.module.js
│       ├── authToken.module.js
│       ├── aiLabData/
│       ├── socialNetworkData/
│       └── tabernaData/
├── utils/                      # Utility functions
│   ├── cryptoUtils.js          # Encryption helpers
│   ├── domainUtils.js          # Domain-related utilities
│   └── error.js                # Error handling utilities
└── views/                      # Page-level view components
    ├── appsmanager/
    ├── taberna/
    ├── social/
    ├── ai_lab/
    └── hyper3d/
```

## Prerequisites

- **Node.js** v22.20.0 (recommended)
- **npm** (comes with Node.js)
- **Docker** (optional, for containerized development)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SerhiiKarnaukh/vue-test-manager.git
cd vue-test-manager
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration values (see [Environment Variables](#environment-variables)).

### 4. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Environment Variables

Create a `.env` file in the project root based on `.env.example`:

| Variable                 | Description                        | Example                      |
| ------------------------ | ---------------------------------- | ---------------------------- |
| `VITE_REMOTE_HOST`      | Backend API base URL               | `http://127.0.0.1:8000`     |
| `VITE_ENCRIPTION_KEY`   | Encryption key for CryptoJS        | `your-secret-key`           |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key (Taberna)  | `pk_test_...`               |
| `VITE_STRIPE_ACTION_TYPE`| Stripe action type                | `session` or `charge`        |
| `NODE_VERSION`           | Node.js version for local setup   | `22.17.0`                    |

## Docker Setup

### Using Docker Compose

```bash
docker-compose up --build
```

This starts the development server inside a container on port **5173**.

### Using Makefile

```bash
make run        # Start dev server
make node       # Install and configure Node.js version via nvm
make update     # Clean install with dependency updates
```

## CI/CD Pipeline

The project uses **GitHub Actions** for continuous deployment to Firebase Hosting. On every push to the `main` branch, the pipeline automatically:

1. Checks out the code
2. Installs dependencies (`npm ci`)
3. Builds the production bundle (`npm run build`) with environment secrets
4. Deploys to Firebase Hosting

The workflow configuration is located at `.github/workflows/firebase-hosting-merge.yml`.

## Available Scripts

| Command          | Description                              |
| ---------------- | ---------------------------------------- |
| `npm run dev`    | Start Vite development server            |
| `npm run build`  | Build for production                     |
| `npm run serve`  | Preview the production build locally     |
| `npm run lint`   | Lint and auto-fix source files           |

## Backend

The Django REST Framework backend is hosted on AWS and provides the API for all sub-applications.

- **Taberna Backend:** [django.karnaukh-webdev.com/category/django/taberna-drf-ecommerce/](https://django.karnaukh-webdev.com/category/django/taberna-drf-ecommerce/)
- **Social Network Backend:** [django.karnaukh-webdev.com/category/django/social-network-drf/](https://django.karnaukh-webdev.com/category/django/social-network-drf/)
- **AI Lab Backend:** [django.karnaukh-webdev.com/category/django/ai-lab-back-end/](https://django.karnaukh-webdev.com/category/django/ai-lab-back-end/)

### Customize Configuration

See [Vite Configuration Reference](https://vite.dev/config/).
