import React, { useRef, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { toast } from "sonner";

const LATITUDE = 37.515287;
const LONGITUDE = 127.102981;

const ADDRESS = "서울 송파구 올림픽로35다길 42";

export const NaverMap: React.FC = () => {
  const naverMapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS);
      toast("주소 복사가 완료되었어요.");
      setIsDrawerOpen(false);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

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

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div ref={naverMapRef} className="w-full h-80" />
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Button variant="outline" className="w-full" onClick={() => setIsDrawerOpen(true)}>
          네비게이션 연결
        </Button>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm gap-4">
            <DrawerHeader>
              <DrawerTitle>원하시는 항목을 선택하세요.</DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col items-center justify-center gap-2">
              <Button variant="ghost" className="w-full" onClick={copyToClipboard}>
                주소복사
              </Button>
              <div className="h-px w-full bg-gray-300" />
              <Button variant="ghost" className="w-full">
                카카오네비 연결
              </Button>
              <div className="h-px w-full bg-gray-300" />
              <Button variant="ghost" className="w-full">
                티맵네비 연결
              </Button>
            </div>
            <DrawerFooter>
              <Button className="w-full" onClick={() => setIsDrawerOpen(false)}>
                닫기
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
