<template>
  <v-main class="px-4 pb-4">
    <v-card max-width="700" class="mx-auto">
      <v-card-title class="mb-6">
        <h2 class="text-md-h3 font-weight-medium">Edit Profile</h2>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitForm">
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
          <v-file-input
            label="Avatar"
            prepend-icon="mdi-file"
            @change="handleFileChange"
          ></v-file-input>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn variant="flat" color="success" type="submit"
              >Save changes</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="error" to="/social/edit/password">
              Edit Password
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-main>
</template>
<script>
import axios from 'axios'
import { reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
  setup() {
    const router = useRouter()
    const store = useStore()

    const state = reactive({
      username: store.getters['socialProfileData/user'].username,
      first_name: store.getters['socialProfileData/user'].first_name,
      last_name: store.getters['socialProfileData/user'].last_name,
      email: store.getters['socialProfileData/user'].email,
      avatar: null,
    })
    const rules = {
      username: { required, minLength: minLength(3) },
      first_name: { required, minLength: minLength(3) },
      last_name: { required, minLength: minLength(3) },
      email: { required, email },
    }

    const v$ = useVuelidate(rules, state)

    const handleFileChange = (event) => {
      state.avatar = event.target.files[0]
    }
    const submitForm = async () => {
      const isFormCorrect = await v$._value.$validate()
      if (isFormCorrect) {
        const formData = new FormData()
        formData.append('username', state.username)
        formData.append('first_name', state.first_name)
        formData.append('last_name', state.last_name)
        formData.append('email', state.email)
        formData.append('avatar', state.avatar)
        axios
          .post('/api/social-profiles/editprofile/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            if (response.data.message === 'Information updated successfully') {
              store.dispatch('alert/setMessage', {
                value: [response.data.message],
                type: 'success',
              })
              const fullName = state.first_name + ' ' + state.last_name
              const userData = {
                id: store.getters['socialProfileData/userId'],
                username: state.username,
                first_name: state.first_name,
                last_name: state.last_name,
                email: state.email,
                slug: response.data.new_slug,
                full_name: fullName,
                avatar_url: response.data.new_avatar,
              }
              store.commit('socialProfileData/setUserInfo', userData)
              router.push({
                name: 'profileSocial',
                params: {
                  slug: response.data.new_slug,
                },
              })
            } else {
              store.dispatch('alert/setMessage', {
                value: [response.data.message],
                type: 'error',
              })
            }
          })
          .catch((error) => {
            console.log('error', error)
          })
      }
    }

    return { state, v$, submitForm, handleFileChange }
  },
}
</script>
