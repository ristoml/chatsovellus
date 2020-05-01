<template>
  <v-app id="app2">
    <v-layout row class="fill-height" style="padding-bottom:60px">
        <v-flex md8 offset-md2 style="overflow:auto;" class="pr-3 pl-3" v-if="USER" ref="chatContainer" id="chatCont" >
          <div v-for="(message, i) in MESSAGES" class="mt-4 mb-4" style="max-width:80%" :key="i">
              <app-chat-item :message="message"></app-chat-item>
          </div>
        </v-flex>
        <v-bottom-navigation :value="true" absolute color="blue">
          <v-layout>
            <app-chat-box></app-chat-box>
          </v-layout>
        </v-bottom-navigation>
    </v-layout>
  </v-app>
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
    var container = this.$refs.chatContainer;
    container.scrollTop = container.scrollHeight;
  },
  updated() {
    var container = this.$refs.chatContainer;
    container.scrollTop = container.scrollHeight;
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
    }
  }
};
</script>
<style>
#chatCont {
  max-height: 30%;
}
</style>
