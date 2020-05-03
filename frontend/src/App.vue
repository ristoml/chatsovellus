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