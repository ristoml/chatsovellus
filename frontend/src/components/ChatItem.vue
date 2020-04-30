<template lang="html">
    <v-tooltip left>
       <span slot="activator">
         <p class="grey--text text--darken-2">
           <span>[ {{ message.created.substr(11, 8) }} ] </span>
           <b class="indigo--text" v-if="isMyHandle(message.username)">You: </b>
           <b class="indigo--text" v-else>{{message.username}} :</b>
           {{ message.message }}
         </p>
       </span>
    </v-tooltip>
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
