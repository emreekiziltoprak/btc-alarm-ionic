<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="favorites-page">
    <header class="header">
      <button @click="goBack" class="back-btn">
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
        Back
      </button>
      <h1 class="title">Favorite Coins</h1>
      <p class="subtitle">Your saved cryptocurrencies</p>
    </header>

    <div class="favorites-content">
      <div class="search-bar">
        <input
          v-model="search"
          type="text"
          placeholder="Search your favorites..."
          class="search-input"
        />
      </div>

      <div v-if="filteredFavorites.length === 0" class="no-results">
        <font-awesome-icon :icon="['fas', 'star']" class="empty-icon" />
        <p>No favorite coins yet</p>
        <p class="hint">Start adding coins to your favorites from the main list</p>
      </div>

      <div v-else class="coins-grid">
        <CoinCard
          v-for="coin in filteredFavorites"
          :key="coin.id"
          :coin="coin"
        />
      </div>
    </div>
  </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCryptoStore } from '../stores/cryptoStore'
import CoinCard from './CoinCard.vue'

const store = useCryptoStore()
const router = useRouter()
const search = ref<string>('')

const filteredFavorites = computed(() => {
  if (!search.value) return store.favoriteCoins

  const query = search.value.toLowerCase()
  return store.favoriteCoins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(query) ||
      coin.symbol.toLowerCase().includes(query) ||
      coin.id.toLowerCase().includes(query)
  )
})

const goBack = () => {
  router.push('/')
}

onMounted(async () => {
  await store.getAllFav()
})
</script>

<style scoped>
.favorites-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: #0f172a;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 12px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: transparent;
  border: 1px solid #6366f1;
  border-radius: 8px;
  color: #6366f1;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.back-btn:active {
  background: #334155;
  transform: scale(0.98);
}

.title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #f1f5f9;
}

.subtitle {
  display: none;
}

.favorites-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px;
}

.search-bar {
  margin-bottom: 12px;
}

.search-input {
  width: 100%;
  padding: 12px 14px;
  font-size: 15px;
  border: 2px solid #334155;
  border-radius: 8px;
  outline: none;
  background: #1e293b;
  color: #e2e8f0;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #6366f1;
}

.search-input::placeholder {
  color: #64748b;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  padding: 60px 20px;
  font-size: 15px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 48px;
  color: #64748b;
}

.hint {
  font-size: 13px;
  color: #64748b;
}

.coins-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

@media (max-width: 375px) {
  .favorites-content {
    padding: 10px;
  }

  .header {
    padding: 12px 10px;
  }

  .back-btn {
    padding: 8px 12px;
    font-size: 13px;
  }

  .title {
    font-size: 16px;
  }

  .search-input {
    padding: 10px 12px;
    font-size: 14px;
  }

  .no-results {
    padding: 40px 16px;
  }

  .empty-icon {
    font-size: 40px;
  }
}

@media (min-width: 768px) {
  .favorites-content {
    padding: 20px;
  }

  .header {
    padding: 18px 20px;
  }

  .back-btn {
    padding: 10px 18px;
    font-size: 15px;
  }

  .title {
    font-size: 22px;
  }

  .search-input {
    padding: 14px 16px;
    font-size: 16px;
  }

  .coins-grid {
    gap: 10px;
  }
}
</style>