<template>
  <v-main class="px-4 pb-4">
    <v-card-title v-if="state.loading">
      <v-row align="center" class="fill-height ma-0" justify="center">
        <v-progress-circular
          color="grey lighten-5"
          indeterminate
        ></v-progress-circular>
      </v-row>
    </v-card-title>
    <v-card v-else max-width="400" class="mx-auto">
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
import { reactive, computed } from 'vue'
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
      loading: false,
    })
    const rules = {
      email: { required, email },
      password: { required, minLength: minLength(6) },
    }

    const cartId = computed(() => {
      return store.getters['tabernaCartData/cartId']
    })

    const v$ = useVuelidate(rules, state)

    const loginHandler = async () => {
      const isFormCorrect = await v$._value.$validate()
      if (isFormCorrect) {
        const formData = {
          email: state.email,
          password: state.password,
          activeApp: 'taberna',
          login_source: 'taberna',
          cart_id: cartId.value,
        }
        try {
          state.loading = true
          await store.dispatch('authJWT/login', formData)
          await store.dispatch('tabernaCartData/getCart')
          const redirectPath = route.query.redirect || '/taberna/dashboard'
          router.push(redirectPath)
          store.commit('tabernaCartData/clearCartId')
        } catch (e) {
          return
        } finally {
          state.loading = false
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
