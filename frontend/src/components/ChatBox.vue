<template lang="html">
  <v-flex md8 offset-md2 class="pa-1" @submit.prevent="sendMessage">
    <v-form style="width:100%">
    <v-text-field
      label="Solo"
      placeholder="Type Your Message"
      v-model="message"
      solo
      ref="message"
      style="padding-bottom:0px"
      >
    </v-text-field>
    </v-form>
  </v-flex>
</template>

<script>
export default {
  data() {
    return {
      message: ''
    };
  },
  methods: {
    async sendMessage() {
      if (this.message) {
        let message = {
          id: this.$store.getters.getUser.id,
          username: this.$store.getters.getUser.username,
          message: this.message
        };
        await this.$socket.emit('newMessage', message);
        this.message = '';
      }
    },
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    }
  }
};
</script>

<style lang="css">
</style>
