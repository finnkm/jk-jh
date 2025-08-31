import React, { useEffect, useState } from "react";
import { AudioPlayerProvider, useAudioPlayer } from "react-use-audio-player";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeOff } from "lucide-react";

const MusicPlayerInternal: React.FC = () => {
  const { load, togglePlayPause } = useAudioPlayer();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    try {
      load("./music.mp3", {
        autoplay: true,
        loop: true,
        onplay: () => setIsPlaying(true),
        onpause: () => setIsPlaying(false),
        onend: () => setIsPlaying(false),
      });
    } catch (err) {
      console.error("Error loading music:", err);
    }
  }, [load]);

  const handleToggle = () => {
    togglePlayPause();
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="w-full flex justify-end">
      <Button variant="ghost" size="icon" onClick={handleToggle}>
        {isPlaying ? <Volume2 /> : <VolumeOff />}
      </Button>
    </div>
  );
};

export const MusicPlayer = () => {
  return (
    <AudioPlayerProvider>
      <MusicPlayerInternal />
    </AudioPlayerProvider>
  );
};
