import React from "react";
import { HeartHandshake } from "lucide-react";
import { MusicPlayer } from "../MusicPlayer";

export const HeaderSection: React.FC = () => {
  return (
    <header className="w-full flex items-center justify-between gap-4 sticky bottom-0">
      <div className="flex items-center gap-1 font-default-bold">
        김재권
        <HeartHandshake />
        김지현
      </div>
      <MusicPlayer />
    </header>
  );
};
