<template>
  <v-main>
    <v-container class="py-6" fluid>
      <v-row class="justify-center">
        <v-col cols="12" md="4" lg="3" class="px-4">
          <v-card
            v-for="conversation in conversations"
            v-bind:key="conversation.id"
            v-on:click="setActiveConversation(conversation.id)"
            class="px-4 py-6 mb-3 rounded-lg"
          >
            <v-row align="center">
              <v-col
                class="shrink-0"
                v-for="user in conversation.users"
                v-bind:key="user.id"
              >
                <v-avatar size="50" v-if="user.id != userId">
                  <img :src="user.avatar_url" style="max-width: 100%"
                /></v-avatar>
              </v-col>
              <v-row v-for="user in conversation.users" v-bind:key="user.id">
                <p class="text-xs" v-if="user.id != userId">
                  <strong>{{ user.first_name + ' ' + user.last_name }}</strong>
                </p>
              </v-row>
              <v-col class="shrink-0">
                <span class="text-xs text-gray-500"
                  >{{ conversation.modified_at_formatted }} ago</span
                >
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="12" md="5" lg="6" class="px-4">
          <v-card class="mb-6 pa-4 rounded-lg">
            <v-list>
              <v-list-item
                v-for="message in activeConversation.messages"
                :key="message.id"
                :class="getMessageClass(message)"
              >
                <v-avatar size="50">
                  <img
                    :src="message.created_by.avatar_url"
                    style="max-width: 100%"
                /></v-avatar>
                <v-card-text>
                  <v-list-item-title>
                    {{ message.body }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ message.created_at_formatted }} ago
                  </v-list-item-subtitle>
                </v-card-text>
              </v-list-item>
            </v-list>
          </v-card>
          <v-card class="rounded-lg mb-6" color="white" elevation="2">
            <v-form v-on:submit.prevent="submitForm" method="post">
              <v-card-text class="p-4">
                <v-textarea
                  v-model.trim="body"
                  placeholder="What do you want to say?"
                  color="grey lighten-3"
                  required
                ></v-textarea>
              </v-card-text>

              <v-card-actions class="p-4 border-t">
                <v-btn color="social darken-2" variant="flat" type="submit">
                  Send
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'СhatView',

  setup() {},

  data() {
    return {
      conversations: [],
      activeConversation: {},
      body: '',
    }
  },

  mounted() {
    document.title = 'Chat | Social Network'
    this.getConversations()
  },
  computed: {
    ...mapGetters('socialProfileData', {
      userId: 'userId',
    }),
  },

  methods: {
    getMessageClass(message) {
      return message.created_by.id == this.userId
        ? 'sender-message'
        : 'receiver-message'
    },
    setActiveConversation(id) {
      this.activeConversation = id
      this.getMessages()
    },
    getConversations() {
      axios
        .get('/api/social-chat/')
        .then((response) => {
          this.conversations = response.data

          if (this.conversations.length) {
            this.activeConversation = this.conversations[0].id
          }

          this.getMessages()
        })
        .catch((error) => {
          console.log(error)
        })
    },

    getMessages() {
      axios
        .get(`/api/social-chat/${this.activeConversation}/`)
        .then((response) => {
          this.activeConversation = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },

    submitForm() {
      axios
        .post(`/api/social-chat/${this.activeConversation.id}/send/`, {
          body: this.body,
        })
        .then((response) => {
          console.log(response.data)

          this.activeConversation.messages.push(response.data)
          this.body = ''
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>
<style scoped>
.sender-message {
  text-align: right;
  background-color: #e0e0e0;
  border-radius: 8px;
  padding: 8px;
  margin: 8px;
  max-width: 50%;
  margin-left: auto;
}

.receiver-message {
  text-align: left;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 8px;
  margin: 8px;
  max-width: 50%;
}
</style>
