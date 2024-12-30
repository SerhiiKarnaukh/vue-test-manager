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
            :type="showPassword ? 'text' : 'password'"
            clearable
            label="Password"
            placeholder="Enter your password"
            prepend-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
            :error-messages="v$.password.$errors.map((e) => e.$message)"
          ></v-text-field>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn variant="flat" color="success" to="/taberna/signup">
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
    if (route.query.message) {
      store.dispatch('alert/setMessage', {
        value: ['Please login'],
        type: 'warning',
      })
    }
    const state = reactive({
      email: '',
      password: '',
    })
    const rules = {
      email: { required, email },
      password: { required, minLength: minLength(6) },
    }

    const v$ = useVuelidate(rules, state)

    const loginHandler = async () => {
      const isFormCorrect = await v$._value.$validate()
      if (isFormCorrect) {
        const formData = {
          email: state.email,
          password: state.password,
          activeApp: 'taberna',
        }
        try {
          await store.dispatch('authJWT/login', formData)
          router.push('/taberna')
        } catch (e) {
          return
        }
        return
      }
    }

    return { state, v$, loginHandler }
  },
  data: () => ({
    showPassword: false,
  }),
}
</script>
