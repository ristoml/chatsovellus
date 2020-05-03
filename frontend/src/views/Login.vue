<template>
  <b-container fluid>
    <div id="nav" class="fixed-top">
      <router-link to="/login">Login</router-link> |
      <router-link to="/register">Register</router-link>
    </div>
    <div>
    <h1 style="padding:60px">Login</h1>
    <b-form autocomplete="off" @submit="login" style="padding:30px">
       <b-form-group
        id="input-group-1"
        label="Username:"
        label-for="input-1"
      >
        <b-form-input
          data-cy="username"
          id="input-1"
          v-model="username"
          type="text"
          required
          placeholder="Enter username"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-2" label="Password:" label-for="input-2">
        <b-form-input
          data-cy="password"
          id="input-2"
          v-model="password"
          type="password"
          required
          placeholder="Enter password"
        ></b-form-input>
      </b-form-group>

    <b-button data-cy="loginbutton" type="submit" variant="info">Login</b-button>
    <p v-if="msg">{{ msg }}</p>
    </b-form>
    </div>
  </b-container>
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
    created() {
    },
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
<style scoped>
h1 {
  color: #42b983;
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #3b5168;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
