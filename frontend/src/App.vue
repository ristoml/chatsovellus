<template>
  <div>
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
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Hind:wght@400;600&display=swap');
</style>

