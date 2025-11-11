import { getAnalytics, isSupported, logEvent } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Storage 인스턴스 생성
export const storage = getStorage(app);

// Analytics 초기화 (브라우저 환경에서만)
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Analytics 이벤트 로깅 헬퍼 함수
export const logAnalyticsEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  }
};

export { analytics };
