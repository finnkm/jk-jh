import React, { useCallback, useEffect, useRef, useState } from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogFooter } from "@/components/ui/dialog";

interface GallerySectionProps {
  images: string[];
}

// 이미지 로드 상태 추적을 위한 Set
const loadedImages = new Set<string>();

// 이미지 아이템 메모이제이션
const GalleryImageItem = React.memo<{
  image: string;
  index: number;
  onOpenModal: (index: number) => void;
}>(({ image, index, onOpenModal }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isAlreadyLoaded = loadedImages.has(image);

  useEffect(() => {
    // 이미 로드된 이미지는 Observer를 사용하지 않음
    if (isAlreadyLoaded) {
      return;
    }

    // Intersection Observer로 이미지 미리 로드
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imgRef.current && !loadedImages.has(image)) {
            // 이미지가 뷰포트에 들어오면 미리 로드
            const img = new Image();
            img.src = image;
            img.onload = () => {
              loadedImages.add(image);
            };
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: "200px", // 뷰포트 200px 전에 미리 로드
      }
    );

    if (imgRef.current && !loadedImages.has(image)) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [image, isAlreadyLoaded]);

  return (
    <div
      className="aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90"
      onClick={() => onOpenModal(index)}
      style={{
        contain: "strict",
        transform: "translateZ(0)",
        isolation: "isolate",
      }}
    >
      <img
        ref={imgRef}
        src={image}
        alt={`Gallery image ${index + 1}`}
        className="w-full h-full object-cover"
        loading={isAlreadyLoaded ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onLoad={() => {
          // 이미지 로드 완료 시 캐시에 추가
          loadedImages.add(image);
          observerRef.current?.disconnect();
        }}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          imageRendering: "auto",
        }}
      />
    </div>
  );
});

GalleryImageItem.displayName = "GalleryImageItem";

export const GallerySection: React.FC<GallerySectionProps> = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadedModalImages, setLoadedModalImages] = useState<Set<number>>(new Set());
  const imageRef = useRef<HTMLImageElement>(null);

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
      <section className="w-full flex items-center justify-center flex-col gap-6 py-10">
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
          className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-transparent border-none rounded-none shadow-none backdrop-blur-0"
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
            >
              {selectedIndex !== null && (
                <>
                  {/* 현재 이미지 */}
                  <img
                    ref={imageRef}
                    src={images[selectedIndex]}
                    alt={`Gallery image ${selectedIndex + 1}`}
                    className="max-w-full max-h-full object-contain select-none"
                    style={{
                      maxHeight: "100%",
                    }}
                    loading="eager"
                    decoding="sync"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onLoad={() => {
                      // 이미지 로드 완료 시 캐시에 추가
                      loadedImages.add(images[selectedIndex]);
                      setLoadedModalImages((prev) => new Set([...prev, selectedIndex]));
                    }}
                  />
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
