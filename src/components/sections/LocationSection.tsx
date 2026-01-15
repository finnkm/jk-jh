import React from "react";
import { NaverMap } from "../NaverMap";

export const LocationSection: React.FC = () => {
  return (
    <section className="w-full flex items-center justify-center flex-col gap-6">
      <div className="flex flex-col items-center gap-2 mb-2">
        <h2 className="font-default-bold text-xl">Location</h2>
      </div>
      <div className="flex flex-col items-center gap-3 text-center max-w-md">
        <div className="flex flex-col items-center gap-1">
          <p className="text-base font-medium">잠실 더 베네치아 루터회관 3층</p>
          <p className="text-sm text-gray-600">{import.meta.env.VITE_ADDRESS}</p>
        </div>
      </div>
      <div className="w-full max-w-2xl">
        <NaverMap />
      </div>
    </section>
  );
};
