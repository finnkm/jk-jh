import React from "react";
import { NaverMap } from "../NaverMap";

export const LocationSection: React.FC = () => {
  return (
    <section className="w-full flex flex-col items-center gap-2">
      <p>오시는 길</p>
      <p>더 베네치아 (루터회관) 3층</p>
      <p>서울 송파구 올림픽로35다길 42</p>
      <NaverMap />
    </section>
  );
};
