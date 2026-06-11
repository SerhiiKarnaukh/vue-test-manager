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
    <auth-signup-form
      v-else
      name-prefix="taberna"
      login-path="/taberna/login"
      @submit="registerHandler"
    />
  </v-main>
</template>

<script>
import { ref } from 'vue'
import AuthSignupForm from '@/shared/auth/components/AuthSignupForm.vue'
import router from '@/router'
import { useStore } from 'vuex'

export default {
  components: { AuthSignupForm },
  setup() {
    const store = useStore()
    const loading = ref(false)

    const registerHandler = async (formData) => {
      try {
        loading.value = true
        await store.dispatch('authToken/register', {
          ...formData,
          registration_source: 'taberna',
        })
        router.push('/taberna/login')
      } catch (e) {
        return
      } finally {
        loading.value = false
      }
    }

    return { loading, registerHandler }
  },
}
</script>
