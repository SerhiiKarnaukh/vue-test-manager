<template>
  <v-main>
    <v-container class="py-6" fluid>
      <v-row class="justify-center">
        <v-col cols="12" md="5" lg="6" class="px-4">
          <v-card
            v-for="notification in notifications"
            v-bind:key="notification.id"
            v-if="notifications.length"
            class="mb-6 pa-4 rounded-lg"
            elevation="2"
            flat
          >
            <v-row align="center">
              <v-col cols="auto">
                <v-card-text class="py-4">{{ notification.body }} </v-card-text>
              </v-col>

              <v-col class="text-right">
                <v-btn
                  variant="flat"
                  color="social"
                  @click="readNotification(notification)"
                  >Read more</v-btn
                >
              </v-col>
            </v-row>
          </v-card>
          <h2 v-else class="text-center">
            You don't have any unread notifications!
          </h2>
        </v-col>

        <v-col cols="12" md="4" lg="3" class="px-4">
          <ThePeopleYouMayKnow />
          <TheTrends />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
<script>
import ThePeopleYouMayKnow from '@/components/social/ThePeopleYouMayKnow.vue'
import TheTrends from '@/components/social/TheTrends.vue'
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  components: {
    ThePeopleYouMayKnow,
    TheTrends,
  },
  setup() {
    const store = useStore()

    const notifications = computed(() => {
      return store.getters['socialNotificationData/notifications']
    })

    const readNotification = async (notification) => {
      await store.dispatch(
        'socialNotificationData/readNotification',
        notification
      )
    }

    onMounted(async () => {
      await store.dispatch('socialNotificationData/getNotifications')
    })

    return {
      notifications,
      readNotification,
    }
  },
}
</script>
<style scoped></style>
