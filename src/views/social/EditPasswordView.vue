<template>
  <v-main class="px-4 pb-4">
    <v-card max-width="400" class="mx-auto">
      <v-card-title class="mb-6">
        <h1>Edit Password</h1>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="editPasswordHandler">
          <v-text-field
            v-model.trim="state.password"
            :type="state.showPassword ? 'text' : 'password'"
            clearable
            label="Your old password"
            placeholder="Your old password"
            prepend-icon="mdi-lock"
            :append-inner-icon="state.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="state.showPassword = !state.showPassword"
            :error-messages="v$.password.$errors.map((e) => e.$message)"
          ></v-text-field>
          <v-text-field
            v-model.trim="state.password1"
            :type="state.showPassword ? 'text' : 'password'"
            clearable
            label="Your new password"
            placeholder="Your new password"
            prepend-icon="mdi-lock"
            :append-inner-icon="state.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="state.showPassword = !state.showPassword"
            :error-messages="v$.password1.$errors.map((e) => e.$message)"
          ></v-text-field>
          <v-text-field
            v-model.trim="state.password2"
            :type="state.showPassword ? 'text' : 'password'"
            clearable
            label="Repeat password"
            placeholder="Repeat password"
            prepend-icon="mdi-lock"
            :append-inner-icon="state.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="state.showPassword = !state.showPassword"
            :error-messages="v$.password2.$errors.map((e) => e.$message)"
          ></v-text-field>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn variant="flat" color="info" type="submit">
              Save changes
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-main>
</template>
<script>
import { reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import { useStore } from 'vuex'
export default {
  setup() {
    const store = useStore()
    const state = reactive({
      password: '',
      password1: '',
      password2: '',
      showPassword: false,
    })
    const rules = {
      password: { required, minLength: minLength(8) },
      password1: { required, minLength: minLength(8) },
      password2: { required, minLength: minLength(8) },
    }
    const v$ = useVuelidate(rules, state)

    const editPasswordHandler = async () => {
      const isFormCorrect = await v$._value.$validate()
      if (state.password1 !== state.password2) {
        store.dispatch('alert/setMessage', {
          value: ['The password does not match'],
          type: 'error',
        })
        return
      }
      if (isFormCorrect) {
        let formData = new FormData()
        formData.append('old_password', state.password)
        formData.append('new_password1', state.password1)
        formData.append('new_password2', state.password2)
        await store.dispatch('socialProfileData/editPassword', formData)
      }
    }
    return {
      state,
      v$,
      editPasswordHandler,
    }
  },
}
</script>
