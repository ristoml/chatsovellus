<template>
<div>
    <div class="fixed-top">
      <b-button v-b-toggle.userlist variant="success" style="margin:10px">User list</b-button>
      <b-button @click="logout" variant="danger">Sign out</b-button>
    </div>
    <div>
      <b-sidebar id="userlist" title="Users in chat" right shadow backdrop>
        <div v-for="(user, i) in USERS" :key="i" style="padding:20px">
          {{ user }}
        </div>
      </b-sidebar>
    </div>
    <div>
    <b-container ref="container" style="overflow:hidden">
          <b-row v-for="(message, i) in MESSAGES" style="max-width:80%" :key="i">
              <app-chat-item :message="message"></app-chat-item>
          </b-row>
      </b-container>
    </div>
        <div class="fixed-bottom">
          <app-chat-box></app-chat-box>
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
    }
  },
  mounted() {
    this.$store.dispatch('SET_MESSAGES');
    this.$store.dispatch('SET_USER', this.$store.getters.getUser);
  },
  updated() {
    var elem = this.$refs.container;
    console.log(elem.clientHeight);
    elem.scrollTop = elem.clientHeight;
  },
  sockets: {
    connect: function() {
      console.log('socket connected');
      this.$socket.client.emit('newUser', this.$store.getters.getUser.username);
    },
    userList: function(response) {
      console.log('userlist received: '+ response);
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