<template>
<div id="app">
    <div class="fixed-top">
      <b-button @click="logout" variant="success">Logout</b-button>
    </div>
    <div style="padding:60px">
    <b-container fluid>
      <b-row>
        <b-col cols="9">
          <div v-for="(message, i) in MESSAGES" class="mt-4 mb-4" style="max-width:80%" :key="i" ref="msgs">
              <app-chat-item :message="message"></app-chat-item>
          </div>
        </b-col>
        <b-col cols="1">
          userList
        </b-col>
      </b-row>
      <b-row>
        <div class="fixed-bottom">
          <app-chat-box></app-chat-box>
        </div>
      </b-row>
    </b-container>
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import chatItem from '../components/ChatItem';
import chatBox from '../components/ChatBox';
export default {
  components: {
    appChatItem: chatItem,
    appChatBox: chatBox,
  },
  computed: {
    ...mapGetters(['MESSAGES', 'USER'])
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    }
  },
  mounted() {
    this.$store.dispatch('SET_MESSAGES');
    this.$store.dispatch('SET_USER', this.$store.getters.getUser);
    var container = this.$refs.msgs;
    container.scrollTop = container.scrollHeight;
  },
  updated() {
    var container = this.$refs.msgs;
    container.scrollTop = container.scrollHeight;
  // this.$vuetify.theme.dark = true;
  },
  sockets: {
    connect: function() {
      console.log('socket connected');
      this.$socket.emit('newUser', this.$store.getters.getUser.username);
    },
    userList: function(response) {
      console.log(response);
    },
    newMessage: function(data) {
      console.log('got new message ', data);
      this.$store.dispatch('ADD_MESSAGE', data);
    }
  },
  data() {
    return {
      join: false,
      username: null,
      users: null,
      message: null,
      messages: null,

    };
  },
  created() {
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push('/login');
    //  this.$vuetify.theme.dark = true;
    }
  }
};
</script>
<style>

#chatCont {
  height: 99%;
}
</style>
