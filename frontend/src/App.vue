<template>
  <div id="app">
    <div v-if="!this.$store.getters.isLoggedIn" id="nav">
      <router-link to="/login">Login</router-link> |
      <router-link to="/register">Register</router-link>
    </div>
    <div v-if="this.$store.getters.isLoggedIn">
      <v-btn
        color="green"
        class="mr-4"
        @click="logout"
      >
        Logout
      </v-btn>
    </div>
    <router-view class="fill-height" />
  </div>
</template>
<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    }
  },
  created() {
    this.scrollTop = document.body.scrollHeight;
  },
};
</script>
<style>
body {
  height: 100%;
  }
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 40em
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>