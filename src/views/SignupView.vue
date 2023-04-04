<template>
  <v-main class="px-4 pb-4">
    <v-card
      max-width="700"
      class="mx-auto"
    > <v-card-title class="mb-6">
        <h2 class="text-md-h3 font-weight-medium">Create an account</h2>
      </v-card-title>
      <app-message />
      <v-card-text>
        <v-form @submit.prevent="registerHandler">
          <v-text-field
            v-model.trim="state.email"
            label="Email"
            prepend-icon="mdi-email-outline"
            placeholder="Enter your email"
            :error-messages="v$.email.$errors.map(e => e.$message)"
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
            :error-messages="v$.password.$errors.map(e => e.$message)"
          ></v-text-field>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              variant="flat"
              color="success"
              type="submit"
              :disabled="v$.$invalid"
            >
              Submit
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              variant="flat"
              color="warning"
              to="/login"
            >
              I have an account
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script>
  import AppMessage from '@/components/ui/AppMessage.vue'
  import { reactive } from 'vue'
  import { useVuelidate } from '@vuelidate/core'
  import { required, email, minLength } from '@vuelidate/validators'
  import router from '@/router'
  import {useStore} from 'vuex'
    export default {
        components: {AppMessage},
        setup () {
            const store = useStore()
            const state = reactive({
                email: '',
                password: '',
            })
            const rules = {
                email: { required, email },
                password: { required, minLength: minLength(6) },
            }

            const v$ = useVuelidate(rules, state)

            const registerHandler = async () => {
                const isFormCorrect = await v$._value.$validate()
                if (isFormCorrect) {
                    const formData = {
                        email: state.email,
                        password: state.password,
                    }
                    try {
                        await store.dispatch('auth/register', formData)
                        router.push('/login')
                    } catch(e){
                        return
                    }
                    return
                }
            };

        return { state, v$, registerHandler }
    },
    data: () => ({
        showPassword: false,
    }),
  }
</script>

<style scoped>
</style>
