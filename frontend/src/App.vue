<template>
  <div id="app">
    <router-view />
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
html, body {
  overflow: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 40em
}
</style>