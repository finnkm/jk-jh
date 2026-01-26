import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { XIcon } from "lucide-react";
import image6 from "@/assets/6.webp"; // 6번
import image7 from "@/assets/7.webp"; // 7번

import image13 from "@/assets/13-1.webp"; // 13번
import image2 from "@/assets/KJK_0635-1.webp"; // 2번

import image5 from "@/assets/KJK_0843-1.webp"; // 5번
import image3 from "@/assets/KJK_0984-1.webp"; // 3번
import image4 from "@/assets/KJK_1138.webp"; // 4번

// 원본 이미지 (모달용)
import image1 from "@/assets/KJK_1179-1.webp"; // 1번

import image9 from "@/assets/KJK_1382-1.webp"; // 9번
import image8 from "@/assets/KJK_1703-1.webp"; // 8번

import image10 from "@/assets/KJK_1802-1.webp"; // 10번

import image14 from "@/assets/KJK_1911-1.webp"; // 14번
import image11 from "@/assets/KJK_2158-1.webp"; // 11번
import image12 from "@/assets/KJK_2160-1.webp"; // 12번

import image15 from "@/assets/KJK_2589-1.webp"; // 15번
import image16 from "@/assets/KJK_2842-1.webp"; // 16번
import image17 from "@/assets/KJK_3207.webp"; // 17번

import thumb6 from "@/assets/thumbnails/6.webp"; // 6번
import thumb7 from "@/assets/thumbnails/7.webp"; // 7번
import thumb13 from "@/assets/thumbnails/13-1.webp"; // 13번

import thumb2 from "@/assets/thumbnails/KJK_0635-1.webp"; // 2번

import thumb5 from "@/assets/thumbnails/KJK_0843-1.webp"; // 5번
import thumb3 from "@/assets/thumbnails/KJK_0984-1.webp"; // 3번
import thumb4 from "@/assets/thumbnails/KJK_1138.webp"; // 4번

// 썸네일 이미지 (갤러리 그리드용)
import thumb1 from "@/assets/thumbnails/KJK_1179-1.webp"; // 1번

import thumb9 from "@/assets/thumbnails/KJK_1382-1.webp"; // 9번
import thumb8 from "@/assets/thumbnails/KJK_1703-1.webp"; // 8번

import thumb10 from "@/assets/thumbnails/KJK_1802-1.webp"; // 10번

import thumb14 from "@/assets/thumbnails/KJK_1911-1.webp"; // 14번
import thumb11 from "@/assets/thumbnails/KJK_2158-1.webp"; // 11번
import thumb12 from "@/assets/thumbnails/KJK_2160-1.webp"; // 12번

import thumb15 from "@/assets/thumbnails/KJK_2589-1.webp"; // 15번
import thumb16 from "@/assets/thumbnails/KJK_2842-1.webp"; // 16번
import thumb17 from "@/assets/thumbnails/KJK_3207.webp"; // 17번
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// 원본 이미지 배열 (모달용)
const originalImages = [
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
  image15,
  image16,
  image17,
];

// 썸네일 이미지 배열 (갤러리 그리드용)
const thumbnailImages = [
  thumb1,
  thumb2,
  thumb3,
  thumb4,
  thumb5,
  thumb6,
  thumb7,
  thumb8,
  thumb9,
  thumb10,
  thumb11,
  thumb12,
  thumb13,
  thumb14,
  thumb15,
  thumb16,
  thumb17,
];

const GalleryImageItem: React.FC<{
  image: string;
  index: number;
  onOpenModal: (index: number) => void;
}> = memo(({ image, index, onOpenModal }) => {
  const touchStartTimeRef = useRef<number>(0);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const hasMovedRef = useRef<boolean>(false); // 터치가 움직였는지 추적

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // 멀티터치(핀치 줌) 즉시 차단
    if (e.touches.length > 1) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    // 터치 시작 시간과 위치 기록
    touchStartTimeRef.current = Date.now();
    hasMovedRef.current = false;
    if (e.touches.length === 1) {
      touchStartPosRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
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
        hasMovedRef.current = true; // 스크롤로 판단
      }
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // 우클릭 및 드래그 방지
    if (e.button === 2 || e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  const handleClick = useCallback(() => {
    // 마우스 클릭은 항상 허용
    onOpenModal(index);
  }, [index, onOpenModal]);

  const handleTouchEndWithClick = useCallback(
    (e: React.TouchEvent) => {
      // 롱프레스 감지 (500ms 이상 누르고 있고, 움직임이 적은 경우)
      const touchDuration = Date.now() - touchStartTimeRef.current;
      const isLongPress = touchDuration > 500 && !hasMovedRef.current && touchStartPosRef.current !== null;

      if (isLongPress) {
        // 롱프레스인 경우에만 차단
        e.preventDefault();
        e.stopPropagation();
        touchStartPosRef.current = null;
        hasMovedRef.current = false;
        return false;
      }

      // 일반 탭인 경우 모달 열기 (롱프레스가 아니고, 스크롤도 아닌 경우)
      if (!hasMovedRef.current && touchStartPosRef.current !== null) {
        e.preventDefault(); // 기본 동작 방지 (스크롤 등)
        e.stopPropagation();
        onOpenModal(index);
      }

      // 상태 초기화
      touchStartPosRef.current = null;
      hasMovedRef.current = false;
    },
    [index, onOpenModal]
  );

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

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
        WebkitUserSelect: "none",
        userSelect: "none",
        WebkitTouchCallout: "none",
        touchAction: "manipulation", // 더블탭 줌 방지 및 터치 최적화
        WebkitTapHighlightColor: "transparent", // 탭 하이라이트 제거
      }}
    >
      <img
        src={image}
        alt={`Gallery image ${index + 1}`}
        className="w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
        draggable={false}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          imageRendering: "auto",
          pointerEvents: "none",
        }}
      />
    </div>
  );
});

const GallerySectionComponent: React.FC = () => {
  const thumbnails = thumbnailImages;
  const originals = originalImages;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const modalTouchStartTimeRef = useRef<number>(0);
  const modalTouchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  // 슬라이드 제스처를 위한 ref
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const swipeDistanceRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isSwipingRef = useRef<boolean>(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openModal = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedIndex(null);
  }, []);

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

      if (selectedIndex !== null && selectedIndex < originals.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      }

      // 플래그 리셋
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
      navigationTimeoutRef.current = setTimeout(() => {
        setIsNavigating(false);
      }, 200);
    },
    [selectedIndex, originals.length, isNavigating]
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
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
      navigationTimeoutRef.current = setTimeout(() => {
        setIsNavigating(false);
      }, 200);
    },
    [selectedIndex, originals.length, isNavigating]
  );

  // cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

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
  }, [selectedIndex, originals.length, goToPrev, goToNext, isNavigating, closeModal]);

  // 이미지 카운트 메모이제이션
  const imageCountText = useMemo(() => {
    if (selectedIndex === null) return "";
    return `${selectedIndex + 1} / ${originals.length}`;
  }, [selectedIndex, originals.length]);

  if (originals.length === 0) {
    return null;
  }

  return (
    <>
      <section className="w-full flex items-center justify-center flex-col gap-6">
        <div className="flex flex-col items-center gap-2 mb-4">
          <h2 className="font-default-bold text-xl">Gallery</h2>
        </div>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-2xl"
          style={{
            contain: "layout style paint",
          }}
        >
          {thumbnails.map((thumbnail, index) => (
            <GalleryImageItem key={index} image={thumbnail} index={index} onOpenModal={openModal} />
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
          <DialogHeader className="sr-only">
            <DialogTitle>갤러리 이미지 뷰어</DialogTitle>
          </DialogHeader>
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
                      src={originals[selectedIndex]}
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
                          const touch = e.touches[0];
                          modalTouchStartPosRef.current = {
                            x: touch.clientX,
                            y: touch.clientY,
                          };
                          // 슬라이드 시작 위치 기록
                          swipeStartRef.current = {
                            x: touch.clientX,
                            y: touch.clientY,
                          };
                          swipeDistanceRef.current = { x: 0, y: 0 };
                          isSwipingRef.current = false;
                        }
                      }}
                      onTouchMove={(e) => {
                        // 스크롤 중에도 멀티터치 감지 및 차단
                        if (e.touches.length > 1) {
                          e.preventDefault();
                          e.stopPropagation();
                          return false;
                        }
                        if (swipeStartRef.current && e.touches.length === 1) {
                          const touch = e.touches[0];
                          const deltaX = touch.clientX - swipeStartRef.current.x;
                          const deltaY = touch.clientY - swipeStartRef.current.y;

                          // 가로 이동이 세로 이동보다 크면 슬라이드로 판단
                          if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
                            isSwipingRef.current = true;
                            swipeDistanceRef.current = { x: deltaX, y: deltaY };
                            // 가로 스와이프 중에는 세로 스크롤 방지
                            if (e.cancelable) {
                              e.preventDefault();
                            }
                          }
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
                        // 슬라이드 제스처 처리
                        if (isSwipingRef.current && swipeStartRef.current) {
                          const minSwipeDistance = 50; // 최소 스와이프 거리
                          const deltaX = swipeDistanceRef.current.x;

                          if (Math.abs(deltaX) > minSwipeDistance && !isNavigating) {
                            if (deltaX > 0) {
                              // 오른쪽으로 스와이프 (이전 이미지)
                              goToPrev(e);
                            } else {
                              // 왼쪽으로 스와이프 (다음 이미지)
                              goToNext(e);
                            }
                            e.preventDefault();
                            e.stopPropagation();
                          }

                          // 슬라이드 상태 초기화
                          isSwipingRef.current = false;
                          swipeStartRef.current = null;
                          swipeDistanceRef.current = { x: 0, y: 0 };
                        }

                        // 롱프레스 감지 (500ms 이상 누르고 있고, 움직임이 적은 경우)
                        const touchDuration = Date.now() - modalTouchStartTimeRef.current;
                        const isLongPress =
                          touchDuration > 500 && modalTouchStartPosRef.current !== null && !isSwipingRef.current;

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
                        // 마우스 드래그 시작 위치 기록 (왼쪽 버튼만)
                        if (e.button === 0) {
                          swipeStartRef.current = {
                            x: e.clientX,
                            y: e.clientY,
                          };
                          swipeDistanceRef.current = { x: 0, y: 0 };
                          isSwipingRef.current = false;
                        }
                      }}
                      onMouseMove={(e) => {
                        if (swipeStartRef.current && e.buttons === 1) {
                          const deltaX = e.clientX - swipeStartRef.current.x;
                          const deltaY = e.clientY - swipeStartRef.current.y;

                          // 가로 이동이 세로 이동보다 크면 슬라이드로 판단
                          if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
                            isSwipingRef.current = true;
                            swipeDistanceRef.current = { x: deltaX, y: deltaY };
                          }
                        }
                      }}
                      onMouseUp={(e) => {
                        // 슬라이드 제스처 처리
                        if (isSwipingRef.current && swipeStartRef.current) {
                          const minSwipeDistance = 50; // 최소 스와이프 거리
                          const deltaX = swipeDistanceRef.current.x;

                          if (Math.abs(deltaX) > minSwipeDistance && !isNavigating) {
                            if (deltaX > 0) {
                              // 오른쪽으로 드래그 (이전 이미지)
                              goToPrev();
                            } else {
                              // 왼쪽으로 드래그 (다음 이미지)
                              goToNext();
                            }
                            e.preventDefault();
                            e.stopPropagation();
                          }

                          // 슬라이드 상태 초기화
                          isSwipingRef.current = false;
                          swipeStartRef.current = null;
                          swipeDistanceRef.current = { x: 0, y: 0 };
                        }
                      }}
                      onMouseLeave={() => {
                        // 마우스가 영역을 벗어나면 슬라이드 취소
                        isSwipingRef.current = false;
                        swipeStartRef.current = null;
                        swipeDistanceRef.current = { x: 0, y: 0 };
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
                    className="absolute top-2 right-2 z-[105] bg-white/90 hover:bg-white text-black rounded-full p-2 shadow-lg transition-all hover:scale-110"
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
              {selectedIndex !== null && selectedIndex < originals.length - 1 && (
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
                <span className="text-sm font-default">{imageCountText}</span>
              </DialogFooter>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const GallerySection = memo(GallerySectionComponent);
