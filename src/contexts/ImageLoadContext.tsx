import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import image11 from "@/assets/KJK_0037.webp";
import image1 from "@/assets/KJK_0843.webp";
import image2 from "@/assets/KJK_0984.webp";
import image3 from "@/assets/KJK_1179.webp";
import image4 from "@/assets/KJK_1703.webp";
import image13 from "@/assets/KJK_1911.webp";
import image14 from "@/assets/KJK_1992.webp";
import image5 from "@/assets/KJK_2158.webp";
import image12 from "@/assets/KJK_2307.webp";
import image6 from "@/assets/KJK_2504.webp";
import image10 from "@/assets/KJK_2589.webp";
import image8 from "@/assets/KJK_2842.webp";
import image9 from "@/assets/KJK_2932.webp";
import image7 from "@/assets/KJK_3048.webp";

// 갤러리 이미지 배열
export const galleryImages = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
  image11,
  image12,
  image13,
  image14,
];

// 이미지 캐시 관리
interface ImageCacheEntry {
  loaded: boolean;
  loading: boolean;
  error: boolean;
  timestamp: number;
}

const imageCache = new Map<string, ImageCacheEntry>();
const loadingPromises = new Map<string, Promise<void>>();

// 이미지 프리로드 유틸리티
export const preloadImage = (src: string): Promise<void> => {
  // 이미 로드된 이미지는 즉시 반환
  const cached = imageCache.get(src);
  if (cached?.loaded) {
    return Promise.resolve();
  }

  // 에러 상태인 경우 캐시를 초기화하여 재시도 가능하도록 함
  if (cached?.error) {
    imageCache.delete(src);
  }

  // 이미 로딩 중인 이미지는 기존 Promise 반환
  const existingPromise = loadingPromises.get(src);
  if (existingPromise) {
    return existingPromise;
  }

  // 새로 로딩 시작
  const promise = new Promise<void>((resolve, reject) => {
    // 캐시에 로딩 상태 추가
    imageCache.set(src, {
      loaded: false,
      loading: true,
      error: false,
      timestamp: Date.now(),
    });

    // 브라우저 캐시 확인
    const img = new Image();

    img.onload = () => {
      imageCache.set(src, {
        loaded: true,
        loading: false,
        error: false,
        timestamp: Date.now(),
      });
      loadingPromises.delete(src);
      resolve();
    };

    img.onerror = () => {
      imageCache.set(src, {
        loaded: false,
        loading: false,
        error: true,
        timestamp: Date.now(),
      });
      loadingPromises.delete(src);
      reject(new Error(`Failed to load image: ${src}`));
    };

    img.src = src;
  });

  loadingPromises.set(src, promise);
  return promise;
};

// 이미지가 로드되었는지 확인 (전역 캐시 확인)
export const isImageLoaded = (src: string): boolean => {
  return imageCache.get(src)?.loaded ?? false;
};

// 이미지 로드 상태를 관리하는 Context
interface ImageLoadContextType {
  galleryImages: string[];
  markImageLoaded: (src: string) => void;
  isImageLoaded: (src: string) => boolean;
  preloadImage: (src: string) => Promise<void>;
  observeImage: (element: HTMLElement | null, src: string) => void;
  unobserveImage: (src: string) => void;
}

const ImageLoadContext = createContext<ImageLoadContextType | null>(null);

// 초기 프리로드: 첫 화면에 보일 이미지들
const preloadInitialImages = () => {
  const initialCount = Math.min(15, galleryImages.length);
  const initialImages = galleryImages.slice(0, initialCount);

  // 동시에 여러 이미지를 로드하되, 우선순위에 따라 약간의 지연
  initialImages.forEach((src, index) => {
    // 첫 6개는 즉시, 나머지는 약간의 지연
    const delay = index < 6 ? 0 : (index - 6) * 30;
    setTimeout(() => {
      // 에러 상태가 아닌 경우에만 프리로드 (에러 상태는 나중에 재시도 가능)
      const cached = imageCache.get(src);
      if (!cached?.loaded && !cached?.error) {
        preloadImage(src).catch(() => {
          // 에러는 무시 (나중에 IntersectionObserver나 실제 img 태그에서 재시도)
        });
      }
    }, delay);
  });
};

// Context Provider 컴포넌트
export const ImageLoadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedElementsRef = useRef<Map<string, HTMLElement>>(new Map());

  // 이미지 요소를 Observer에서 제거하는 함수
  const unobserveImage = useCallback((src: string) => {
    const element = observedElementsRef.current.get(src);
    if (element && observerRef.current) {
      observerRef.current.unobserve(element);
      observedElementsRef.current.delete(src);
    }
  }, []);

  // 전역 캐시만 사용하므로 상태 관리 불필요
  // markImageLoaded는 전역 캐시만 업데이트
  const markImageLoaded = useCallback(
    (src: string) => {
      // 전역 캐시에만 저장 (상태 업데이트 없음 - 무한 루프 방지)
      imageCache.set(src, {
        loaded: true,
        loading: false,
        error: false,
        timestamp: Date.now(),
      });
      // 로드 완료된 이미지는 Observer에서 제거
      unobserveImage(src);
    },
    [unobserveImage]
  );

  // HTML에서 preload된 이미지 확인 및 캐시에 마크
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkPreloadedImages = () => {
      // HTML의 preload 링크에서 이미지 경로 추출
      const preloadLinks = document.querySelectorAll('link[rel="preload"][as="image"]');
      preloadLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href) {
          // 브라우저가 이미 로드한 이미지인지 확인
          const img = new Image();
          img.src = href;

          // 이미 로드된 경우 즉시 캐시에 마크
          if (img.complete && img.naturalHeight !== 0) {
            markImageLoaded(href);
          } else {
            // 로드 중이거나 완료되면 캐시에 마크
            img.onload = () => {
              markImageLoaded(href);
            };
          }
        }
      });
    };

    // DOMContentLoaded 시점에 확인 (이미지가 preload되어 있을 수 있음)
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", checkPreloadedImages);
    } else {
      checkPreloadedImages();
    }
  }, [markImageLoaded]);

  // 초기 프리로드 실행
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (document.readyState === "complete") {
        preloadInitialImages();
      } else {
        window.addEventListener("load", preloadInitialImages);
        return () => {
          window.removeEventListener("load", preloadInitialImages);
        };
      }
    }
  }, []);

  // IntersectionObserver로 모든 이미지 자동 프리로드
  useEffect(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const element = entry.target as HTMLElement;
              const imageSrc = element.getAttribute("data-image-src");
              if (imageSrc && !isImageLoaded(imageSrc)) {
                preloadImage(imageSrc)
                  .then(() => {
                    // preloadImage가 성공하면 캐시에 이미 loaded 상태로 저장됨
                    // Observer에서 제거
                    unobserveImage(imageSrc);
                  })
                  .catch(() => {
                    // 에러는 무시 (나중에 재시도 가능)
                  });
              }
            }
          });
        },
        {
          rootMargin: "600px",
          threshold: 0.01,
        }
      );
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [unobserveImage]);

  // 이미지 요소를 Observer에 등록하는 함수
  const observeImage = useCallback((element: HTMLElement | null, src: string) => {
    if (!element || !observerRef.current) return;

    // 이미 로드된 이미지는 관찰하지 않음
    if (isImageLoaded(src)) {
      return;
    }

    element.setAttribute("data-image-src", src);
    observedElementsRef.current.set(src, element);
    observerRef.current.observe(element);
  }, []);

  // 전역 캐시만 확인하는 안정적인 함수
  const isImageLoadedContext = useCallback((src: string) => {
    return imageCache.get(src)?.loaded ?? false;
  }, []); // dependency 없음 - 항상 안정적

  // value를 useMemo로 안정화 (함수들은 안정적이므로 한 번만 생성)
  const value = useMemo(
    () => ({
      galleryImages,
      markImageLoaded,
      isImageLoaded: isImageLoadedContext, // isImageLoaded와 동일한 함수
      preloadImage,
      observeImage,
      unobserveImage,
    }),
    [markImageLoaded, isImageLoadedContext, observeImage, unobserveImage]
  );

  return <ImageLoadContext.Provider value={value}>{children}</ImageLoadContext.Provider>;
};

// Context 사용 훅
export const useImageLoad = () => {
  const context = useContext(ImageLoadContext);
  if (!context) {
    throw new Error("useImageLoad must be used within ImageLoadProvider");
  }
  return context;
};
