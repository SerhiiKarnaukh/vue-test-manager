<template>
  <v-card max-width="400" class="mx-auto">
    <v-card-title class="mb-6">
      <h1>Login</h1>
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="onSubmit">
        <v-text-field
          v-model.trim="state.email"
          label="Email"
          type="email"
          :name="`${namePrefix}_login_email`"
          autocomplete="username"
          prepend-icon="mdi-email-outline"
          placeholder="Enter your Email"
          :error-messages="emailErrors"
        ></v-text-field>
        <v-text-field
          v-model.trim="state.password"
          :type="state.showPassword ? 'text' : 'password'"
          :name="`${namePrefix}_login_password`"
          autocomplete="current-password"
          clearable
          label="Password"
          placeholder="Enter your password"
          prepend-icon="mdi-lock"
          :append-inner-icon="state.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="state.showPassword = !state.showPassword"
          :error-messages="passwordErrors"
        ></v-text-field>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn variant="flat" color="success" :to="signupPath">
            Register
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="info" type="submit"> Login </v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'

export default {
  name: 'AuthLoginForm',
  props: {
    namePrefix: {
      type: String,
      required: true,
    },
    signupPath: {
      type: String,
      required: true,
    },
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const state = reactive({
      email: '',
      password: '',
      showPassword: false,
    })

    const rules = {
      email: { required, email },
      password: { required, minLength: minLength(6) },
    }

    const v$ = useVuelidate(rules, state)

    const emailErrors = computed(() =>
      v$.value.email.$errors.map((e) => e.$message)
    )
    const passwordErrors = computed(() =>
      v$.value.password.$errors.map((e) => e.$message)
    )

    const onSubmit = async () => {
      const isFormCorrect = await v$.value.$validate()
      if (!isFormCorrect) return

      emit('submit', {
        email: state.email,
        password: state.password,
      })
    }

    return { state, emailErrors, passwordErrors, onSubmit }
  },
}
</script>
