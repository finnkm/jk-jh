import { useCallback } from "react";

export type NavigationType = "kakao" | "tmap" | "naver";

interface NavigationOptions {
  latitude: number;
  longitude: number;
  name: string;
}

export const useNavigation = (defaultOptions: NavigationOptions) => {
  const openNavigation = useCallback(
    (type: NavigationType, options?: Partial<NavigationOptions>) => {
      const { latitude, longitude, name } = { ...defaultOptions, ...options };

      // 모바일 디바이스 감지
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      // 티맵은 모바일에서만 사용 가능
      if (type === "tmap" && !isMobile) {
        throw new Error("티맵은 모바일 환경에서만 사용할 수 있습니다.");
      }

      let url = "";

      switch (type) {
        case "kakao":
          // 카카오맵 - 현재 위치에서 목적지로의 경로 안내
          url = `kakaomap://route?ep=${latitude},${longitude}&by=CAR`;
          break;

        case "tmap":
          // 티맵 - 현재 위치에서 목적지로의 경로 안내
          url = `tmap://route?goalx=${longitude}&goaly=${latitude}&goalname=${encodeURIComponent(name)}`;
          break;

        case "naver":
          // 네이버 지도 - 현재 위치에서 목적지로의 도보 경로 안내
          url = `nmap://route/public?dlat=${latitude}&dlng=${longitude}&dname=${encodeURIComponent(name)}&appname=com.example.myapp`;
          break;

        default:
          console.error("Unsupported navigation type:", type);
          return;
      }

      // 모바일 앱이 설치되어 있는지 확인하고 열기 시도
      const openApp = () => {
        window.location.href = url;
      };

      // 웹 브라우저 fallback을 위한 함수
      const openWebFallback = () => {
        let fallbackUrl = "";

        switch (type) {
          case "kakao":
            fallbackUrl = `https://map.kakao.com/link/to/${encodeURIComponent(name)},${latitude},${longitude}`;
            break;
          case "tmap":
            fallbackUrl = `https://tmap.life/route?goalx=${longitude}&goaly=${latitude}&goalname=${encodeURIComponent(name)}`;
            break;
          case "naver":
            fallbackUrl = `http://map.naver.com/index.nhn?menu=route&elat=${latitude}&elng=${longitude}&eText=${encodeURIComponent(name)}`;
            break;
        }

        if (fallbackUrl) {
          window.open(fallbackUrl, "_blank");
        }
      };

      if (isMobile && (type === "kakao" || type === "tmap" || type === "naver")) {
        // 모바일에서는 앱 열기를 먼저 시도
        openApp();

        // 2초 후에 앱이 열리지 않으면 웹 페이지로 이동
        setTimeout(() => {
          openWebFallback();
        }, 2000);
      } else {
        // 데스크톱이나 지원하지 않는 경우 웹 페이지 열기
        openWebFallback();
      }
    },
    [defaultOptions]
  );

  const openKakaoNavi = useCallback(
    (options?: Partial<NavigationOptions>) => {
      openNavigation("kakao", options);
    },
    [openNavigation]
  );

  const openTMapNavi = useCallback(
    (options?: Partial<NavigationOptions>) => {
      openNavigation("tmap", options);
    },
    [openNavigation]
  );

  const openNaverMap = useCallback(
    (options?: Partial<NavigationOptions>) => {
      openNavigation("naver", options);
    },
    [openNavigation]
  );

  return {
    openNavigation,
    openKakaoNavi,
    openTMapNavi,
    openNaverMap,
  };
};
