<template>
  <v-navigation-drawer
    :model-value="modelValue"
    :rail="rail"
    :permanent="!mobile"
    :temporary="mobile"
    class="f1-sidebar"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-list density="compact" nav>
      <v-list-item
        v-for="item in visibleItems"
        :key="item.route"
        :to="item.route"
        :prepend-icon="item.icon"
        :title="item.label"
        :active="isActive(item.route)"
        color="primary"
        class="f1-sidebar__item"
      />
    </v-list>

    <template #append>
      <div class="pa-2">
        <v-btn
          block
          variant="text"
          size="small"
          :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
          @click="rail = !rail"
        />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useDisplay } from 'vuetify'

defineProps({
  modelValue: {
    type: Boolean,
    default: true
  }
})

defineEmits(['update:modelValue'])

const route = useRoute()
const store = useStore()
const { mobile } = useDisplay()
const rail = ref(false)

const isAuthenticated = computed(() => store.getters['authJWT/isAuthenticated'])
const isAdmin = computed(() => store.getters['f1Data/sessions/isAdmin'])

const navItems = [
  { label: 'Dashboard', route: '/f1/dashboard', icon: 'mdi-view-dashboard', admin: false },
  { label: 'Telemetry', route: '/f1/telemetry', icon: 'mdi-chart-line', admin: false },
  { label: 'Timing', route: '/f1/timing', icon: 'mdi-timer', admin: false },
  { label: 'Strategy', route: '/f1/strategy', icon: 'mdi-chess-queen', admin: false },
  { label: 'Weather', route: '/f1/weather', icon: 'mdi-weather-partly-cloudy', admin: false },
  { label: 'Race Control', route: '/f1/race-control', icon: 'mdi-flag-checkered', admin: false },
  { label: 'Security', route: '/f1/security', icon: 'mdi-shield-lock', admin: true },
  { label: 'System Health', route: '/f1/system-health', icon: 'mdi-heart-pulse', admin: true }
]

const visibleItems = computed(() => {
  if (!isAuthenticated.value) return []
  return navItems.filter((item) => !item.admin || isAdmin.value)
})

function isActive(path) {
  return route.path === path
}
</script>

<style lang="scss" scoped>
.f1-sidebar {
  border-right: 1px solid #30363d !important;

  &__item {
    border-radius: 6px;
    margin-bottom: 2px;
    font-size: 13px;
  }
}
</style>
