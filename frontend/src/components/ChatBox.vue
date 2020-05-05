<template>
  <div>
    <b-form autocomplete="off" @submit.prevent="sendMessage">
      <b-input-group>
        <b-input-group-prepend>
          <b-dropdown text="Emoji" variant="info">
            <b-dropdown-item @click="selectEmoji('😂')">😂</b-dropdown-item>
            <b-dropdown-item @click="selectEmoji('😃')">😃</b-dropdown-item>
            <b-dropdown-item @click="selectEmoji('😕')">😕</b-dropdown-item>
            <b-dropdown-item @click="selectEmoji('😠')">😠</b-dropdown-item>
            <b-dropdown-item @click="selectEmoji('😉')">😉</b-dropdown-item>
            <b-dropdown-item @click="selectEmoji('😊')">😊</b-dropdown-item>
          </b-dropdown>
        </b-input-group-prepend>
        <b-form-input
          id="input-9"
          v-model="message"
          type="text"
          placeholder="Type your message"
          @input="handleInput"
          :maxlength="characterLimit"
        >
        </b-form-input>
        <b-input-group-append>
          <b-input-group-text>Characters left: {{ characterLimit - message.length }}</b-input-group-text>
        </b-input-group-append>
      </b-input-group>
    </b-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      characterLimit: 200,
      message: ''
    };
  },
  methods: {
    selectEmoji(emoji) {
      this.message += emoji;
    },
    handleInput(input) {
      const emojisAtBeginning = [
        ['😂 ', /^:DD / ],
        ['😃 ', /^:D /  ],
        ['😕 ', /^:\/ / ],
        ['😠 ', /^>:\( /],
        ['😊 ', /^:\) / ],
        ['😉 ', /^;\) / ]
      ];
      const emojisBetweenTxt = [
        [' 😂 ', / :DD /g ],
        [' 😃 ', / :D /g  ],
        [' 😕 ', / :\/ /g ],
        [' 😠 ', / >:\( /g],
        [' 😊 ', / :\) /g ],
        [' 😉 ', / ;\) /g ]
      ];

      let modifiedInput = input.slice();

      emojisAtBeginning.forEach(([emoji, regex]) => {
        modifiedInput = modifiedInput.replace(regex, emoji);
      });
      emojisBetweenTxt.forEach(([emoji, regex]) => {
        modifiedInput = modifiedInput.replace(regex, emoji);
      });

      this.message = modifiedInput;
    },
    async sendMessage() {
      if (this.message) {
        const message = {
          id: this.$store.getters.getUser.id,
          username: this.$store.getters.getUser.username,
          message: this.message
        };
        await this.$socket.client.emit('newMessage', message);
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
