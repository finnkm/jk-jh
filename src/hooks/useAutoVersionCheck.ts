import { useEffect } from "react";
import { Workbox } from "workbox-window";

export const useAutoVersionCheck = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const workbox = new Workbox("/jk-jh/sw.js", { scope: "/jk-jh/" });

      // 새 버전 감지 시 즉시 자동 업데이트
      workbox.addEventListener("waiting", () => {
        workbox.messageSkipWaiting();
      });

      // 새 Service Worker 활성화 시 페이지 리로드
      workbox.addEventListener("controlling", () => {
        window.location.reload();
      });

      // Service Worker 등록 및 업데이트 체크
      workbox
        .register()
        .then((registration) => {
          if (!registration) return;

          // 페이지 포커스 시 업데이트 체크
          const handleVisibilityChange = () => {
            if (!document.hidden) {
              registration.update();
            }
          };

          document.addEventListener("visibilitychange", handleVisibilityChange);

          // 초기 업데이트 체크
          setTimeout(() => registration.update(), 3000);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);
};
