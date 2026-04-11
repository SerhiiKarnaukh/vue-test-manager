<template>
  <v-theme-provider theme="F1DarkTheme" with-background>
    <v-main class="f1-auth">
      <v-container class="f1-auth__container" fluid>
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" sm="8" md="5" lg="4" xl="3">
            <!-- Logo -->
            <div class="f1-auth__logo text-center mb-6">
              <v-icon size="40" color="primary" class="mb-2">mdi-flag-checkered</v-icon>
              <h1 class="f1-auth__title">PIT WALL</h1>
              <p class="f1-auth__subtitle">Command Center</p>
            </div>

            <!-- Loading -->
            <div v-if="state.loading" class="text-center py-8">
              <v-progress-circular
                color="primary"
                indeterminate
                size="48"
              />
            </div>

            <!-- Login Form -->
            <v-card v-else class="f1-auth__card" variant="outlined">
              <v-card-title class="text-center pb-0">
                <span class="text-h6">Sign In</span>
              </v-card-title>

              <v-card-text class="pt-4">
                <v-form @submit.prevent="loginHandler">
                  <v-text-field
                    v-model.trim="state.email"
                    label="Email"
                    type="email"
                    name="f1_login_email"
                    autocomplete="username"
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
                    name="f1_login_password"
                    autocomplete="current-password"
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

                  <v-btn
                    type="submit"
                    color="primary"
                    block
                    size="large"
                    class="mt-2 mb-4"
                    :loading="state.loading"
                  >
                    Enter Pit Wall
                  </v-btn>

                  <v-divider class="mb-4" />

                  <div class="text-center">
                    <span class="text-secondary text-body-2">
                      No access yet?
                    </span>
                    <v-btn
                      variant="text"
                      color="primary"
                      size="small"
                      to="/f1/signup"
                    >
                      Request Access
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
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'

const router = useRouter()
const route = useRoute()
const store = useStore()

const state = reactive({
  email: '',
  password: '',
  showPassword: false,
  lockAutofill: true,
  loading: false
})

const rules = {
  email: { required, email },
  password: { required, minLength: minLength(6) }
}

const v$ = useVuelidate(rules, state)

function unlockAutofill() {
  if (state.lockAutofill) {
    state.lockAutofill = false
  }
}

if (route.query.message) {
  store.dispatch('alert/setMessage', {
    value: ['Please sign in to access Pit Wall'],
    type: 'warning'
  })
}

async function loginHandler() {
  const valid = await v$.value.$validate()
  if (!valid) return

  state.loading = true
  try {
    await store.dispatch('authJWT/login', {
      email: state.email,
      password: state.password,
      activeApp: 'f1_pitwall',
      login_source: 'f1_pitwall',
    })
    const me = await store.dispatch('f1Data/sessions/fetchCurrentUser')
    if (!me) {
      return
    }

    const redirect = route.query.redirect || '/f1/dashboard'
    router.push(redirect)
  } catch {
    // Error is handled by authJWT/login via alert store
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
