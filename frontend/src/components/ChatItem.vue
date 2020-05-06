<template lang="html">
  <b-row class="message-row">
    <b-col cols="2" md="1">
      <span class="created">[{{ message.created.split(' ')[1] }}] </span><br>
      <b v-if="message.message==='joined' || message.message==='left'"></b>
      <b v-else>{{message.username}}: </b>
    </b-col>
    <b-col cols="12" md="11" class="message text-left">
      <span v-if="message.message==='joined' || message.message==='left'" class="msg"><b><i>{{message.username}} {{ message.message }}</i></b></span>
      <span v-else class="msg">{{ message.message }}</span>
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
