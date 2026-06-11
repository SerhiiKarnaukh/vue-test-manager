<template>
  <v-main class="px-4 pb-4">
    <v-card-title v-if="loading">
      <v-row align="center" class="fill-height ma-0" justify="center">
        <v-progress-circular
          color="grey lighten-5"
          indeterminate
        ></v-progress-circular>
      </v-row>
    </v-card-title>
    <auth-login-form
      v-else
      name-prefix="social"
      signup-path="/social/signup"
      @submit="loginHandler"
    />
  </v-main>
</template>

<script>
import { ref } from 'vue'
import AuthLoginForm from '@/shared/auth/components/AuthLoginForm.vue'
import router from '@/router'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  components: { AuthLoginForm },
  setup() {
    const route = useRoute()
    const store = useStore()
    const loading = ref(false)

    if (route.query.message) {
      store.dispatch('alert/setMessage', {
        value: ['Please login'],
        type: 'warning',
      })
    }

    const loginHandler = async ({ email, password }) => {
      const formData = {
        email,
        password,
        activeApp: 'social',
        login_source: 'social',
      }
      try {
        loading.value = true
        await store.dispatch('authJWT/login', formData)
        await store.dispatch('socialProfileData/getUserData')
        await store.dispatch('socialNotificationData/getNotifications')
        await store.dispatch(
          'socialNotificationData/connectNotificationWebSocket'
        )
        router.push('/social/home')
      } catch (e) {
        return
      } finally {
        loading.value = false
      }
    }

    return { loading, loginHandler }
  },
}
</script>
