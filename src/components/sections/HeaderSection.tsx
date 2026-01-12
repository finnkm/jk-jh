import React from "react";
import { HeartHandshake } from "lucide-react";
import { MusicPlayer } from "../MusicPlayer";

export const HeaderSection: React.FC = () => {
  return (
    <header className="w-full flex items-center justify-between bg-white sticky top-0 z-99 gap-2 p-4">
      <div className="flex items-center gap-1">
        {import.meta.env.VITE_GROOM_NAME}
        <HeartHandshake />
        {import.meta.env.VITE_BRIDE_NAME}
      </div>
      <MusicPlayer />
    </header>
  );
};
