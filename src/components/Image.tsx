import React from "react";

interface ImageProps {
  src: string;
  text?: string;
}

export const Image: React.FC<ImageProps> = ({ src, text }) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // 멀티터치(핀치 줌) 즉시 차단
    if (e.touches.length > 1) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // 스크롤 중에도 멀티터치 감지 및 차단
    if (e.touches.length > 1) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // 롱프레스 후 터치 종료 시에도 차단
    // 스크롤 중이면 preventDefault()가 작동하지 않으므로 cancelable 확인
    if (e.cancelable) {
      e.preventDefault();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // 우클릭 및 드래그 방지
    if (e.button === 2 || e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="w-full flex items-center justify-center relative">
      <div className="relative w-full">
        <img
          src={src}
          alt={src}
          className="w-full h-auto object-cover shadow-md select-none pointer-events-none"
          draggable={false}
          onContextMenu={handleContextMenu}
          onDragStart={(e) => e.preventDefault()}
        />
        {/* 투명한 오버레이로 이미지 직접 터치 차단 (스크롤은 허용) */}
        <div
          className="absolute inset-0 z-10"
          onContextMenu={handleContextMenu}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          style={{
            touchAction: "pan-y", // 세로 스크롤만 허용
            WebkitUserSelect: "none",
            userSelect: "none",
            WebkitTouchCallout: "none",
          }}
        />
        {text && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center justify-center z-20 pointer-events-none">
            <p className="text-white text-center font-default-bold text-xl sm:text-2xl px-4">{text}</p>
          </div>
        )}
      </div>
    </div>
  );
};
