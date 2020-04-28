<template>
  <div>    
    <input type="button" value="Logout" @click="logout" />    
    <ul id="messages"></ul>
    <form action="">
      <input id="m" autocomplete="off" /><button>Send</button>
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {      
      username: '',
      messages: [],
      newMessage: "",
      usersTyping: []
      
    };
  },
  created() {
   //debug remove
  console.log('created');
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push('/login');
    }
    this.username = this.$store.getters.getUser;        
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');     
    }
  }
};
</script>