import React, { useCallback, useEffect, useRef, useState } from "react";
import { XIcon } from "lucide-react";
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
import { Dialog, DialogClose, DialogContent, DialogFooter } from "@/components/ui/dialog";

// 갤러리 이미지 배열
const galleryImages = [
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
const preloadImage = (src: string): Promise<void> => {
  // 이미 로드된 이미지는 즉시 반환
  const cached = imageCache.get(src);
  if (cached?.loaded) {
    return Promise.resolve();
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

// 이미지가 로드되었는지 확인
const isImageLoaded = (src: string): boolean => {
  return imageCache.get(src)?.loaded ?? false;
};

// 초기 프리로드: 첫 화면에 보일 이미지들 (더 많이, 더 빠르게)
const preloadInitialImages = () => {
  // 첫 화면에 보일 이미지들을 더 많이 프리로드 (약 9-12개)
  const initialCount = Math.min(12, galleryImages.length);
  const initialImages = galleryImages.slice(0, initialCount);

  // 동시에 여러 이미지를 로드하되, 우선순위에 따라 약간의 지연
  initialImages.forEach((src, index) => {
    // 첫 6개는 즉시, 나머지는 약간의 지연
    const delay = index < 6 ? 0 : (index - 6) * 30;
    setTimeout(() => {
      if (!isImageLoaded(src)) {
        preloadImage(src).catch(() => {
          // 에러는 무시 (나중에 다시 시도 가능)
        });
      }
    }, delay);
  });
};

// 컴포넌트 마운트 시 초기 이미지 프리로드
if (typeof window !== "undefined") {
  // 페이지 로드 후 약간의 지연을 두고 프리로드 시작
  if (document.readyState === "complete") {
    preloadInitialImages();
  } else {
    window.addEventListener("load", preloadInitialImages);
  }
}

// 이미지 아이템 메모이제이션
const GalleryImageItem = React.memo<{
  image: string;
  index: number;
  onOpenModal: (index: number) => void;
}>(({ image, index, onOpenModal }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isLoaded, setIsLoaded] = useState(() => {
    // 초기 렌더링 시 이미 로드된 이미지인지 확인
    return isImageLoaded(image);
  });

  // 컴포넌트 마운트 시 이미지가 이미 로드되어 있는지 확인
  useEffect(() => {
    // 이미 로드된 이미지는 즉시 eager로 설정
    if (isImageLoaded(image)) {
      setIsLoaded(true);
      return;
    }

    // 이미지 요소가 이미 완전히 로드되었는지 확인 (브라우저 캐시 활용)
    const checkImageLoaded = () => {
      if (imgRef.current && imgRef.current.complete && imgRef.current.naturalHeight !== 0) {
        imageCache.set(image, {
          loaded: true,
          loading: false,
          error: false,
          timestamp: Date.now(),
        });
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    // 약간의 지연 후 확인 (이미지가 브라우저 캐시에서 로드되는 시간 고려)
    const timeoutId = setTimeout(() => {
      if (!isImageLoaded(image) && imgRef.current) {
        checkImageLoaded();
      }
    }, 0);

    // Intersection Observer로 이미지 미리 로드
    if (imgRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && imgRef.current) {
              // 이미 로드된 이미지는 상태만 업데이트
              if (isImageLoaded(image)) {
                setIsLoaded(true);
                return;
              }

              // 이미지가 뷰포트에 들어오면 즉시 미리 로드
              preloadImage(image)
                .then(() => {
                  setIsLoaded(true);
                  // Observer는 유지하여 빠른 스크롤 시에도 대응
                })
                .catch(() => {
                  // 에러 발생 시 Observer는 유지 (나중에 다시 시도 가능)
                });
            } else if (!entry.isIntersecting && isImageLoaded(image)) {
              // 뷰포트를 벗어났지만 이미 로드된 경우 상태 유지
              setIsLoaded(true);
            }
          });
        },
        {
          rootMargin: "600px", // 뷰포트 600px 전에 미리 로드 (빠른 스크롤 대응)
          threshold: 0.01, // 약간만 보여도 트리거
        }
      );

      observerRef.current.observe(imgRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      observerRef.current?.disconnect();
    };
  }, [image]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const touchStartTimeRef = useRef<number>(0);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    // 멀티터치(핀치 줌) 즉시 차단
    if (e.touches.length > 1) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    // 터치 시작 시간과 위치 기록
    touchStartTimeRef.current = Date.now();
    if (e.touches.length === 1) {
      touchStartPosRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // 스크롤 중에도 멀티터치 감지 및 차단
    if (e.touches.length > 1) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    // 터치가 많이 움직였으면 롱프레스가 아님 (스크롤)
    if (touchStartPosRef.current && e.touches.length === 1) {
      const deltaX = Math.abs(e.touches[0].clientX - touchStartPosRef.current.x);
      const deltaY = Math.abs(e.touches[0].clientY - touchStartPosRef.current.y);
      if (deltaX > 10 || deltaY > 10) {
        touchStartPosRef.current = null; // 스크롤로 판단
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // 롱프레스 감지 (500ms 이상 누르고 있고, 움직임이 적은 경우)
    const touchDuration = Date.now() - touchStartTimeRef.current;
    const isLongPress = touchDuration > 500 && touchStartPosRef.current !== null;

    if (isLongPress) {
      // 롱프레스인 경우에만 차단
      e.preventDefault();
      e.stopPropagation();
      touchStartPosRef.current = null;
      return false;
    }
    // 일반 클릭은 허용 (preventDefault 호출 안 함)
    touchStartPosRef.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // 우클릭 및 드래그 방지
    if (e.button === 2 || e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleClick = () => {
    // 마우스 클릭은 항상 허용
    onOpenModal(index);
  };

  const handleTouchEndWithClick = (e: React.TouchEvent) => {
    handleTouchEnd(e);

    // 롱프레스가 아닌 경우에만 모달 열기
    const touchDuration = Date.now() - touchStartTimeRef.current;
    const isLongPress = touchDuration > 500 && touchStartPosRef.current !== null;

    if (!isLongPress && touchStartPosRef.current !== null) {
      // 일반 탭인 경우 모달 열기
      e.preventDefault(); // 기본 동작 방지 (스크롤 등)
      onOpenModal(index);
    }
  };

  return (
    <div
      className="aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90 relative"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEndWithClick}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      style={{
        contain: "strict",
        transform: "translateZ(0)",
        isolation: "isolate",
        WebkitUserSelect: "none",
        userSelect: "none",
        WebkitTouchCallout: "none",
        touchAction: "manipulation", // 더블탭 줌 방지 및 터치 최적화
        WebkitTapHighlightColor: "transparent", // 탭 하이라이트 제거
      }}
    >
      <img
        ref={imgRef}
        src={image}
        alt={`Gallery image ${index + 1}`}
        className="w-full h-full object-cover"
        // 이미 로드된 이미지는 항상 eager로 설정하여 브라우저가 언로드하지 않도록 함
        loading={isLoaded ? "eager" : "lazy"}
        decoding={isLoaded ? "sync" : "async"}
        draggable={false}
        onContextMenu={handleContextMenu}
        onDragStart={(e) => e.preventDefault()}
        onLoad={(e) => {
          // 이미지 로드 완료 시 캐시에 추가하고 상태 업데이트
          const target = e.target as HTMLImageElement;
          if (target.complete && target.naturalHeight !== 0) {
            imageCache.set(image, {
              loaded: true,
              loading: false,
              error: false,
              timestamp: Date.now(),
            });
            setIsLoaded(true);
            observerRef.current?.disconnect();
          }
        }}
        onError={() => {
          // 에러 발생 시 Observer 해제
          observerRef.current?.disconnect();
        }}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          imageRendering: "auto",
          pointerEvents: "none", // 이미지 자체는 클릭 이벤트를 받지 않음
        }}
      />
    </div>
  );
});

GalleryImageItem.displayName = "GalleryImageItem";

export const GallerySection: React.FC = () => {
  const images = galleryImages;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadedModalImages, setLoadedModalImages] = useState<Set<number>>(new Set());
  const imageRef = useRef<HTMLImageElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const lastScrollTop = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const modalTouchStartTimeRef = useRef<number>(0);
  const modalTouchStartPosRef = useRef<{ x: number; y: number } | null>(null);

  // 빠른 스크롤 감지 및 적극적인 프리로딩
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollDelta = Math.abs(currentScrollTop - lastScrollTop.current);
      const scrollingDown = currentScrollTop > lastScrollTop.current;
      lastScrollTop.current = currentScrollTop;

      // 빠른 스크롤 감지 (100px 이상)
      if (scrollDelta > 100) {
        // 현재 뷰포트 기준으로 앞뒤 이미지들을 적극적으로 프리로드
        const viewportTop = currentScrollTop;
        const viewportBottom = currentScrollTop + window.innerHeight;
        const sectionTop = sectionRef.current.offsetTop;
        const sectionBottom = sectionTop + sectionRef.current.offsetHeight;

        // 뷰포트와 겹치는 범위 계산
        if (sectionBottom > viewportTop && sectionTop < viewportBottom) {
          // 갤러리 그리드의 각 이미지 위치 추정 (대략적으로)
          const gridTop = sectionTop + 100; // 헤더 제외
          const imageHeight = 200; // 대략적인 이미지 높이 (gap 포함)

          // 현재 보이는 이미지 인덱스 범위 계산
          const startIndex = Math.max(0, Math.floor((viewportTop - gridTop) / imageHeight));
          const endIndex = Math.min(images.length - 1, Math.ceil((viewportBottom - gridTop) / imageHeight));

          // 앞뒤로 더 많은 이미지 프리로드 (빠른 스크롤 대응)
          const preloadRange = scrollingDown ? 8 : 5; // 아래로 스크롤 시 더 많이
          const preloadStart = Math.max(0, startIndex - (scrollingDown ? 2 : preloadRange));
          const preloadEnd = Math.min(images.length - 1, endIndex + (scrollingDown ? preloadRange : 2));

          // 범위 내의 이미지들을 프리로드
          for (let i = preloadStart; i <= preloadEnd; i++) {
            if (!isImageLoaded(images[i])) {
              preloadImage(images[i]).catch(() => {
                // 에러는 무시
              });
            }
          }
        }
      }

      // 스크롤이 멈춘 후 정리
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        // 스크롤이 멈춘 후 추가 프리로드
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [images]);

  // 모달 이미지 미리 로드
  useEffect(() => {
    if (selectedIndex === null) return;

    // 현재 이미지와 인접한 이미지들을 미리 로드
    const imagesToPreload = [
      selectedIndex,
      selectedIndex > 0 ? selectedIndex - 1 : null,
      selectedIndex < images.length - 1 ? selectedIndex + 1 : null,
    ].filter((idx): idx is number => idx !== null);

    imagesToPreload.forEach((idx) => {
      if (!loadedModalImages.has(idx)) {
        const img = new Image();
        img.src = images[idx];
        img.onload = () => {
          setLoadedModalImages((prev) => new Set([...prev, idx]));
        };
      }
    });
  }, [selectedIndex, images, loadedModalImages]);

  const openModal = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const closeModal = () => {
    setSelectedIndex(null);
  };

  const goToNext = useCallback(
    (e?: React.MouseEvent | React.TouchEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }

      // 중복 실행 방지
      if (isNavigating) return;

      setIsNavigating(true);

      if (selectedIndex !== null && selectedIndex < images.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      }

      // 플래그 리셋
      setTimeout(() => {
        setIsNavigating(false);
      }, 200);
    },
    [selectedIndex, images.length, isNavigating]
  );

  const goToPrev = useCallback(
    (e?: React.MouseEvent | React.TouchEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }

      // 중복 실행 방지
      if (isNavigating) return;

      setIsNavigating(true);

      if (selectedIndex !== null && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      }

      // 플래그 리셋
      setTimeout(() => {
        setIsNavigating(false);
      }, 200);
    },
    [selectedIndex, images.length, isNavigating]
  );

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null || isNavigating) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length, goToPrev, goToNext, isNavigating]);

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      <section ref={sectionRef} className="w-full flex items-center justify-center flex-col gap-6 py-10">
        <div className="flex flex-col items-center gap-2 mb-4">
          <h2 className="font-default-bold text-xl">갤러리</h2>
        </div>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-2xl px-4"
          style={{
            contain: "layout style paint",
          }}
        >
          {images.map((image, index) => (
            <GalleryImageItem key={index} image={image} index={index} onOpenModal={openModal} />
          ))}
        </div>
      </section>

      {/* 이미지 뷰어 모달 */}
      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => {
          // 네비게이션 버튼 클릭 시에는 모달을 닫지 않음
          if (!open && !isNavigating) {
            closeModal();
          }
        }}
      >
        <DialogContent
          className="w-full h-full p-0 bg-transparent border-none rounded-none shadow-none backdrop-blur-0"
          showCloseButton={false}
          onPointerDownOutside={(e) => {
            // 이미지 영역이나 버튼 클릭은 외부 클릭으로 간주하지 않음
            const target = e.target as HTMLElement;
            const button = target.closest('button[aria-label="Previous image"], button[aria-label="Next image"]');
            const imageContainer = target.closest("[data-image-container]");
            if (button || imageContainer || isNavigating) {
              e.preventDefault();
            }
          }}
          onInteractOutside={(e) => {
            // 이미지 영역이나 버튼 클릭은 외부 상호작용으로 간주하지 않음
            const target = e.target as HTMLElement;
            const button = target.closest('button[aria-label="Previous image"], button[aria-label="Next image"]');
            const imageContainer = target.closest("[data-image-container]");
            if (button || imageContainer || isNavigating) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            // ESC 키는 정상적으로 닫기
            if (!isNavigating) {
              closeModal();
            } else {
              e.preventDefault();
            }
          }}
        >
          <div
            className="relative w-full h-full flex items-center justify-center overflow-auto hide-scrollbar"
            style={{
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
            }}
          >
            {/* 이미지 컨테이너 */}
            <div
              data-image-container
              className="relative w-full h-full flex items-center justify-center min-h-full"
              onClick={(e) => {
                // 이미지 영역 클릭 시 모달이 닫히지 않도록
                e.stopPropagation();
              }}
              style={{
                WebkitUserSelect: "none",
                userSelect: "none",
                WebkitTouchCallout: "none",
                touchAction: "pan-y", // 세로 스크롤 허용
              }}
            >
              {selectedIndex !== null && (
                <>
                  {/* 현재 이미지 */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      ref={imageRef}
                      src={images[selectedIndex]}
                      alt={`Gallery image ${selectedIndex + 1}`}
                      className="max-w-full max-h-full object-contain select-none pointer-events-none"
                      style={{
                        maxHeight: "100%",
                      }}
                      loading="eager"
                      decoding="sync"
                      draggable={false}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                      }}
                      onDragStart={(e) => e.preventDefault()}
                      onLoad={() => {
                        // 이미지 로드 완료 시 캐시에 추가
                        imageCache.set(images[selectedIndex], {
                          loaded: true,
                          loading: false,
                          error: false,
                          timestamp: Date.now(),
                        });
                        setLoadedModalImages((prev) => new Set([...prev, selectedIndex]));
                      }}
                    />
                    {/* 투명한 오버레이로 이미지 직접 터치 차단 */}
                    <div
                      className="absolute inset-0 z-10"
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                      }}
                      onTouchStart={(e) => {
                        // 멀티터치(핀치 줌) 즉시 차단
                        if (e.touches.length > 1) {
                          e.preventDefault();
                          e.stopPropagation();
                          return false;
                        }
                        // 터치 시작 시간과 위치 기록
                        modalTouchStartTimeRef.current = Date.now();
                        if (e.touches.length === 1) {
                          modalTouchStartPosRef.current = {
                            x: e.touches[0].clientX,
                            y: e.touches[0].clientY,
                          };
                        }
                      }}
                      onTouchMove={(e) => {
                        // 스크롤 중에도 멀티터치 감지 및 차단
                        if (e.touches.length > 1) {
                          e.preventDefault();
                          e.stopPropagation();
                          return false;
                        }
                        // 터치가 많이 움직였으면 롱프레스가 아님 (스크롤)
                        if (modalTouchStartPosRef.current && e.touches.length === 1) {
                          const deltaX = Math.abs(e.touches[0].clientX - modalTouchStartPosRef.current.x);
                          const deltaY = Math.abs(e.touches[0].clientY - modalTouchStartPosRef.current.y);
                          if (deltaX > 10 || deltaY > 10) {
                            modalTouchStartPosRef.current = null; // 스크롤로 판단
                          }
                        }
                      }}
                      onTouchEnd={(e) => {
                        // 롱프레스 감지 (500ms 이상 누르고 있고, 움직임이 적은 경우)
                        const touchDuration = Date.now() - modalTouchStartTimeRef.current;
                        const isLongPress = touchDuration > 500 && modalTouchStartPosRef.current !== null;

                        if (isLongPress) {
                          // 롱프레스인 경우에만 차단
                          e.preventDefault();
                          e.stopPropagation();
                          modalTouchStartPosRef.current = null;
                          return false;
                        }
                        // 일반 터치/클릭은 허용
                        modalTouchStartPosRef.current = null;
                      }}
                      onMouseDown={(e) => {
                        // 우클릭 및 드래그 방지
                        if (e.button === 2 || e.ctrlKey) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      style={{
                        touchAction: "pan-y", // 세로 스크롤만 허용
                        WebkitUserSelect: "none",
                        userSelect: "none",
                        WebkitTouchCallout: "none",
                        pointerEvents: "auto", // 클릭 이벤트 허용
                        WebkitTapHighlightColor: "transparent", // 탭 하이라이트 제거
                      }}
                    />
                  </div>
                  {/* 이미지 오른쪽 모서리에 닫기 버튼 */}
                  <DialogClose
                    onClick={(e) => {
                      e.stopPropagation();
                      closeModal();
                    }}
                    className="absolute top-2 right-2 z-[102] bg-white/90 hover:bg-white text-black rounded-full p-2 shadow-lg transition-all hover:scale-110"
                    aria-label="Close"
                  >
                    <XIcon className="w-5 h-5" />
                  </DialogClose>
                </>
              )}

              {/* 이전 버튼 */}
              {selectedIndex !== null && selectedIndex > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToPrev(e);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // onClick과 중복 방지
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-50 pointer-events-auto"
                  aria-label="Previous image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
              )}

              {/* 다음 버튼 */}
              {selectedIndex !== null && selectedIndex < images.length - 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToNext(e);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // onClick과 중복 방지
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-50 pointer-events-auto"
                  aria-label="Next image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              )}
            </div>

            {/* 푸터 - 현재 이미지 순서 */}
            {selectedIndex !== null && (
              <DialogFooter className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                <span className="text-sm font-default">
                  {selectedIndex + 1} / {images.length}
                </span>
              </DialogFooter>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
