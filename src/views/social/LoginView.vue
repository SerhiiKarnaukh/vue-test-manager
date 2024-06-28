<template>
  <v-main class="px-4 pb-4">
    <v-card max-width="400" class="mx-auto">
      <v-card-title class="mb-6">
        <h1>Login</h1>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="loginHandler">
          <v-text-field
            v-model.trim="state.email"
            label="Email"
            prepend-icon="mdi-email-outline"
            placeholder="Enter your Email"
            :error-messages="v$.email.$errors.map((e) => e.$message)"
          ></v-text-field>
          <v-text-field
            v-model.trim="state.password"
            :type="state.showPassword ? 'text' : 'password'"
            clearable
            label="Password"
            placeholder="Enter your password"
            prepend-icon="mdi-lock"
            :append-inner-icon="state.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="state.showPassword = !state.showPassword"
            :error-messages="v$.password.$errors.map((e) => e.$message)"
          ></v-text-field>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn variant="flat" color="success" to="/social/signup">
              Register
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="info" type="submit"> Login </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-main>
</template>
<script>
import { reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import router from '@/router'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default {
  setup() {
    const route = useRoute()
    const store = useStore()
    const state = reactive({
      email: '',
      password: '',
      showPassword: false,
    })

    const rules = {
      email: { required, email },
      password: { required, minLength: minLength(6) },
    }

    if (route.query.message) {
      store.dispatch('alert/setMessage', {
        value: ['Please login'],
        type: 'warning',
      })
    }

    const v$ = useVuelidate(rules, state)

    const loginHandler = async () => {
      const isFormCorrect = await v$._value.$validate()
      if (isFormCorrect) {
        const formData = {
          email: state.email,
          password: state.password,
        }
        try {
          await store.dispatch('authJWT/login', formData)
          await store.dispatch('socialProfileData/getUserData')
          await store.dispatch('socialNotificationData/getNotifications')
          await store.dispatch(
            'socialNotificationData/connectNotificationWebSocket'
          )
          router.push('/social/home')
        } catch (e) {
          return
        }
        return
      }
    }

    return { state, v$, loginHandler }
  },
}
</script>
