<template>
  <b-container fluid>
    <div id="nav" class="fixed-top">
      <router-link to="/login">Login</router-link> |
      <router-link to="/register">Register</router-link>
    </div>
    <div>
      <h1 style="padding:60px">Register</h1>
      <b-form autocomplete="off" @submit="signUp" style="padding:30px">
        <b-form-group
          id="input-group-1"
          label="Your name:"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            v-model="realname"
            type="text"
            required
            placeholder="Enter your name"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="input-group-2"
          label="Username:"
          label-for="input-2"
        >
          <b-form-input
            id="input-2"
            v-model="username"
            type="text"
            required
            placeholder="Enter username"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-3" label="Password:" label-for="input-3">
          <b-form-input
            id="input-3"
            v-model="password"
            type="password"
            required
            placeholder="Enter password"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="info">Register</b-button>
        <p v-if="msg"><br><i>{{ msg }}</i></p>
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
        this.msg = response;
        this.$router.push('/login');
      } catch (error) {
        this.msg = error.response.data.error;
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