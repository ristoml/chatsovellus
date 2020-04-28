<template>
  <div id="login">
    <p> {{ errormsg }} </p>
		<input v-model="username"><br />
		<input v-model="passwd"><br />
		<button v-on:click="handleLogin">
			Login
		</button>
  </div>
</template>

<script>
import LoginService from '../services/login';

export default {
  name: 'Login',
  components: {
  },
  data: function() {
    return {
      username: 'tunnus',
      passwd: 'salasana',
      errormsg: ''
    };
  },
  methods: {
    async handleLogin() {
      console.log('login. username:', this.username, ' pass', this.passwd);

      const credentials = {
        username: this.username,
        password: this.passwd
      };

      try {
        const data = await LoginService.login(credentials);
        console.log('login successful', data);
        LoginService.setToken(data.token);

      } catch (error) {
        const errorMessage = error.response.data.error;
        console.log(errorMessage);
        this.errormsg = errorMessage;
      }
    }
  }
};
</script>

<style scoped>
#login {
}
</style>
