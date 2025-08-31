import React, { useRef, useEffect, useState } from "react";

const LATITUDE = 37.515287;
const LONGITUDE = 127.102981;

export const NaverMap: React.FC = () => {
  const naverMapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadNaverMapScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.naver?.maps) {
          resolve();
          return;
        }

        const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
        if (!clientId) {
          reject(new Error("VITE_NAVER_MAP_CLIENT_ID not found in environment variables"));
          return;
        }

        const script = document.createElement("script");
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Naver Map script"));

        document.head.appendChild(script);
      });
    };

    loadNaverMapScript()
      .then(() => setIsLoaded(true))
      .catch((error) => console.error("Naver Map load error:", error));
  }, []);

  useEffect(() => {
    if (isLoaded && naverMapRef.current && window.naver?.maps) {
      const location = new window.naver.maps.LatLng(LATITUDE, LONGITUDE);
      const map = new window.naver.maps.Map(naverMapRef.current, {
        center: location,
        zoom: 17,
      });
      new window.naver.maps.Marker({
        position: location,
        map,
      });
    }
  }, [isLoaded]);

  return <div ref={naverMapRef} className="w-full h-80" />;
};
