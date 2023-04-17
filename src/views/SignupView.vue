<template>
  <v-main class="px-4 pb-4">
    <v-card max-width="700" class="mx-auto">
      <v-card-title class="mb-6">
        <h2 class="text-md-h3 font-weight-medium">Create an account</h2>
      </v-card-title>
      <v-alert v-if="errors.length" type="error"
        ><p v-for="error in errors" v-bind:key="error">{{ error }}</p></v-alert
      >
      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-text-field
            v-model.trim="username"
            label="Username"
            prepend-icon="mdi-account-edit"
            placeholder="Create your Username"
          ></v-text-field>
          <v-text-field
            v-model.trim="first_name"
            label="First Name"
            prepend-icon="mdi-account-edit"
            placeholder="Enter your First Name"
          ></v-text-field>
          <v-text-field
            v-model.trim="last_name"
            label="Last Name"
            prepend-icon="mdi-account-edit"
            placeholder="Enter your Last Name"
          ></v-text-field>
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
          <v-text-field
            v-model.trim="password2"
            :type="showPassword ? 'text' : 'password'"
            clearable
            label="Repeat password"
            placeholder="Repeat your password"
            prepend-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
          ></v-text-field>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn variant="flat" color="success" type="submit">Submit</v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="warning" to="/login">
              I have an account
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-main>
</template>
<script>
import axios from 'axios'
export default {
  name: 'SignupView',
  data() {
    return {
      showPassword: false,
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password2: '',
      errors: [],
    }
  },
  methods: {
    submitForm() {
      this.errors = []
      if (this.username === '') {
        this.errors.push('The username is missing')
      }
      if (this.password === '') {
        this.errors.push('The password is too short')
      }
      if (this.password !== this.password2) {
        this.errors.push("The passwords doesn't match")
      }
      if (!this.errors.length) {
        const formData = {
          username: this.username,
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          password: this.password,
          is_active: true,
        }
        axios
          .post('/api/v1/users/', formData)
          .then(() => {
            this.$router.push('/login')
          })
          .catch((error) => {
            if (error.response) {
              for (const property in error.response.data) {
                error.response.data[property].map((e) => this.errors.push(e))
              }
              console.log(JSON.stringify(error.response.data))
            } else if (error.message) {
              this.errors.push('Something went wrong. Please try again')

              console.log(JSON.stringify(error))
            }
          })
      }
    },
  },
}
</script>
