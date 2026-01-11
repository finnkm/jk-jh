import React, { useEffect, useRef, useState } from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogFooter } from "@/components/ui/dialog";

interface GallerySectionProps {
  images: string[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [startX, setStartX] = useState<number>(0);
  const [currentX, setCurrentX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setCurrentX(0);
  };

  const closeModal = () => {
    setSelectedIndex(null);
    setCurrentX(0);
  };

  const goToNext = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    setIsNavigating(true);
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setCurrentX(0);
      setIsDragging(false);
    }
    // 다음 이벤트 루프에서 플래그 리셋
    setTimeout(() => setIsNavigating(false), 0);
  };

  const goToPrev = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    setIsNavigating(true);
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setCurrentX(0);
      setIsDragging(false);
    }
    // 다음 이벤트 루프에서 플래그 리셋
    setTimeout(() => setIsNavigating(false), 0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // 멀티터치는 무시 (핀치 줌 방지)
    if (e.touches.length > 1) return;
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleMouseStart = (e: React.MouseEvent) => {
    // 우클릭은 무시
    if (e.button !== 0) return;
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length > 1) return;
    const currentTouchX = e.touches[0].clientX;
    const diff = currentTouchX - startX;
    setCurrentX(diff);
    // 가로 스와이프만 처리, 세로 스크롤은 허용
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setCurrentX(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const threshold = 50; // 드래그 임계값

    if (currentX > threshold) {
      goToPrev();
    } else if (currentX < -threshold) {
      goToNext();
    }

    setIsDragging(false);
    setCurrentX(0);
  };

  const handleMouseEnd = () => {
    if (!isDragging) return;
    const threshold = 50;

    if (currentX > threshold) {
      goToPrev();
    } else if (currentX < -threshold) {
      goToNext();
    }

    setIsDragging(false);
    setCurrentX(0);
  };

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      if (e.key === "ArrowLeft") {
        goToPrev();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length]);

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      <section className="w-full flex items-center justify-center flex-col gap-6 py-10">
        <div className="flex flex-col items-center gap-2 mb-4">
          <h2 className="font-default-bold text-xl">결혼식 갤러리</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-2xl px-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openModal(index)}
            >
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
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
          <div className="relative w-full h-full flex items-center justify-center overflow-auto hide-scrollbar">
            {/* 이미지 컨테이너 */}
            <div
              data-image-container
              className="relative w-full h-full flex items-center justify-center min-h-full"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={(e) => {
                // 이미지 영역 클릭 시 모달이 닫히지 않도록
                e.stopPropagation();
                handleMouseStart(e);
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseEnd}
              onMouseLeave={handleMouseEnd}
              onClick={(e) => {
                // 이미지 영역 클릭 시 모달이 닫히지 않도록
                e.stopPropagation();
              }}
              style={{ touchAction: "pan-y pinch-zoom" }}
            >
              {selectedIndex !== null && (
                <>
                  <img
                    ref={imageRef}
                    src={images[selectedIndex]}
                    alt={`Gallery image ${selectedIndex + 1}`}
                    className="max-w-full max-h-full object-contain select-none"
                    style={{
                      transform: `translateX(${currentX}px)`,
                      transition: isDragging ? "none" : "transform 0.3s ease-out",
                      maxHeight: "100%",
                    }}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
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
                    goToPrev(e);
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
                    goToNext(e);
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
              <DialogFooter className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
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
