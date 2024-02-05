<template>
  <v-main class="px-4 pb-4">
    <v-card max-width="700" class="mx-auto">
      <v-card-title class="mb-6">
        <h2 class="text-md-h3 font-weight-medium">Create an account</h2>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="registerHandler">
          <v-text-field
            v-model.trim="state.username"
            label="Username"
            prepend-icon="mdi-account-edit"
            placeholder="Create your Username"
            :error-messages="v$.username.$errors.map((e) => e.$message)"
          ></v-text-field>
          <v-text-field
            v-model.trim="state.first_name"
            label="First Name"
            prepend-icon="mdi-account-edit"
            placeholder="Enter your First Name"
            :error-messages="v$.first_name.$errors.map((e) => e.$message)"
          ></v-text-field>
          <v-text-field
            v-model.trim="state.last_name"
            label="Last Name"
            prepend-icon="mdi-account-edit"
            placeholder="Enter your Last Name"
            :error-messages="v$.last_name.$errors.map((e) => e.$message)"
          ></v-text-field>
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
          <v-text-field
            v-model.trim="state.password2"
            :type="state.showPassword ? 'text' : 'password'"
            clearable
            label="Repeat password"
            placeholder="Repeat your password"
            prepend-icon="mdi-lock"
            :append-inner-icon="state.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="state.showPassword = !state.showPassword"
            :error-messages="v$.password2.$errors.map((e) => e.$message)"
          ></v-text-field>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn variant="flat" color="success" type="submit">Submit</v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="warning" to="/social/login">
              I have an account
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-main>
</template>
<script>
import { reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, maxLength } from '@vuelidate/validators'
import router from '@/router'
import { useStore } from 'vuex'
export default {
  setup() {
    const store = useStore()
    const state = reactive({
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password2: '',
      showPassword: false,
    })
    const rules = {
      username: { required, minLength: minLength(3), maxLength: maxLength(50) },
      first_name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(50),
      },
      last_name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(50),
      },
      email: { required, email, maxLength: maxLength(100) },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(128),
      },
      password2: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(128),
      },
    }

    const v$ = useVuelidate(rules, state)

    const registerHandler = async () => {
      const isFormCorrect = await v$._value.$validate()
      if (isFormCorrect) {
        if (state.password !== state.password2) {
          store.dispatch('alert/setMessage', {
            value: ["The passwords doesn't match"],
            type: 'error',
          })
        } else {
          const formData = {
            username: state.username,
            first_name: state.first_name,
            last_name: state.last_name,
            email: state.email,
            password: state.password,
            registration_source: 'social_network',
          }
          try {
            await store.dispatch('authToken/register', formData)
            router.push('/social/login')
          } catch (e) {
            return
          }
          return
        }
      }
    }

    return { state, v$, registerHandler }
  },
}
</script>
