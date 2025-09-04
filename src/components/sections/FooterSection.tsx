import React from "react";

export const FooterSection: React.FC = () => {
  return (
    <footer className="w-full flex items-center justify-between gap-4 mt-auto">
      <p className="text-xs text-gray-500">{import.meta.env.VITE_DATE}</p>
      <p className="text-xs text-gray-500">이 모바일 청첩장은 개발자 신랑이 직접 제작했습니다.</p>
    </footer>
  );
};
