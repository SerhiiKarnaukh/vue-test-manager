<template>
  <div class="drs-indicator">
    <v-chip :color="chipColor" size="small" variant="flat">
      DRS: {{ stateLabel }}
    </v-chip>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { DRS_STATUS } from '@/constants/f1'

const props = defineProps({
  drs: {
    type: Number,
    default: null
  }
})

const stateLabel = computed(() => {
  if (DRS_STATUS.ACTIVE.includes(props.drs)) return 'Active'
  if (DRS_STATUS.ELIGIBLE.includes(props.drs)) return 'Eligible'
  if (props.drs == null) return 'N/A'
  return 'Off'
})

const chipColor = computed(() => {
  if (stateLabel.value === 'Active') return 'success'
  if (stateLabel.value === 'Eligible') return 'warning'
  return 'default'
})
</script>

<style lang="scss" scoped>
@use '@/styles/f1/variables' as *;

.drs-indicator {
  display: inline-flex;
}
</style>
