<template lang="html">
<div>
    <b-form autocomplete="off" @submit.prevent="sendMessage" style="width:100%">
      <b-form-group
      id="input-group-9"
      >
      <b-form-input
      id="input-9"
      v-model="message"
      type="text"
      placeholder="Type your message"
      >
      </b-form-input>
      </b-form-group>
      </b-form>
      </div>
</template>

<script>
export default {
  data() {
    return {
      message: ''
    };
  },
  methods: {
    created() {
    // this.$vuetify.theme.dark = true;
    },
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