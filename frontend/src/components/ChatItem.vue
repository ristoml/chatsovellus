<template lang="html">
    <v-tooltip left>
       <span slot="activator">
         <p class="grey--text text--darken-2">
           <b class="indigo--text" v-if="isMyHandle(message.username)">You: </b>
           <b class="indigo--text" v-else>{{message.username}} :</b>
           {{ message.message }}
         <span>[ {{ message.created }} ]</span>
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
