<template>
  <div>
    <h1>Register</h1>        
    <input type="text" placeholder="Real name" v-model="realname" />
    <input type="text" placeholder="Username" v-model="username" />
    <input type="password" placeholder="Password" v-model="password" />   
    <input type="button" @click="signUp" value="Sign Up" />
    <p v-if="msg">{{ msg }}</p>
  </div>
</template>
<script>
import AuthService from '@/services/AuthService.js';
export default {
  data() {
    return {
      realname: '',
      username: '',
      password: '',
      type: 'user',      
      msg: ''
    };
  },
  methods: {
    async signUp() {
      try {
        const credentials = {
          realname: this.realname,
          username: this.username,
          password: this.password,         
          type: this.type,
        };
        const response = await AuthService.signUp(credentials);
        this.msg = response.msg;                
      } catch (error) {
        this.msg = error.response.data.error;
        //alert(error.response.data.error);
      }
    }
  }
};
</script>