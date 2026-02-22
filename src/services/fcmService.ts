import { PushNotifications } from "@capacitor/push-notifications";

let pushToken: string | null = null;

export async function initializeMobileFCM(): Promise<string | null> {
  console.log("[FCM] Starting Push Notifications init...");
  
  try {
    // Check permission
    const permissionStatus = await PushNotifications.checkPermissions();
    console.log("[FCM] Permission status:", permissionStatus);

    if (permissionStatus.receive === 'granted') {
      console.log("[FCM] Permission already granted");
    } else if (permissionStatus.receive === 'prompt') {
      console.log("[FCM] Requesting permission...");
      const requestResult = await PushNotifications.requestPermissions();
      console.log("[FCM] Request result:", requestResult);
      
      if (requestResult.receive !== 'granted') {
        console.log("[FCM] Permission denied");
        return null;
      }
    } else {
      console.log("[FCM] Permission denied or unavailable:", permissionStatus.receive);
      return null;
    }

    // Register for push notifications
    console.log("[FCM] Registering for push notifications...");
    
    PushNotifications.addListener('registration', (token) => {
      console.log('[FCM] Push token received:', token.value);
      pushToken = token.value;
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('[FCM] Registration error:', error.error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('[FCM] Push notification received:', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('[FCM] Push notification action performed:', notification);
    });

    // Note: Token might not be available immediately
    // We'll need to wait for the registration event
    console.log("[FCM] Waiting for token...");
    
    // Return a promise that resolves when we get the token
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.log("[FCM] Timeout waiting for token");
        resolve(null);
      }, 10000);

      PushNotifications.addListener('registration', (token) => {
        clearTimeout(timeout);
        resolve(token.value);
      });
    });

  } catch (error: any) {
    console.error("[FCM] Error initializing push notifications:", error.message || error);
    return null;
  }
}

export function getCurrentToken(): string | null {
  return pushToken;
}

export async function registerTokenWithBackend(
  userId: string,
  token: string,
  favoriteCoins: string[],
  apiUrl: string,
): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/api/notifications/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        fcmToken: token,
        favoriteCoins,
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log("Token registered with backend successfully");
      return true;
    } else {
      console.error("Failed to register token with backend:", data.error);
      return false;
    }
  } catch (error) {
    console.error("Error registering token with backend:", error);
    return false;
  }
}

export async function updateFavoritesInBackend(
  userId: string,
  favoriteCoins: string[],
  apiUrl: string,
): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/api/notifications/favorites`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        favoriteCoins,
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log("Favorites updated in backend successfully");
      return true;
    } else {
      console.error("Failed to update favorites in backend:", data.error);
      return false;
    }
  } catch (error) {
    console.error("Error updating favorites in backend:", error);
    return false;
  }
}

// Web FCM functions (keep for browser)
export function initializeFirebase() {
  console.log("[FCM] Web Firebase initialization not implemented in simplified version");
}

export async function requestFCMToken(_vapidKey: string): Promise<string | null> {
  console.log("[FCM] Web FCM not implemented");
  return null;
}

export function onForegroundMessage(_callback: (payload: any) => void) {
  console.log("[FCM] Web onForegroundMessage not implemented");
}

export function showLocalNotification(title: string, body: string, icon?: string) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: icon || "/icon.png",
    });
  }
}
