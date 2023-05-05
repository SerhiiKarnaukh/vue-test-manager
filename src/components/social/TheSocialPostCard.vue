<template>
  <v-card class="mb-6 pa-4 rounded-lg" elevation="2">
    <v-row align="center">
      <v-col cols="auto">
        <v-avatar size="40">
          <img src="https://i.pravatar.cc/50?img=70"
        /></v-avatar>
      </v-col>
      <v-col>
        <div class="text-overline">
          {{ post.created_by.first_name + ' ' + post.created_by.last_name }}
        </div>
        <div class="text-caption">{{ post.created_at_formatted }} ago</div>
      </v-col>
      <v-col class="text-right">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-col>
    </v-row>
    <v-card-text class="py-4"
      >{{ post.body }}
      <v-img
        class="mt-4"
        src="https://images.unsplash.com/photo-1661956602868-6ae368943878?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80"
        rounded
      ></v-img
    ></v-card-text>
    <v-card-actions>
      <v-row align="center">
        <v-col cols="auto">
          <v-icon small class="mr-1">mdi-thumb-up-outline</v-icon>
          <span>34</span>
        </v-col>
        <v-col cols="auto">
          <v-icon small class="mr-1">mdi-comment-outline</v-icon>
          <span>45</span>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'TheSocialPostCard',
  props: {
    post: Object,
  },
}
</script>

<style lang="scss" scoped></style>
