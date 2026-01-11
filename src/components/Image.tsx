import React from "react";

interface ImageProps {
  src: string;
  text?: string;
}

export const Image: React.FC<ImageProps> = ({ src, text }) => {
  return (
    <div className="w-full flex items-center justify-center relative">
      <img
        src={src}
        alt={src}
        className="w-full h-auto object-cover shadow-md select-none"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />
      {text && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center justify-center">
          <p className="text-white text-center font-default-bold text-xl sm:text-2xl px-4">{text}</p>
        </div>
      )}
    </div>
  );
};
