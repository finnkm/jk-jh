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
    // 롱프레스 및 멀티터치 방지
    if (e.touches.length > 1) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // 멀티터치(핀치) 방지
    if (e.touches.length > 1) {
      e.preventDefault();
      e.stopPropagation();
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
        {/* 투명한 오버레이로 이미지 직접 터치 차단 */}
        <div
          className="absolute inset-0 z-10"
          onContextMenu={handleContextMenu}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onMouseDown={handleMouseDown}
          style={{ touchAction: "none", WebkitUserSelect: "none", userSelect: "none" }}
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
