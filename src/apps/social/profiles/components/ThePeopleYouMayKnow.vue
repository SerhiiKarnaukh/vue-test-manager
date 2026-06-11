<template>
  <v-card
    v-if="friendSuggestions.length != 0"
    class="px-4 py-6 rounded-lg mb-6"
  >
    <h3 class="mb-6 text-xl">People you may know</h3>
    <v-card
      v-for="user in friendSuggestions"
      v-bind:key="user.id"
      class="mb-4"
      flat
    >
      <v-row align="center">
        <v-col cols="3" lg="2" sm="3">
          <v-avatar size="40">
            <img
              :src="user.avatar_url ? user.avatar_url : state.defaultAvatar"
              style="max-width: 100%"
            />
          </v-avatar>
        </v-col>
        <v-col cols="6" lg="6" sm="5">
          <p class="text-xs">
            <strong>{{ user.full_name }}</strong>
          </p>
        </v-col>
        <v-col cols="3" lg="4" sm="4">
          <v-btn
            :to="{ name: 'profileSocial', params: { slug: user.slug } }"
            variant="flat"
            color="social"
          >
            Show
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
import { useStore } from 'vuex'
import { reactive, onMounted, computed } from 'vue'
export default {
  setup() {
    const store = useStore()
    const state = reactive({
      defaultAvatar: store.getters['socialProfileData/defaultAvatar'],
    })

    const friendSuggestions = computed(() => {
      return store.getters['socialProfileData/friendSuggestions']
    })
    onMounted(async () => {
      await store.dispatch('socialProfileData/getFriendSuggestions')
    })
    return { state, friendSuggestions }
  },
}
</script>

<style lang="scss" scoped></style>
