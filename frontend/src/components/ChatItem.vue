<template lang="html">
  <span slot="activator">
    <p class="grey--text text--darken-2">
      <span>[ {{ message.created.split(' ')[1] }} ] </span>
      <b class="indigo--text" v-if="message.username !== this.$store.getters.getUser.username && message.message==='joined' || message.message==='left'">{{message.username}} </b>
      <b class="indigo--text" v-else>{{message.username}} :</b>
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
