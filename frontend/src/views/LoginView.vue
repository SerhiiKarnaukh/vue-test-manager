<template>
  <v-main>
    <v-card
      width="400"
      class="mx-auto"
    >
      <v-card-title class="mb-6">
        <h1>Login</h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            label="Username"
            prepend-icon="mdi-account-circle"
            placeholder="Enter your username"
          ></v-text-field>
          <v-text-field
            :type="showPassword ? 'text' : 'password'"
            clearable
            label="Password"
            placeholder="Enter your password"
            prepend-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          variant="flat"
          color="success"
        >
          Register
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          variant="flat"
          color="info"
        >
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-main>
</template>

<script>
  export default {
    data: () => ({
        showPassword: false
    })
  }
</script>

<style scoped>
</style>
