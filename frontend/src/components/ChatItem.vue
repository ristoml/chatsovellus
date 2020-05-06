<template lang="html">
  <b-row class="message-row">
    <b-col cols="2" md="1">
      <span class="created">[{{ message.created.split(' ')[1] }}] </span>
      <b v-if="message.message==='joined'">→ {{message.username}} </b>
      <b v-else-if="message.message==='left'">← {{message.username}} </b>
      <b v-else>{{message.username}}: </b>
    </b-col>
    <b-col cols="12" md="11" class="message text-left">
      <span class="msg">{{ message.message }}</span>
    </b-col>
  </b-row>
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
.message-row {
  margin: 10px 0 10px 0;
}

.message {
  padding: 10px 10px 10px 10px;
  border-top: 1px solid lightblue;
  border-bottom: 1px solid lightblue;
  font-family: 'Hind', sans-serif;
  font-size: 1.2rem;
  overflow-wrap: break-word;
}
</style>
