<template>
  <div
    class="coin-card"
    @click="router.push(`/coin/${coin.id}`)"
  >
    <div class="coin-header">
      <div class="coin-info">
        <img
          v-if="coin.logo"
          :src="coin.logo"
          :alt="coin.name"
          class="coin-logo"
          @error="handleImageError"
        />
        <div v-else class="coin-logo-placeholder">
          {{ coin.symbol.charAt(0) }}
        </div>
        <div class="coin-details">
          <h3 class="coin-name">{{ coin.name }}</h3>
          <span class="coin-symbol">{{ coin.symbol }}</span>
        </div>
        <font-awesome-icon
          :icon="['fas', 'star']"
          @click.stop="() => toggleFavorite(coin)"
          :style="{
            color: isFavorite ? '#fbbf24' : '#64748b',
            cursor: 'pointer',
          }"
          class="favorite-icon"
        />
      </div>
      <span class="coin-rank">#{{ coin.rank }}</span>
    </div>
    <div class="coin-id">{{ coin.id }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCryptoStore } from '../stores/cryptoStore'
import type { Coin } from '../types/crypto'

interface Props {
  coin: Coin
}

const props = defineProps<Props>()
const store = useCryptoStore()
const router = useRouter()

const isFavorite = computed(() => store.isFavCoin(props.coin))

const toggleFavorite = (coin: Coin) => {
  store.addFav(coin)
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}
</script>

<style scoped>
.coin-card {
  padding: 10px 12px;
  border: 1px solid #334155;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #1e293b;
}

.coin-card:active {
  background: #334155;
  transform: scale(0.98);
}

.coin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.coin-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.coin-logo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  background: #334155;
  flex-shrink: 0;
}

.coin-logo-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.coin-details {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.coin-name {
  font-size: 15px;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.coin-symbol {
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
  text-transform: uppercase;
}

.favorite-icon {
  flex-shrink: 0;
  font-size: 16px;
  transition: transform 0.2s;
  padding: 8px;
}

.favorite-icon:active {
  transform: scale(1.2);
}

.coin-rank {
  font-size: 11px;
  font-weight: 600;
  color: #6366f1;
  background: #312e81;
  padding: 3px 8px;
  border-radius: 4px;
  margin-left: 8px;
  flex-shrink: 0;
}

.coin-id {
  display: none;
}

@media (max-width: 375px) {
  .coin-card {
    padding: 8px 10px;
  }

  .coin-logo,
  .coin-logo-placeholder {
    width: 32px;
    height: 32px;
  }

  .coin-name {
    font-size: 14px;
  }

  .coin-symbol {
    font-size: 11px;
  }

  .coin-rank {
    font-size: 10px;
    padding: 2px 6px;
  }
}

@media (min-width: 768px) {
  .coin-card {
    padding: 14px 16px;
  }

  .coin-logo,
  .coin-logo-placeholder {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }

  .coin-name {
    font-size: 17px;
  }

  .coin-symbol {
    font-size: 13px;
  }

  .favorite-icon {
    font-size: 18px;
  }
}
</style>
