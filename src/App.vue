<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { onMounted } from 'vue'
import { useCryptoStore } from './stores/cryptoStore'

const cryptoStore = useCryptoStore()

onMounted(async () => {
  await cryptoStore.initializeFCM()
})
</script>

<style>
:root {
  --ion-color-primary: #6366f1;
  --ion-color-primary-rgb: 99, 102, 241;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-contrast-rgb: 255, 255, 255;
  --ion-color-primary-shade: #5658d4;
  --ion-color-primary-tint: #7375f2;
  
  --ion-background-color: #0f172a;
  --ion-background-color-rgb: 15, 23, 42;
  
  --ion-text-color: #e2e8f0;
  --ion-text-color-rgb: 226, 232, 240;
  
  --ion-card-background: #1e293b;
  --ion-item-background: #1e293b;
  
  --ion-border-color: #334155;
  --ion-placeholder-text-color: #94a3b8;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #0f172a;
  color: #e2e8f0;
  line-height: 1.5;
  -webkit-tap-highlight-color: transparent;
}

#app {
  min-height: 100vh;
  background-color: #0f172a;
  min-height: 100dvh;
}

ion-content {
  --background: #0f172a;
}

ion-router-outlet {
  min-height: 100dvh;
}

a {
  color: #6366f1;
  text-decoration: none;
}

button {
  font-family: inherit;
  cursor: pointer;
}

input {
  font-family: inherit;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #1e293b;
}

::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

@media (max-width: 320px) {
  html {
    font-size: 14px;
  }
}

@media (min-width: 768px) {
  html {
    font-size: 16px;
  }
}

@media (min-width: 1024px) {
  html {
    font-size: 16px;
  }
}
</style>
