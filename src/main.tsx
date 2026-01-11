import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// 화면 확대 방지 (아이폰 사파리 포함)
const preventZoom = () => {
  let lastTouchEnd = 0;
  let initialDistance = 0;
  let lastTouchTime = 0;

  // 멀티터치 감지 및 차단
  document.addEventListener(
    "touchstart",
    (e) => {
      const now = Date.now();

      // 멀티터치 감지
      if (e.touches.length > 1) {
        e.preventDefault();
        e.stopPropagation();
        // 두 손가락 간 거리 계산
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        return false;
      }

      // 더블탭 감지
      if (now - lastTouchTime < 300) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      lastTouchTime = now;
    },
    { passive: false }
  );

  // 스크롤 중 핀치 줌 차단
  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // 두 손가락 간 거리 변화 감지 (핀치 줌)
      if (initialDistance > 0 && e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);

        // 거리 변화가 있으면 확대/축소 시도로 간주
        if (Math.abs(currentDistance - initialDistance) > 10) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    },
    { passive: false }
  );

  document.addEventListener(
    "touchend",
    (e) => {
      initialDistance = 0;
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    },
    { passive: false }
  );

  // 제스처 이벤트 차단
  document.addEventListener(
    "gesturestart",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
    { passive: false }
  );

  document.addEventListener(
    "gesturechange",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
    { passive: false }
  );

  document.addEventListener(
    "gestureend",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
    { passive: false }
  );

  // 마우스 휠로 확대 차단 (Ctrl + 스크롤)
  document.addEventListener(
    "wheel",
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
    { passive: false }
  );
};

preventZoom();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
