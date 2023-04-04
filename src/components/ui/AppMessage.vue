<template>
  <v-alert
    v-if="message"
    :type="message.type"
  >{{message.value}}</v-alert>
</template>

<script>
import {computed} from 'vue'
import {useStore} from 'vuex'

export default {
  setup() {
    const store = useStore()

    const message = computed(() => store.state.message)

    return {
      message
    }
  }
}
</script>

<style scoped>
</style>
