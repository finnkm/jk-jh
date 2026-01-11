import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// 화면 확대 방지 (아이폰 사파리 포함)
const preventZoom = () => {
  let lastTouchEnd = 0;

  document.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  document.addEventListener(
    "touchend",
    (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    },
    { passive: false }
  );

  document.addEventListener("gesturestart", (e) => {
    e.preventDefault();
  });

  document.addEventListener("gesturechange", (e) => {
    e.preventDefault();
  });

  document.addEventListener("gestureend", (e) => {
    e.preventDefault();
  });
};

preventZoom();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
