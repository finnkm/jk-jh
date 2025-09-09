import React from "react";

export const FooterSection: React.FC = () => {
  return (
    <footer className="w-full flex items-center justify-between gap-4 mt-auto py-4">
      <p className="text-xs text-gray-500">{import.meta.env.VITE_FOOTER_LEFT_VALUE}</p>
      <p className="text-xs text-gray-500">{import.meta.env.VITE_FOOTER_RIGHT_VALUE}</p>
    </footer>
  );
};
