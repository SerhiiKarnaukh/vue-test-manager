<template>
  <v-main>
    <v-container class="py-6" fluid>
      <v-row v-if="conversations.length != 0" class="justify-center">
        <v-col cols="12" md="4" lg="3" class="px-4">
          <v-card
            v-for="conversation in conversations"
            v-bind:key="conversation.id"
            v-on:click="setActiveConversation(conversation.id)"
            :class="{
              'active-conversation': conversation.id === activeConversation.id,
            }"
            class="px-4 py-6 mb-3 rounded-lg"
          >
            <v-row
              align="center"
              v-for="user in conversation.users"
              v-bind:key="user.id"
            >
              <v-col cols="3">
                <v-avatar size="50" v-if="user.id != userId">
                  <img
                    :src="
                      user.avatar_url ? user.avatar_url : state.defaultAvatar
                    "
                    style="max-width: 100%"
                /></v-avatar>
              </v-col>
              <v-col cols="5">
                <p class="text-xs" v-if="user.id != userId">
                  <strong>{{ user.first_name + ' ' + user.last_name }}</strong>
                </p>
              </v-col>
              <v-col cols="4">
                <span v-if="user.id != userId" class="text-xs text-gray-500"
                  >{{ conversation.modified_at_formatted }} ago</span
                >
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="12" md="5" lg="6" class="px-4">
          <v-card
            v-if="
              activeConversation.messages &&
              activeConversation.messages.length !== 0
            "
            class="mb-6 pa-4 rounded-lg"
          >
            <v-list>
              <v-list-item
                v-for="message in activeConversation.messages"
                :key="message.id"
                :class="getMessageClass(message)"
              >
                <v-row align="center">
                  <v-col
                    :class="{
                      'order-2': getMessageClass(message) === 'sender-message',
                      'order-1':
                        getMessageClass(message) === 'receiver-message',
                    }"
                    cols="5"
                  >
                    <v-avatar size="50">
                      <img
                        :src="
                          message.created_by.avatar_url
                            ? message.created_by.avatar_url
                            : state.defaultAvatar
                        "
                        style="max-width: 100%"
                    /></v-avatar>
                  </v-col>
                  <v-col
                    :class="{
                      'order-1': getMessageClass(message) === 'sender-message',
                      'order-2':
                        getMessageClass(message) === 'receiver-message',
                    }"
                    cols="7"
                  >
                    <strong>{{ message.created_by.first_name }}</strong>
                  </v-col>
                </v-row>

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
                  v-model.trim="state.body"
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
      <v-row v-else class="justify-center">
        <v-card class="pa-6"><h2>You have no active conversations!</h2></v-card>
      </v-row>
    </v-container>
  </v-main>
</template>
<script>
import { reactive, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { onBeforeRouteLeave } from 'vue-router'

export default {
  name: 'ChatView',

  setup() {
    const store = useStore()
    const state = reactive({
      body: '',
      defaultAvatar: store.getters['socialProfileData/defaultAvatar'],
    })

    const conversations = computed(() => {
      return store.getters['socialChatData/conversations']
    })

    const activeConversation = computed(() => {
      return store.getters['socialChatData/activeConversation']
    })

    const userId = computed(() => store.getters['socialProfileData/userId'])

    const getMessageClass = (message) => {
      return message.created_by.id === userId.value
        ? 'sender-message'
        : 'receiver-message'
    }

    const setActiveConversation = async (id) => {
      store.commit('socialChatData/setActiveConversation', id)
      await store.dispatch('socialChatData/disconnectWebSocket')
      await store.dispatch('socialChatData/connectWebSocket', id)
      await store.dispatch('socialChatData/getChatMessages')
    }

    const submitForm = async () => {
      if (state.body !== '') {
        try {
          await store.dispatch('socialChatData/submitChatForm', state.body)
          state.body = ''
        } catch (error) {
          console.log(error)
        }
      }
    }

    onMounted(async () => {
      await store.dispatch('setPageTitle', 'Chat')
      await store.dispatch('socialChatData/getConversations')
    })
    onBeforeRouteLeave((to, from, next) => {
      store.dispatch('socialChatData/disconnectWebSocket')
      next()
    })

    return {
      state,
      conversations,
      activeConversation,
      userId,
      getMessageClass,
      setActiveConversation,
      submitForm,
    }
  },
}
</script>
<style scoped>
.active-conversation {
  background-color: #e0e0e0;
}
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
