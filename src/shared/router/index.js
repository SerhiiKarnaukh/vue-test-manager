import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import ai_labRoutes from '@/apps/ai_lab/routes'
import apps_managerRoutes from '@/apps/apps_manager/routes'
import socialRoutes from '@/apps/social/routes'
import tabernaRoutes from '@/apps/taberna/routes'
import { resolveAuthRedirect } from './guards'
import { applyLegacyGuardCompat } from './legacy-guard-compat'

const routes = [
  ...apps_managerRoutes,
  ...tabernaRoutes,
  ...socialRoutes,
  ...ai_labRoutes,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

// TODO(remove-after-vuetify-upgrade): remove this compatibility shim once
// Vuetify and related plugins stop registering legacy navigation guards with `next`.
applyLegacyGuardCompat(router)

router.beforeEach((to) =>
  resolveAuthRedirect(to, store.getters['authJWT/isAuthenticated'])
)

export default router
