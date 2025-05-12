<template>
  <v-card v-if="messages.length != 0" class="pa-4 rounded-lg">
    <v-list>
      <v-list-item
        v-for="(msg, index) in messages"
        :key="index"
        :class="getMessageClass(msg)"
      >
        <v-row align="center">
          <v-col
            :class="{
              'order-2': getMessageClass(msg) === 'sender-message',
              'order-1': getMessageClass(msg) === 'receiver-message',
            }"
            cols="5"
          >
          </v-col>
          <v-col
            :class="{
              'order-1': getMessageClass(msg) === 'sender-message',
              'order-2': getMessageClass(msg) === 'receiver-message',
            }"
            cols="7"
          >
            <strong>{{ msg.sender }}</strong>
          </v-col>
        </v-row>

        <v-card-text>
          {{ msg.message }}
        </v-card-text>
      </v-list-item>
      <div class="d-flex justify-center align-center" cols="auto">
        <div
          v-if="isLoading"
          class="d-flex justify-center align-center mt-5"
          cols="auto"
        >
          <v-progress-circular color="primary" indeterminate>
          </v-progress-circular>
        </div>
      </div>
    </v-list>
  </v-card>
</template>
<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const messages = computed(() => {
      return store.getters['aiLabChatData/realtimeChatMessages']
    })

    const isLoading = computed(() => {
      return store.getters['isLoading']
    })

    const getMessageClass = (message) => {
      return message.sender === 'me' ? 'sender-message' : 'receiver-message'
    }

    return {
      messages,
      isLoading,
      getMessageClass,
    }
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
  color: #000000de;
}
.receiver-message {
  text-align: left;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 8px;
  margin: 8px;
  max-width: 50%;
  color: #000000de;
}
</style>
