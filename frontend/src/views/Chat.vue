<template>
  <div>    
    <input type="button" value="Logout" @click="logout" />        
  
  <v-app id="app" class="fill-height">
    <v-layout row class="fill-height" style="padding-bottom:60px" >
        <v-flex md8 offset-md2 style="overflow:auto;" class="pr-3 pl-3" v-if="HANDLE" ref="chatContainer">
          <div v-for="chat in CHATS" class="mt-4 mb-4" style="max-width:80%" :key="chat.id">
              <app-chat-item :chat="chat"></app-chat-item>
          </div>
        </v-flex>
        <v-flex v-else md4 offset-md4 class="text-xs-center">
            <app-chat-handle></app-chat-handle>
        </v-flex>
        <v-bottom-nav :value="true" absolute color="blue">
          <v-layout>
            <app-chat-box></app-chat-box>
          </v-layout>
        </v-bottom-nav>
    </v-layout>
  </v-app>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import chatItem from '../components/ChatItem'
import chatHandle from '../components/Handle'
import chatBox from '../components/ChatBox'
export default {
  components : {
    appChatItem : chatItem,
    appChatHandle : chatHandle,
    appChatBox : chatBox,
  },
  computed:{
    ...mapGetters(['CHATS','HANDLE'])
  },
  mounted(){
    this.$store.dispatch("SET_CHAT");
    this.$store.dispatch("SET_HANDLE", this.$store.getters.getUser);
  },
  updated(){
    var container = this.$refs.chatContainer;
    container.scrollTop = container.scrollHeight;
  },
  sockets : {
    connect: function(){
      console.log('socket connected');
    },
    chat : function(val){
      this.$store.dispatch("ADD_CHAT",val);
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
    this.username = this.$store.getters.getUser;        
  },
  
  methods: {
        logout() {
          this.$store.dispatch('logout');
          this.$router.push('/login');     
        },  
        joinChat: function (name) {
            if (name) {
              this.$socket.emit('join', name);
            }
        },
        
  },
   watch: {
        messages: function () {
            setTimeout(function () {
               //$('.messages ul').scrollTop(999999999);
            }, 100)
        }
    },
    /* 
    sockets: {
        users: function (users) {
            this.$set('users', users);
        },
        joined: function () {
            this.$set('join', true)
        },
        messages: function (data) {
            this.$set('messages', data);
        },
        onmessage: function (data) {
            this.messages.push(data);
        },
        adduser: function (user) {
            this.users.push(user);
        }
    } 
    */
};
</script>
<style>
html,body{
  height: 100%
}
</style>