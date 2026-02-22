<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <div class="home">
                <div class="fcm-status">
                    <button @click="initFCM" class="enable-notifications-btn">
                        🔔 {{ cryptoStore.notificationsEnabled ? 'Notifications Enabled' : 'Enable Notifications' }}
                    </button>
                </div>
                <CoinList />
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from "@ionic/vue";
import { onMounted } from "vue";
import { useCryptoStore } from "../stores/cryptoStore";
import CoinList from "../components/CoinList.vue";

const cryptoStore = useCryptoStore();

const initFCM = async () => {
    console.log("[Home] Button clicked, initializing FCM...");
    try {
        const result = await cryptoStore.initializeFCM();
        console.log("[Home] FCM init result:", result);
        console.log("[Home] notificationsEnabled:", cryptoStore.notificationsEnabled);
    } catch (e) {
        console.error("[Home] FCM init error:", e);
    }
};

onMounted(() => {
    console.log("[Home] Mounted, notificationsEnabled:", cryptoStore.notificationsEnabled);
});
</script>

<style scoped>
.home {
    min-height: 100vh;
    background: #0f172a;
}

.fcm-status {
    padding: 12px;
    text-align: center;
}

.enable-notifications-btn {
    background: #6366f1;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
}

.enable-notifications-btn:active {
    background: #4f46e5;
}
</style>
