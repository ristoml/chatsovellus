<template>
<div>
    <div class="fixed-top">
      <b-button v-b-toggle.userlist variant="success" style="margin:10px">User list</b-button>
      <b-button @click="logout" variant="danger">Sign out</b-button>
    </div>
    <div>
      <b-sidebar id="userlist" title="Users in the chat" right shadow backdrop>
        <div v-for="(user, i) in USERS" :key="i">
          {{ user }}
        </div>
      </b-sidebar>
    </div>
    <div style="padding:60px" id="container">
    <b-container>
      <b-row>
        <b-col cols="9">
          <b-row v-for="(message, i) in MESSAGES" style="max-width:80%" :key="i">
              <app-chat-item :message="message"></app-chat-item>
          </b-row>
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
    ...mapGetters(['MESSAGES', 'USER', 'USERS'])
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    },
    scrollToEnd() {
      var container = this.$el.querySelector('#container');
      container.scrollTop = container.scrollHeight;
    },
  },
  mounted() {
    this.$store.dispatch('SET_MESSAGES');
    this.$store.dispatch('SET_USER', this.$store.getters.getUser);
    this.scrollToEnd();
  },
  updated() {
    this.scrollToEnd();
  },
  sockets: {
    connect: function() {
      console.log('socket connected');
      this.$socket.emit('newUser', this.$store.getters.getUser.username);
    },
    userList: function(response) {
      console.log(response);
      this.$store.dispatch('SET_USERS', response);
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
    }
  }
};
</script>