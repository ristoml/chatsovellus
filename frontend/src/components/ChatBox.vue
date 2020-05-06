<template>
  <b-form autocomplete="off" @submit.prevent="sendMessage">
    <b-input-group>

      <b-input-group-prepend>
        <b-button data-cy="emojipickerbtn" variant="info" id="emoji-popover">
          😊
        </b-button>
        <b-popover data-cy="emojipickerpopover" target="emoji-popover" triggers="hover" placement="top">
          <b-container data-cy="emojipicker" class="light-container ">
            <template v-for="row in emojiPickerRows">
              <b-row cols="4" :key="row + ''">
                <b-col v-for="emoji in row" :key="emoji">
                  <b-button
                    variant="outline-light"
                    class="btn-emoji"
                    @click="selectEmoji(emoji)"
                  >
                    {{ emoji }}
                  </b-button>
                </b-col>
              </b-row>
            </template>
          </b-container>
        </b-popover>
      </b-input-group-prepend>

      <b-form-input
        data-cy="chatmessageinput"
        id="input-9"
        v-model="message"
        type="text"
        placeholder="Type your message"
        @input="handleInput"
        :maxlength="characterLimit"
      >
      </b-form-input>

      <b-input-group-append>
        <b-input-group-text>{{ characterLimit - message.length }}</b-input-group-text>
      </b-input-group-append>

    </b-input-group>
  </b-form>
</template>

<script>
export default {
  data() {
    return {
      characterLimit: 500,
      message: '',
      emojiPickerRows: {
        row1: ['😂 ', '😃 ', '😞 ', '😕 '],
        row2: ['😠 ', '😊 ', '😉 ', '✌'],
        row3: ['☝', '👌', '👍']
      }
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
        ['✌',  ':victory_hand:' ],
        ['☝',  ':pointing_hand:'],
        ['👌', ':ok_hand:'      ],
        ['👍', ':thumbs_up:'    ]
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
    }
  }
};
</script>

<style>
.light-container {
  list-style: none;
  background: white;
}

.btn-emoji:hover {
  background-color: lightgray !important;
}

.btn-emoji:focus, .btn-emoji:active {
  outline: none !important;
  box-shadow: none !important;
}
</style>

