import React, { useRef, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { toast } from "sonner";
import { useNavigation } from "@/hooks/useNavigation";

export const NaverMap: React.FC = () => {
  const naverMapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { openKakaoNavi, openTMapNavi, openNaverMap } = useNavigation({
    latitude: parseFloat(import.meta.env.VITE_LATITUDE),
    longitude: parseFloat(import.meta.env.VITE_LONGITUDE),
    address: import.meta.env.VITE_ADDRESS,
    name: import.meta.env.VITE_LOCATION_NAME,
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(import.meta.env.VITE_ADDRESS);
      toast.success("주소 복사가 완료되었어요.");
      setIsDrawerOpen(false);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("주소 복사에 실패했어요. 다시 시도해주세요.");
    }
  };

  const handleKakaoNavi = () => {
    openKakaoNavi();
    setIsDrawerOpen(false);
  };

  const handleTMapNavi = () => {
    openTMapNavi();
    setIsDrawerOpen(false);
  };

  const handleNaverMap = () => {
    openNaverMap();
    setIsDrawerOpen(false);
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
      const location = new window.naver.maps.LatLng(
        parseFloat(import.meta.env.VITE_LATITUDE),
        parseFloat(import.meta.env.VITE_LONGITUDE)
      );
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
      <Button variant="outline" className="w-full" onClick={() => setIsDrawerOpen(true)}>
        네비게이션 & 주소복사
      </Button>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
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
              <Button variant="ghost" className="w-full" onClick={handleKakaoNavi}>
                카카오네비 열기
              </Button>
              <div className="h-px w-full bg-gray-300" />
              <Button variant="ghost" className="w-full" onClick={handleTMapNavi}>
                티맵네비 열기
              </Button>
              <div className="h-px w-full bg-gray-300" />
              <Button variant="ghost" className="w-full" onClick={handleNaverMap}>
                네이버네비 열기
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
