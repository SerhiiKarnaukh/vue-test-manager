<template>
  <v-card class="ml-10 mb-4 pa-4" outlined>
    <v-row align="center">
      <v-col cols="auto">
        <v-avatar size="50">
          <img
            :src="
              comment.created_by.avatar_url
                ? comment.created_by.avatar_url
                : state.defaultAvatar
            "
            style="max-width: 100%"
        /></v-avatar>
      </v-col>
      <v-col>
        <div class="text-overline">
          <router-link
            :to="{
              name: 'profileSocial',
              params: { slug: comment.created_by.slug },
            }"
          >
            {{
              comment.created_by.first_name + ' ' + comment.created_by.last_name
            }}
          </router-link>
        </div>
        <div class="text-caption">{{ comment.created_at_formatted }} ago</div>
      </v-col>
    </v-row>
    <v-card-text>{{ comment.body }}</v-card-text>
    <!-- <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn icon><v-icon>mdi-heart-outline</v-icon></v-btn>
      <v-btn icon><v-icon>mdi-share-variant</v-icon></v-btn>
    </v-card-actions> -->
  </v-card>
</template>

<script>
import { RouterLink } from 'vue-router'
import { reactive } from 'vue'
import { useStore } from 'vuex'
export default {
  props: {
    comment: Object,
  },
  components: { RouterLink },
  setup() {
    const store = useStore()
    const state = reactive({
      defaultAvatar: store.getters['socialProfileData/defaultAvatar'],
    })
    return {
      state,
    }
  },
}
</script>

<style lang="scss" scoped></style>
