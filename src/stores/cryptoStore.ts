import { defineStore } from "pinia";
import { ref, computed, toRaw, watch } from "vue";
import { cryptoApi } from "../api/cryptoApi";
import type { Coin, RiskScore } from "../types/crypto";
import {
  addFavorites,
  getAllFavCoins,
  removeFav as removeFavFromDb,
} from "../db/favorites.db";
import {
  initializeFirebase,
  requestFCMToken,
  onForegroundMessage,
  showLocalNotification,
  registerTokenWithBackend,
  updateFavoritesInBackend,
  getCurrentToken,
  initializeMobileFCM,
} from "../services/fcmService";
import { API_BASE_URL } from "../config";
import { Capacitor } from "@capacitor/core";

export const useCryptoStore = defineStore("crypto", () => {
  const coins = ref<Coin[]>([]);
  const favoriteCoins = ref<Coin[]>([]);
  const riskScores = ref<Map<string, RiskScore>>(new Map());
  const loading = ref(false);
  const loadingMore = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref("");
  const fcmToken = ref<string | null>(null);
  const notificationsEnabled = ref(false);
  const userId = ref<string>(generateUserId());
  const hasMore = ref(true);
  const currentPage = ref(0);
  const PAGE_SIZE = 100;

  const filteredCoins = computed(() => {
    if (!searchQuery.value) return coins.value;
    const query = searchQuery.value.toLowerCase();
    return coins.value.filter(
      (coin) =>
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query) ||
        coin.id.toLowerCase().includes(query),
    );
  });

  async function fetchCoins() {
    loading.value = true;
    error.value = null;
    coins.value = [];
    currentPage.value = 0;
    hasMore.value = true;
    
    try {
      const response = await cryptoApi.getCoinsPaginated(0, PAGE_SIZE);
      coins.value = response.data;
      hasMore.value = response.pagination.hasMore;
      currentPage.value = 1;
      favoriteCoins.value = await getAllFavCoins();
    } catch (e) {
      error.value = "Failed to fetch coins";
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  async function loadMoreCoins() {
    if (loadingMore.value || !hasMore.value) return;
    
    loadingMore.value = true;
    try {
      const response = await cryptoApi.getCoinsPaginated(currentPage.value * PAGE_SIZE, PAGE_SIZE);
      coins.value = [...coins.value, ...response.data];
      hasMore.value = response.pagination.hasMore;
      currentPage.value++;
    } catch (e) {
      console.error("Failed to load more coins:", e);
    } finally {
      loadingMore.value = false;
    }
  }

  async function addFav(coin: Coin) {
    try {
      await addFavorites(toRaw(coin));
      const index = favoriteCoins.value.findIndex((c) => c.id === coin.id);
      if (index === -1) favoriteCoins.value.push(coin);
      else favoriteCoins.value.splice(index, 1);
    } catch (e) {
      console.log("bir hata oluştu", e);
    }
  }

  async function removeFav(id: string) {
    try {
      await removeFavFromDb(id);
      const index = favoriteCoins.value.findIndex((c) => c.id === id);
      if (index !== -1) favoriteCoins.value.splice(index, 1);
    } catch (e) {
      console.log("bir hata oluştu", e);
    }
  }

  /* takes all favorite coins from db */
  async function getAllFav() {
    try {
      const favCoins = await getAllFavCoins();
      favoriteCoins.value = [...favCoins];
    } catch (e) {
      console.log("bir hata oluştu", e);
    }
  }

  async function fetchRiskScore(coinId: string) {
    if (riskScores.value.has(coinId)) {
      return riskScores.value.get(coinId);
    }

    try {
      const score = await cryptoApi.getCoinRisk(coinId);
      riskScores.value.set(coinId, score);
      return score;
    } catch (e) {
      console.error(`Failed to fetch risk for ${coinId}`, e);
      throw e;
    }
  }

  function getRiskColor(risk: number): string {
    if (risk < 0.3) return "#22c55e";
    if (risk < 0.6) return "#eab308";
    return "#ef4444";
  }

  function getRiskLabel(risk: number): string {
    if (risk < 0.3) return "Low Risk";
    if (risk < 0.6) return "Medium Risk";
    return "High Risk";
  }
  function isFavCoin(coin: Coin) {
    return favoriteCoins.value.some((favCoin) => favCoin.id === coin.id);
  }

  // Helper: Generate unique user ID
  function generateUserId(): string {
    const stored = localStorage.getItem("cryptoUserId");
    if (stored) return stored;

    const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("cryptoUserId", newId);
    return newId;
  }

  // FCM: Initialize Firebase and request notification permission
  async function initializeFCM() {
    console.log("[Store] Starting FCM initialization...");
    
    try {
      const isMobile = Capacitor.isNativePlatform() || 
        /android|iphone|ipad|mobile/i.test(navigator.userAgent);

      console.log("[Store] isMobile:", isMobile);

      if (isMobile) {
        // Mobil FCM - use Capacitor Push Notifications
        console.log("[Store] Calling initializeMobileFCM...");
        const token = await initializeMobileFCM();
        console.log("[Store] Token from mobile FCM:", token);

        if (token) {
          fcmToken.value = token;
          notificationsEnabled.value = true;
          console.log("[Store] notificationsEnabled set to true");

          const favIds = favoriteCoins.value.map((c) => c.id);
          await registerTokenWithBackend(
            userId.value,
            token,
            favIds,
            API_BASE_URL,
          );

          console.log("[Store] Mobile FCM initialized successfully");
          return true;
        }
        console.log("[Store] No token received");
        return false;
      } else {
        // Web FCM
        console.log("Initializing web FCM...");
        initializeFirebase();

        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
        if (!vapidKey || vapidKey === "YOUR_VAPID_KEY") {
          console.warn("VAPID key not configured. FCM notifications disabled.");
          return false;
        }

        const token = await requestFCMToken(vapidKey);

        if (token) {
          fcmToken.value = token;
          notificationsEnabled.value = true;

          const favIds = favoriteCoins.value.map((c) => c.id);
          await registerTokenWithBackend(
            userId.value,
            token,
            favIds,
            API_BASE_URL,
          );

          onForegroundMessage((payload) => {
            console.log("Foreground notification:", payload);

            const title = payload.notification?.title || "Crypto Risk Alert";
            const body = payload.notification?.body || "Check your coins";

            showLocalNotification(title, body);
          });

          console.log("Web FCM initialized successfully");
          return true;
        }

        return false;
      }
    } catch (error: any) {
      console.error("[Store] FCM initialization error:", error.message || error);
      return false;
    }
  }

  // FCM: Favori coin değiştiğinde backend'i güncelle
  async function syncFavoritesWithBackend() {
    const token = getCurrentToken();
    if (!token) return;

    const favIds = favoriteCoins.value.map((c) => c.id);
    await updateFavoritesInBackend(userId.value, favIds, API_BASE_URL);
  }

  // Watch favorites changes and sync with backend
  watch(
    favoriteCoins,
    () => {
      if (notificationsEnabled.value) {
        syncFavoritesWithBackend();
      }
    },
    { deep: true },
  );

  return {
    coins,
    favoriteCoins,
    riskScores,
    loading,
    loadingMore,
    error,
    searchQuery,
    filteredCoins,
    fcmToken,
    notificationsEnabled,
    userId,
    hasMore,
    fetchCoins,
    loadMoreCoins,
    fetchRiskScore,
    getRiskColor,
    getRiskLabel,
    addFav,
    isFavCoin,
    removeFav,
    getAllFav,
    initializeFCM,
    syncFavoritesWithBackend,
  };
});
