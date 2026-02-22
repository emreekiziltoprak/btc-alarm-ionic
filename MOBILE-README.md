# Crypto Risk Analyzer - Mobile App

Bu uygulama Ionic Capacitor ile mobil hale getirilmiştir.

## 📱 Kurulum Tamamlandı

✅ Ionic CLI kuruldu
✅ Capacitor kuruldu ve yapılandırıldı
✅ Ionic Vue components eklendi
✅ Android platform eklendi
✅ Uygulama build edildi

## 🚀 Mobil Uygulamayı Çalıştırma

### 1. Backend API'yi Başlatın

Öncelikle backend API'nin çalışır durumda olması gerekiyor:

```bash
# Ana dizinde
npm run dev
```

### 2. Network Üzerinden Erişim için API URL'ini Güncelleyin

Mobil cihazda çalışması için, `src/api/cryptoApi.ts` dosyasındaki API URL'ini güncelleyin:

```typescript
// Bilgisayarınızın local IP adresini kullanın
const API_BASE_URL = 'http://192.168.1.XXX:3000' // XXX yerine kendi IP'nizi yazın

// IP adresinizi öğrenmek için:
// Windows: ipconfig (Wireless LAN adapter'daki IPv4 Address)
// Mac/Linux: ifconfig
```

### 3. Build ve Sync

API URL'ini güncelledikten sonra:

```bash
cd fe/btc-alarm

# Build
npm run build

# Sync to native platforms
npx cap sync
```

### 4. Android'de Çalıştırma

#### Seçenek A: Android Studio ile

```bash
npx cap open android
```

Bu komut Android Studio'yu açacaktır. Ardından:
1. Android Studio'da projeyi açın
2. Emulator veya gerçek cihaz seçin
3. Run (▶) butonuna tıklayın

#### Seçenek B: Doğrudan Çalıştırma (Cihaz bağlıysa)

```bash
npx cap run android
```

### 5. Browser'da Test (Geliştirme)

Mobil görünümü browser'da test etmek için:

```bash
npm run dev
```

Sonra browser'ın DevTools'unda (F12) mobile view'e geçin (responsive mode).

## 🔧 Önemli Notlar

### API Bağlantısı

- **Emulator için**: `http://10.0.2.2:3000` (Android emulator localhost alias)
- **Gerçek cihaz için**: Bilgisayarınızın local IP'si (örn: `http://192.168.1.100:3000`)
- **Production için**: Gerçek backend URL'i

### Network Security (Android)

Android 9+ cleartext (HTTP) trafiğini varsayılan olarak engeller. Bunu çözmek için:

1. `capacitor.config.ts` dosyasında zaten `cleartext: true` ayarı yapıldı
2. Production'da HTTPS kullanmalısınız

### CORS Ayarları

Backend'de (index.js) CORS zaten yapılandırılmış:

```javascript
app.use(cors({
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
```

## 📦 Kurulu Paketler

- `@ionic/vue` - Ionic Vue UI components
- `@ionic/vue-router` - Ionic routing
- `@capacitor/core` - Capacitor core
- `@capacitor/cli` - Capacitor CLI
- `@capacitor/android` - Android platform
- `apexcharts` - Grafik kütüphanesi
- `vue3-apexcharts` - Vue 3 ApexCharts wrapper

## 🏗️ Proje Yapısı

```
fe/btc-alarm/
├── android/              # Android native project
├── dist/                 # Build output
├── src/
│   ├── components/
│   ├── views/
│   ├── api/
│   └── stores/
├── capacitor.config.ts   # Capacitor configuration
└── vite.config.ts       # Vite configuration
```

## 🔄 Geliştirme Workflow

1. Web uygulamasında değişiklik yapın
2. Build edin: `npm run build`
3. Sync edin: `npx cap sync`
4. Test edin: `npx cap run android` veya Android Studio'da çalıştırın

## 📱 Ionic UI Components (Opsiyonel)

İsterseniz Ionic'in hazır UI componentlerini kullanabilirsiniz:

```vue
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Crypto Risk</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <!-- İçerik -->
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue'
</script>
```

## 🐛 Sorun Giderme

### Build Hatası
```bash
# Cache temizle
rm -rf dist node_modules
npm install
npm run build
```

### Sync Sorunu
```bash
npx cap sync --force
```

### Android Gradle Hatası
```bash
cd android
./gradlew clean
cd ..
npx cap sync
```

## 📚 Kaynaklar

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Ionic Vue Docs](https://ionicframework.com/docs/vue/overview)
- [Ionic UI Components](https://ionicframework.com/docs/components)

## 🎯 Sonraki Adımlar

1. ✅ Backend'i başlatın
2. ✅ API URL'ini güncelleyin (local IP)
3. ✅ Build edin
4. ✅ Android Studio'da çalıştırın
5. 📱 Test edin ve geliştirmeye devam edin!

---

**Not**: iOS için de mobil uygulama oluşturmak isterseniz:

```bash
# iOS platform ekle (Mac gerektirir)
npm install @capacitor/ios
npx cap add ios
npx cap open ios
```
