<template>
  <v-main class="px-4 pb-4">
    <v-card max-width="400" class="mx-auto">
      <v-card-title class="mb-6">
        <h1>Login</h1>
      </v-card-title>
      <v-alert v-if="errors.length" type="error"
        ><p v-for="error in errors" v-bind:key="error">{{ error }}</p></v-alert
      >
      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-text-field
            v-model.trim="email"
            label="Email"
            prepend-icon="mdi-email-outline"
            placeholder="Enter your Email"
          ></v-text-field>
          <v-text-field
            v-model.trim="password"
            :type="showPassword ? 'text' : 'password'"
            clearable
            label="Password"
            placeholder="Enter your password"
            prepend-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
          ></v-text-field>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn variant="flat" color="success" to="/signup">
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
import axios from 'axios'
export default {
  name: 'LogIn',
  data() {
    return {
      showPassword: false,
      email: '',
      password: '',
      errors: [],
    }
  },
  mounted() {
    document.title = 'Log In | Taberna'
  },
  methods: {
    async submitForm() {
      axios.defaults.headers.common['Authorization'] = ''
      localStorage.removeItem('token')
      const formData = {
        email: this.email,
        password: this.password,
      }
      await axios
        .post('/auth/token/login/', formData)
        .then((response) => {
          const token = response.data.auth_token
          this.$store.commit('setToken', token)

          axios.defaults.headers.common['Authorization'] = 'Token ' + token
          localStorage.setItem('token', token)
          const toPath = this.$route.query.to || '/cart'
          this.$router.push(toPath)
        })
        .catch((error) => {
          if (error.response) {
            for (const property in error.response.data) {
              error.response.data[property].map((e) => this.errors.push(e))
            }
            console.log(JSON.stringify(error.response.data))
          } else {
            this.errors.push('Something went wrong. Please try again')

            console.log(JSON.stringify(error))
          }
        })
    },
  },
}
</script>
