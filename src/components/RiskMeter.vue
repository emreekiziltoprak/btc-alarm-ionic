<template>
  <div class="risk-meter">
    <div class="risk-bar">
      <div
        class="risk-fill"
        :style="{
          width: `${risk * 100}%`,
          backgroundColor: color
        }"
      ></div>
    </div>
    <div class="risk-info">
      <span class="risk-value">{{ (risk * 100).toFixed(1) }}%</span>
      <span class="risk-label" :style="{ color }">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCryptoStore } from '../stores/cryptoStore'

const props = defineProps<{
  risk: number
}>()

const store = useCryptoStore()

const color = computed(() => store.getRiskColor(props.risk))
const label = computed(() => store.getRiskLabel(props.risk))
</script>

<style scoped>
.risk-meter {
  width: 100%;
}

.risk-bar {
  height: 24px;
  background-color: #334155;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 8px;
}

.risk-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
  border-radius: 12px;
}

.risk-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.risk-value {
  font-weight: 600;
  color: #e2e8f0;
}

.risk-label {
  font-weight: 500;
}
</style>
