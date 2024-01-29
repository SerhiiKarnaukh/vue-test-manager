<template>
  <v-snackbar
    class="toast"
    v-if="message"
    v-model="toastVisible"
    location="top"
    vertical
    :color="message.type"
  >
    <v-card-text>
      <ul>
        <li v-for="(item, index) in message.value" :key="index">{{ item }}</li>
      </ul>
    </v-card-text>
  </v-snackbar>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const message = computed(() => store.getters['alert/message'])
    const toastVisible = computed(() => !!store.getters['alert/message'])

    return {
      message,
      toastVisible,
    }
  },
}
</script>

<style scoped>
.toast {
  .v-snackbar__content {
    padding: 0;
    border-radius: 5px;
  }
  p {
    color: #302c2c;
    font-family: Roboto;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 25px;
  }
  .undo {
    color: #007dff;
    text-align: center;
    font-family: Roboto;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: 0.5px;
    text-decoration-line: underline;
  }
  .v-overlay__content {
    top: 0;

    .v-card {
      border-radius: 5px;
    }
    .v-card-text {
      border-radius: 5px;
    }
  }
}
</style>
