<template>
  <div>
    <b-form autocomplete="off" @submit.prevent="sendMessage">
      <b-input-group>
        <b-input-group-prepend>
          <b-button variant="info" id="emoji-hover">
            😊
          </b-button>
          <b-tooltip variant="light" target="emoji-hover" triggers="hover">
            <b-table-simple class="light-table">
              <b-tr>
                <b-th>
                  <b-dropdown-item @click="selectEmoji('😂')">😂</b-dropdown-item>
                  <b-dropdown-item @click="selectEmoji('😃')">😃</b-dropdown-item>
                  <b-dropdown-item @click="selectEmoji('😠')">😠</b-dropdown-item>
                  <b-dropdown-item @click="selectEmoji('😉')">😉</b-dropdown-item>
                </b-th>
                <b-th>
                  <b-dropdown-item @click="selectEmoji('😊')">😊</b-dropdown-item>
                  <b-dropdown-item @click="selectEmoji('😞')">😞</b-dropdown-item>
                  <b-dropdown-item @click="selectEmoji('😕')">😕</b-dropdown-item>
                  <b-dropdown-item @click="selectEmoji('😊')">😊</b-dropdown-item>
                </b-th>
                <b-th>
                  <b-dropdown-item @click="selectEmoji('☝')">☝</b-dropdown-item>
                  <b-dropdown-item @click="selectEmoji('👍')">👍</b-dropdown-item>
                  <b-dropdown-item @click="selectEmoji('✌')">✌</b-dropdown-item>
                  <b-dropdown-item @click="selectEmoji('👌')">👌</b-dropdown-item>
                </b-th>
              </b-tr>
              <b-tr>
              </b-tr>
            </b-table-simple>
          </b-tooltip>
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
        ['😞 ', /^:\( / ],
        ['😕 ', /^:\/ / ],
        ['😠 ', /^>:\( /],
        ['😊 ', /^:\) / ],
        ['😉 ', /^;\) / ]
      ];
      const emojisBetweenTxt = [
        [' 😂 ', / :DD /g ],
        [' 😃 ', / :D /g  ],
        [' 😞 ', / :\( /g ],
        [' 😕 ', / :\/ /g ],
        [' 😠 ', / >:\( /g],
        [' 😊 ', / :\) /g ],
        [' 😉 ', / ;\) /g ]
      ];
      const handEmojis = [
        ['✌', ':victory_hand:' ],
        ['☝', ':pointing_hand:'],
        ['👌', ':ok_hand:'     ],
        ['👍', ':thumbs_up:'   ]
      ];

      let modifiedInput = input.slice();

      emojisAtBeginning.forEach(([emoji, regex]) => {
        modifiedInput = modifiedInput.replace(regex, emoji);
      });
      emojisBetweenTxt.forEach(([emoji, regex]) => {
        modifiedInput = modifiedInput.replace(regex, emoji);
      });
      handEmojis.forEach(([emoji, txt]) => {
        modifiedInput = modifiedInput.replace(txt, emoji);
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

<style>
.tooltip {
  opacity: 1 !important;
  top: 1;
}
.tooltip.in {
  opacity: 1 !important;
}
.light-table {
  list-style: none;
  background: white;
}
</style>

