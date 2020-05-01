<template>
  <div id="app">
  <v-app id="inspire">
    <v-form
      style="padding:50px"
      @submit="signUp"
      ref="form"
    >
    <h1>Register to Webchat</h1>
    <v-text-field
        v-model="realname"
        label="Real name"
        required
      ></v-text-field>
   <v-text-field
        v-model="username"
        label="Username"
        required
      ></v-text-field>
    <v-text-field
        v-model="password"
        label="Password"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show1 ? 'text' : 'password'"
        required
         @click:append="show1 = !show1"
      ></v-text-field>
    <v-btn
        type="submit"
        color="success"
        class="mr-4"
      >
        Register
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
      realname: '',
      username: '',
      password: '',
      type: 'user',
      msg: ''
    };
  },
  methods: {
    async signUp(event) {
      event.preventDefault();
      try {
        const credentials = {
          realname: this.realname,
          username: this.username,
          password: this.password,
          type: this.type,
        };
        const response = await AuthService.signUp(credentials);
        this.msg = response.msg;
      } catch (error) {
        this.msg = error.response.data.error;
        //alert(error.response.data.error);
      }
    }
  }
};
</script>