<template lang="html">
  <span slot="activator">
    <p class="grey--text text--darken-2 message">
      <span>[ {{ message.created.split(' ')[1] }} ] </span>
      <b class="indigo--text" v-if="message.message==='joined'">→ {{message.username}} </b>
      <b class="indigo--text" v-else-if="message.message==='left'">← {{message.username}} </b>
      <b class="indigo--text" v-else>{{message.username}}: </b>
      {{ message.message }}
    </p>
  </span>
</template>
<script>
export default {
  props: ['message'],
  methods: {
    isMyHandle(handle) {
      return handle === this.$store.getters.getUser.username;
    }
  },
};
</script>

<style scoped>
.message {
  font-family: 'Hind', sans-serif;
  font-size: 1.2rem;
}
</style>
