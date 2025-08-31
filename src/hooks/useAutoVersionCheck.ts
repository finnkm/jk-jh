import { useEffect } from "react";
import { Workbox } from "workbox-window";

export const useAutoVersionCheck = () => {
  useEffect(() => {
    // Disable Service Worker in development environment
    if (import.meta.env.DEV) {
      console.log("Service Worker disabled in development mode");
      return;
    }

    if ("serviceWorker" in navigator) {
      const workbox = new Workbox("/jk-jh/sw.js", { scope: "/jk-jh/" });

      // Auto-update immediately when new version is detected
      workbox.addEventListener("waiting", () => {
        workbox.messageSkipWaiting();
      });

      // Reload page when new Service Worker becomes active
      workbox.addEventListener("controlling", () => {
        window.location.reload();
      });

      // Register Service Worker and check for updates
      workbox
        .register()
        .then((registration) => {
          if (!registration) return;

          // Check for updates when page gains focus
          const handleVisibilityChange = () => {
            if (!document.hidden) {
              registration.update();
            }
          };

          document.addEventListener("visibilitychange", handleVisibilityChange);

          // Initial update check
          setTimeout(() => registration.update(), 3000);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);
};
