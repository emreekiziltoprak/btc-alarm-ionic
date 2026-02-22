<template>
  <div class="coin-list" ref="listContainer">
    <div class="search-bar">
      <input
        v-model="store.searchQuery"
        type="text"
        placeholder="Search coins by name, symbol or ID..."
        class="search-input"
      />
      <button text="fav" class="fav-coins-btn" @click="goToFav">
      <font-awesome-icon  :icon="'star'"  :color="'#fbbf24'"/>
        Favorite Coins</button>
    </div>

    <div v-if="store.loading" class="loading">
      <span class="loading-spinner"></span>
      Loading coins...</div>
    <div v-else-if="store.error" class="error">{{ store.error }}</div>
    <div v-else-if="store.filteredCoins.length === 0" class="no-results">
      No coins found
    </div>

    <div v-else class="coins-grid">
      <CoinCard
        v-for="coin in store.filteredCoins"
        :key="coin.id"
        :coin="coin"
      />
    </div>

    <div v-if="store.hasMore && !store.searchQuery" class="load-more">
      <button 
        @click="loadMore" 
        class="load-more-btn"
        :disabled="store.loadingMore"
      >
        <span v-if="store.loadingMore" class="loading-spinner small"></span>
        <span v-else>Load More ({{ store.filteredCoins.length }} loaded)</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useCryptoStore } from "../stores/cryptoStore";
import CoinCard from "./CoinCard.vue";

const store = useCryptoStore();
const router = useRouter();
const listContainer = ref<HTMLElement | null>(null);

const goToFav =()=>{
  router.push("/favorites");
}

const loadMore = () => {
  store.loadMoreCoins();
};

const handleScroll = () => {
  if (!listContainer.value || store.loadingMore || !store.hasMore || store.searchQuery) return;
  
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;
  
  if (scrollTop + clientHeight >= scrollHeight - 200) {
    loadMore();
  }
};

onMounted(() => {
  store.fetchCoins();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.coin-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px;
  width: 100%;
}

.search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.fav-coins-btn {
  background: #334155;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border: 2px solid transparent;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s;
}

.fav-coins-btn:active {
  background: #475569;
  transform: scale(0.98);
}

.search-input {
  flex: 1;
  min-width: 0;
  padding: 10px 14px;
  font-size: 15px;
  border: 2px solid #334155;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
  background: #1e293b;
  color: #e2e8f0;
}

.search-input:focus {
  border-color: #6366f1;
}

.search-input::placeholder {
  color: #64748b;
}

.loading,
.error,
.no-results {
  text-align: center;
  padding: 40px 16px;
  font-size: 16px;
  color: #94a3b8;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #334155;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  color: #f87171;
}

.coins-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.load-more {
  text-align: center;
  margin-top: 24px;
}

.load-more-btn {
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  background: #6366f1;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.load-more-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.load-more-btn:active:not(:disabled) {
  background: #4f46e5;
  transform: scale(0.98);
}

.loading-spinner.small {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

@media (max-width: 375px) {
  .coin-list {
    padding: 10px;
  }

  .search-bar {
    flex-direction: column;
  }

  .fav-coins-btn {
    justify-content: center;
    padding: 12px;
  }

  .search-input {
    font-size: 14px;
    padding: 10px 12px;
  }
}

@media (max-width: 480px) {
  .fav-coins-btn span {
    display: none;
  }

  .fav-coins-btn::before {
    content: "★";
    font-size: 16px;
  }
}

@media (min-width: 768px) {
  .coin-list {
    padding: 20px;
  }

  .search-bar {
    margin-bottom: 16px;
  }

  .search-input {
    padding: 14px 16px;
    font-size: 16px;
  }

  .fav-coins-btn {
    padding: 14px 20px;
    font-size: 15px;
  }

  .coins-grid {
    gap: 10px;
  }
}
</style>
