// API Configuration
// Dev: VITE_API_URL from .env (local development)
// Prod: VITE_API_URL from .env.production (baked-in at build time)

export const getApiBaseUrl = (): string => {
  // Production build - use the baked-in env variable
  if (import.meta.env.PROD) {
    const prodUrl = import.meta.env.VITE_API_URL;
    // Check if URL is properly configured (not empty, not placeholder)
    if (prodUrl && prodUrl.startsWith('http')) {
      return prodUrl;
    }
    console.warn('⚠️ VITE_API_URL not configured for production!');
    return '';
  }

  // Development: running on a phone/device (not localhost) → hit PC IP directly
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:3000`;
  }

  // Development: browser on localhost → Vite proxy handles /api
  return '';
};

export const API_CONFIG = {
  baseURL: getApiBaseUrl(),
  timeout: 10000,
};

export const API_BASE_URL = getApiBaseUrl();

// Firebase VAPID Key - Firebase Console > Project Settings > Cloud Messaging
export const FIREBASE_VAPID_KEY =
  import.meta.env.VITE_FIREBASE_VAPID_KEY || '';

console.log(`[Config] ${import.meta.env.PROD ? 'Production' : 'Development'} - API: ${API_BASE_URL || '(empty)'}`);
