<template>
  <v-theme-provider theme="F1DarkTheme" with-background>
    <v-main class="f1-auth">
      <v-container class="f1-auth__container" fluid>
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" sm="8" md="6" lg="5" xl="4">
            <!-- Logo -->
            <div class="f1-auth__logo text-center mb-6">
              <v-icon size="40" color="primary" class="mb-2">mdi-flag-checkered</v-icon>
              <h1 class="f1-auth__title">PIT WALL</h1>
              <p class="f1-auth__subtitle">Request Access</p>
            </div>

            <!-- Loading -->
            <div v-if="state.loading" class="text-center py-8">
              <v-progress-circular
                color="primary"
                indeterminate
                size="48"
              />
            </div>

            <!-- Signup Form -->
            <v-card v-else class="f1-auth__card" variant="outlined">
              <v-card-title class="text-center pb-0">
                <span class="text-h6">Create Account</span>
              </v-card-title>

              <v-card-text class="pt-4">
                <v-form @submit.prevent="registerHandler">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model.trim="state.first_name"
                        label="First Name"
                        name="f1_signup_first_name"
                        autocomplete="given-name"
                        prepend-inner-icon="mdi-account-outline"
                        variant="outlined"
                        density="comfortable"
                        :readonly="state.lockAutofill"
                        class="mb-3"
                        :error-messages="v$.first_name.$errors.map((e) => e.$message)"
                        @focus="unlockAutofill"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model.trim="state.last_name"
                        label="Last Name"
                        name="f1_signup_last_name"
                        autocomplete="family-name"
                        prepend-inner-icon="mdi-account-outline"
                        variant="outlined"
                        density="comfortable"
                        :readonly="state.lockAutofill"
                        class="mb-3"
                        :error-messages="v$.last_name.$errors.map((e) => e.$message)"
                        @focus="unlockAutofill"
                      />
                    </v-col>
                  </v-row>

                  <v-text-field
                    v-model.trim="state.username"
                    label="Username"
                    name="f1_signup_username"
                    autocomplete="username"
                    prepend-inner-icon="mdi-at"
                    variant="outlined"
                    density="comfortable"
                    :readonly="state.lockAutofill"
                    class="mb-3"
                    :error-messages="v$.username.$errors.map((e) => e.$message)"
                    @focus="unlockAutofill"
                  />

                  <v-text-field
                    v-model.trim="state.email"
                    label="Email"
                    type="email"
                    name="f1_signup_email"
                    autocomplete="email"
                    prepend-inner-icon="mdi-email-outline"
                    variant="outlined"
                    density="comfortable"
                    :readonly="state.lockAutofill"
                    class="mb-3"
                    :error-messages="v$.email.$errors.map((e) => e.$message)"
                    @focus="unlockAutofill"
                  />

                  <v-text-field
                    v-model.trim="state.password"
                    :type="state.showPassword ? 'text' : 'password'"
                    label="Password"
                    name="f1_signup_password"
                    autocomplete="new-password"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-inner-icon="state.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    variant="outlined"
                    density="comfortable"
                    :readonly="state.lockAutofill"
                    class="mb-3"
                    :error-messages="v$.password.$errors.map((e) => e.$message)"
                    @click:append-inner="state.showPassword = !state.showPassword"
                    @focus="unlockAutofill"
                  />

                  <v-text-field
                    v-model.trim="state.password2"
                    :type="state.showPassword ? 'text' : 'password'"
                    label="Confirm Password"
                    name="f1_signup_password2"
                    autocomplete="new-password"
                    prepend-inner-icon="mdi-lock-check-outline"
                    :append-inner-icon="state.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    variant="outlined"
                    density="comfortable"
                    :readonly="state.lockAutofill"
                    class="mb-3"
                    :error-messages="v$.password2.$errors.map((e) => e.$message)"
                    @click:append-inner="state.showPassword = !state.showPassword"
                    @focus="unlockAutofill"
                  />

                  <v-btn
                    type="submit"
                    color="primary"
                    block
                    size="large"
                    class="mt-2 mb-4"
                    :loading="state.loading"
                  >
                    Create Account
                  </v-btn>

                  <v-divider class="mb-4" />

                  <div class="text-center">
                    <span class="text-secondary text-body-2">
                      Already have access?
                    </span>
                    <v-btn
                      variant="text"
                      color="primary"
                      size="small"
                      to="/f1/login"
                    >
                      Sign In
                    </v-btn>
                  </div>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-theme-provider>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, maxLength } from '@vuelidate/validators'
import { auth as f1AuthApi } from '@/utils/f1/api'
import { error as mapError } from '@/utils/error'

const router = useRouter()
const store = useStore()

const state = reactive({
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password2: '',
  showPassword: false,
  lockAutofill: true,
  loading: false
})

const rules = {
  username: { required, minLength: minLength(3), maxLength: maxLength(50) },
  first_name: { required, minLength: minLength(2), maxLength: maxLength(50) },
  last_name: { required, minLength: minLength(2), maxLength: maxLength(50) },
  email: { required, email, maxLength: maxLength(100) },
  password: { required, minLength: minLength(6), maxLength: maxLength(128) },
  password2: { required, minLength: minLength(6), maxLength: maxLength(128) }
}

const v$ = useVuelidate(rules, state)

function unlockAutofill() {
  if (state.lockAutofill) {
    state.lockAutofill = false
  }
}

async function registerHandler() {
  const valid = await v$.value.$validate()
  if (!valid) return

  if (state.password !== state.password2) {
    store.dispatch('alert/setMessage', {
      value: ['Passwords do not match'],
      type: 'error'
    })
    return
  }

  state.loading = true
  try {
    await f1AuthApi.register({
      username: state.username,
      first_name: state.first_name,
      last_name: state.last_name,
      email: state.email,
      password: state.password
    })
    store.dispatch('alert/setMessage', {
      value: ['Account created. Please check your email and activate your account before login.'],
      type: 'success'
    })
    router.push('/f1/login')
  } catch (err) {
    store.dispatch('alert/setMessage', {
      value: err?.response?.data ? mapError(err.response.data) : ['Registration failed. Please try again.'],
      type: 'error'
    })
  } finally {
    state.loading = false
  }
}

</script>

<style lang="scss" scoped>
.f1-auth {
  min-height: 100vh;
  background-color: #0d1117;

  &__container {
    min-height: 100vh;
  }

  &__logo {
    user-select: none;
  }

  &__title {
    font-family: 'Roboto Mono', monospace;
    font-weight: 700;
    font-size: 28px;
    letter-spacing: 4px;
    color: #e6edf3;
  }

  &__subtitle {
    font-family: 'Roboto Mono', monospace;
    font-size: 12px;
    letter-spacing: 2px;
    color: #8b949e;
    text-transform: uppercase;
  }

  &__card {
    border-color: #30363d !important;
    background-color: #161b22 !important;
  }
}
</style>
