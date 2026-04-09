<template>
  <div class="race-control-feed">
    <div v-if="showToolbar" class="race-control-feed__toolbar">
      <v-switch
        v-model="autoScroll"
        hide-details
        density="compact"
        label="Auto-scroll to newest"
      />
      <v-btn size="small" variant="outlined" @click="scrollTop">Top</v-btn>
    </div>

    <div ref="listRef" class="race-control-feed__list">
      <RaceControlMessage
        v-for="message in visibleMessages"
        :key="message.id || `${message.timestamp}-${message.message}`"
        :message="message"
      />
      <div v-if="visibleMessages.length === 0" class="race-control-feed__empty">
        No race control messages yet.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import RaceControlMessage from '@/components/f1/racecontrol/RaceControlMessage.vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  limit: {
    type: Number,
    default: 0
  },
  showToolbar: {
    type: Boolean,
    default: true
  }
})

const listRef = ref(null)
const autoScroll = ref(true)
const visibleMessages = computed(() => {
  if (!props.limit || props.limit < 1) return props.messages
  return props.messages.slice(0, props.limit)
})

watch(
  () => props.messages.length,
  async () => {
    if (!autoScroll.value) return
    await nextTick()
    scrollTop()
  }
)

function scrollTop() {
  if (!listRef.value) return
  listRef.value.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
@use '@/styles/f1/variables' as *;

.race-control-feed {
  background: $f1-bg-secondary;
  border: 1px solid $f1-border;
  border-radius: $f1-radius-md;
  padding: $f1-spacing-md;
  display: grid;
  gap: $f1-spacing-sm;
  min-height: 420px;

  &__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__list {
    display: grid;
    gap: $f1-spacing-sm;
    max-height: 70vh;
    overflow: auto;
    padding-right: 4px;
  }

  &__empty {
    color: $f1-text-secondary;
    font-size: 12px;
    padding: $f1-spacing-sm 0;
  }
}
</style>
