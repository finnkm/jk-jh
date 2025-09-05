import React from "react";
import { HeartHandshake } from "lucide-react";
import { MusicPlayer } from "../MusicPlayer";

export const HeaderSection: React.FC = () => {
  return (
    <header className="w-full flex items-center justify-between gap-4 sticky top-0 bottom-0 z-50">
      <div className="flex items-center gap-1 font-default-bold">
        {import.meta.env.VITE_GROOM_NAME}
        <HeartHandshake />
        {import.meta.env.VITE_BRIDE_NAME}
      </div>
      <MusicPlayer />
    </header>
  );
};
