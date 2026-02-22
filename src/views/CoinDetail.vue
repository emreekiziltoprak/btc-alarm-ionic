<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="coin-detail">
        <div class="container">
      <button @click="router.push('/')" class="back-btn">
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
        Back to List
      </button>

      <div v-if="loading" class="loading">Loading coin data...</div>
      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else-if="riskData" class="detail-content">
        <!-- Coin Header with Logo -->
        <div class="coin-header">
          <div class="coin-title-section">
            <img
              v-if="coinDetails?.logo"
              :src="coinDetails.logo"
              :alt="riskData.coinName"
              class="coin-logo"
              @error="handleLogoError"
            />
            <div v-else class="coin-logo-placeholder">
              {{ riskData.coinSymbol.charAt(0) }}
            </div>
            <div>
              <h1 class="coin-name">{{ riskData.coinName }}</h1>
              <p class="coin-symbol">{{ riskData.coinSymbol }} · {{ riskData.coinId }}</p>
            </div>
          </div>
        </div>

        <!-- Price Chart -->
        <div class="chart-section">
          <div class="chart-header">
            <h2 class="section-title">Price History</h2>
            <div class="time-range-buttons">
              <button
                v-for="range in timeRanges"
                :key="range.days"
                @click="changeTimeRange(range.days)"
                :class="['range-btn', { active: selectedDays === range.days }]"
              >
                {{ range.label }}
              </button>
            </div>
          </div>
          <div v-if="chartLoading" class="chart-loading">Loading chart...</div>
          <apexchart
            v-else-if="chartOptions"
            type="area"
            height="350"
            :options="chartOptions"
            :series="chartSeries"
          />
        </div>

        <!-- Risk Score Section -->
        <div class="risk-section">
          <h2 class="section-title">Risk Analysis</h2>
          <RiskMeter :risk="riskData.finalRisk" />
        </div>

        <!-- Metrics Grid -->
        <div class="metrics-grid">
          <div class="metric-card">
            <h3 class="metric-label">Market Cap</h3>
            <p class="metric-value">${{ formatNumber(riskData.market_cap) }}</p>
          </div>

          <div class="metric-card">
            <h3 class="metric-label">24h Volume</h3>
            <p class="metric-value">${{ formatNumber(riskData.volume_24h) }}</p>
          </div>

          <div class="metric-card">
            <h3 class="metric-label">Volume Ratio</h3>
            <p class="metric-value">{{ (riskData.volumeRatio * 100).toFixed(3) }}%</p>
          </div>

          <div class="metric-card">
            <h3 class="metric-label">Soft Risk</h3>
            <p class="metric-value">{{ (riskData.softRisk * 100).toFixed(1) }}%</p>
          </div>

          <div class="metric-card">
            <h3 class="metric-label">Hard Penalty</h3>
            <p class="metric-value">{{ (riskData.hardPenalty * 100).toFixed(1) }}%</p>
          </div>

          <div class="metric-card">
            <h3 class="metric-label">Liquidity Weakness</h3>
            <p class="metric-value">{{ (riskData.liquidityWeakness * 100).toFixed(1) }}%</p>
          </div>

          <div class="metric-card">
            <h3 class="metric-label">Volume Drop Risk</h3>
            <p class="metric-value">{{ (riskData.volumeDropRisk * 100).toFixed(1) }}%</p>
          </div>

          <div class="metric-card">
            <h3 class="metric-label">Volume Pump Risk</h3>
            <p class="metric-value">{{ (riskData.volumePumpRisk * 100).toFixed(1) }}%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCryptoStore } from '../stores/cryptoStore'
import { cryptoApi } from '../api/cryptoApi'
import RiskMeter from '../components/RiskMeter.vue'
import type { RiskScore } from '../types/crypto'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const store = useCryptoStore()
const riskData = ref<RiskScore | null>(null)
const coinDetails = ref<any>(null)
const historicalData = ref<any[]>([])
const loading = ref(true)
const chartLoading = ref(false)
const error = ref<string | null>(null)
const selectedDays = ref(7)

const timeRanges = [
  { label: '7D', days: 7 },
  { label: '14D', days: 14 },
  { label: '30D', days: 30 }
]

const chartSeries = computed(() => {
  if (!historicalData.value.length) return []

  return [{
    name: 'Price',
    data: historicalData.value.map(item => ({
      x: new Date(item.timestamp).getTime(),
      y: item.price
    }))
  }]
})

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    height: 350,
    zoom: {
      enabled: true
    },
    toolbar: {
      show: true
    },
    background: 'transparent'
  },
  colors: ['#6366f1'],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 90, 100]
    }
  },
  xaxis: {
    type: 'datetime',
    labels: {
      style: {
        colors: '#94a3b8'
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: '#94a3b8'
      },
      formatter: (value: number) => {
        return '$' + formatNumber(value)
      }
    }
  },
  grid: {
    borderColor: '#334155',
    strokeDashArray: 4
  },
  tooltip: {
    theme: 'dark',
    x: {
      format: 'dd MMM yyyy'
    },
    y: {
      formatter: (value: number) => {
        return '$' + value.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      }
    }
  }
}))

function formatNumber(num: number): string {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return num.toFixed(2)
}

async function loadHistoricalData(days: number) {
  chartLoading.value = true
  try {
    historicalData.value = await cryptoApi.getHistoricalData(props.id, days)
  } catch (e) {
    console.error('Failed to load historical data:', e)
  } finally {
    chartLoading.value = false
  }
}

function changeTimeRange(days: number) {
  selectedDays.value = days
  loadHistoricalData(days)
}

function handleLogoError(event: Event) {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

onMounted(async () => {
  try {
    // Load risk data and coin details in parallel
    const [risk, details] = await Promise.all([
      store.fetchRiskScore(props.id),
      cryptoApi.getCoinDetails(props.id)
    ])

    riskData.value = risk || null
    coinDetails.value = details

    // Load initial historical data
    await loadHistoricalData(selectedDays.value)
  } catch (e) {
    error.value = 'Failed to load coin data'
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.coin-detail {
  min-height: 100vh;
  min-height: 100dvh;
  background: #0f172a;
  padding: 12px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #6366f1;
  background: #1e293b;
  border: 1px solid #6366f1;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 12px;
  transition: all 0.2s;
}

.back-btn:active {
  background: #334155;
  transform: scale(0.98);
}

.loading,
.error {
  text-align: center;
  padding: 40px 16px;
  font-size: 15px;
  color: #94a3b8;
}

.error {
  color: #f87171;
}

.detail-content {
  background: #1e293b;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #334155;
}

.coin-header {
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid #334155;
}

.coin-title-section {
  display: flex;
  align-items: center;
  gap: 14px;
}

.coin-logo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background: #334155;
  flex-shrink: 0;
}

.coin-logo-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.coin-name {
  font-size: 20px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 4px 0;
}

.coin-symbol {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

.chart-section {
  margin-bottom: 16px;
  padding: 14px;
  background: #0f172a;
  border-radius: 10px;
  border: 1px solid #334155;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 10px;
}

.time-range-buttons {
  display: flex;
  gap: 8px;
}

.range-btn {
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.range-btn:active {
  transform: scale(0.95);
}

.range-btn.active {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
}

.chart-loading {
  text-align: center;
  padding: 60px 16px;
  color: #94a3b8;
  font-size: 14px;
}

.risk-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0 0 12px 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.metric-card {
  padding: 14px;
  background: #0f172a;
  border-radius: 10px;
  border: 1px solid #334155;
}

.metric-label {
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
  margin: 0 0 6px 0;
}

.metric-value {
  font-size: 18px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

@media (max-width: 375px) {
  .coin-detail {
    padding: 10px;
  }

  .detail-content {
    padding: 12px;
  }

  .coin-logo,
  .coin-logo-placeholder {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .coin-name {
    font-size: 17px;
  }

  .coin-symbol {
    font-size: 11px;
  }

  .metrics-grid {
    gap: 8px;
  }

  .metric-card {
    padding: 10px;
  }

  .metric-value {
    font-size: 15px;
  }
}

@media (min-width: 768px) {
  .coin-detail {
    padding: 20px;
  }

  .detail-content {
    padding: 24px;
  }

  .coin-logo,
  .coin-logo-placeholder {
    width: 56px;
    height: 56px;
    font-size: 24px;
  }

  .coin-name {
    font-size: 24px;
  }

  .metrics-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  .metric-card {
    padding: 16px;
  }
}
</style>
