<template>
  <div>
    <h1>Login</h1>
    <input type="text" placeholder="Username" v-model="username" />
    <input type="password" placeholder="Password" v-model="password" />
    <input type="button" @click="login" value="Login" />
    <p v-if="msg">{{ msg }}</p>
  </div>
</template>
<script>
import AuthService from '@/services/AuthService.js';
export default {
  data() {
    return {
      username: '',
      password: '',
      msg: ''
    };
  },
  methods: {
    async login() {
      try {
        const credentials = {
          username: this.username,
          password: this.password
        };
        const response = await AuthService.login(credentials);
        this.msg = response.msg;        
        const token = response.token;
        const user = response.username;        
        this.$store.dispatch('login', { token, user });        

        this.$router.push('/');
      } catch (error) {
        this.msg = error.response.data.error;
        console.log(error.response.data.error)        
      }
    }
  }
};
</script>