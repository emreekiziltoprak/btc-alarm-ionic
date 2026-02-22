import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.crypto.riskanalyzer",
  appName: "Crypto Risk Analyzer",
  webDir: "dist",
  server: {
    androidScheme: "https",
    cleartext: true,
    ...(process.env.LIVE_RELOAD ? { url: process.env.LIVE_RELOAD } : {}),
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
