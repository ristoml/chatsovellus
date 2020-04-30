<template>
  <div id="app">
  <v-app id="inspire">
    <v-form
      @submit="login"
      ref="form"
    >
    <h1>Login</h1>
      <v-text-field
        v-model="username"
        :counter="10"
        label="Username"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show1 ? 'text' : 'password'"
        label="Password"
        required
        @click:append="show1 = !show1"
      ></v-text-field>

    <v-btn
        type="submit"
        color="success"
        class="mr-4"
      >
        Login
      </v-btn>
    <p v-if="msg">{{ msg }}</p>
    </v-form>
  </v-app>

  </div>
</template>
<script>
import AuthService from '@/services/AuthService.js';
export default {
  data() {
    return {
      show1: false,
      username: '',
      password: '',
      msg: ''
    };
  },
  methods: {
    async login(event) {
      event.preventDefault();
      try {
        const credentials = {
          username: this.username,
          password: this.password
        };
        const response = await AuthService.login(credentials);
        this.msg = response.msg;

        const user = { ...response };
        delete user['token'];
        const token = response.token;
        this.$store.dispatch('login', { user, token });

        this.$router.push('/');
      } catch (error) {
        this.msg = error.response.data.error;
        console.log(error.response.data.error);
      }
    }
  }
};
</script>
